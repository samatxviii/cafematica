-- Execute as database owner. Never expose the service-role key in the website.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;
create table private.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table private.admins enable row level security;
revoke all on private.admins from anon, authenticated;
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from private.admins where user_id = auth.uid());
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create table public.cms_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 90),
  title text not null check (length(title) between 5 and 160),
  description text not null check (length(description) between 30 and 300),
  category text not null check (category in ('matematica','latex','tecnologia')),
  body text not null default '' check (length(body) <= 100000),
  youtube text not null default '' check (youtube = '' or youtube ~ '^[A-Za-z0-9_-]{11}$'),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  publication_status text not null default 'draft' check (publication_status in ('draft','queued')),
  github_sha text,
  queued_version integer,
  publish_lock_until timestamptz,
  publish_token uuid
);
alter table public.cms_posts enable row level security;
revoke all on public.cms_posts from anon, authenticated;
grant select on public.cms_posts to authenticated;
create policy admin_read_posts on public.cms_posts for select to authenticated using ((select private.is_admin()));

create table public.published_posts (
 slug text primary key,
 title text not null,
 published_at timestamptz not null default now()
);
alter table public.published_posts enable row level security;
revoke all on public.published_posts from anon, authenticated;
grant select on public.published_posts to anon, authenticated;
create policy read_published_posts on public.published_posts for select using (true);

create table public.comments (
 id uuid primary key default gen_random_uuid(),
 post_slug text not null references public.published_posts(slug) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 display_name text not null check (length(display_name) between 1 and 80),
 body text not null check (length(body) between 3 and 2000),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
create index comments_public_index on public.comments (post_slug,status,created_at);
create index comments_moderation_index on public.comments (status,created_at);
create index comments_rate_index on public.comments (user_id,created_at);
alter table public.comments enable row level security;
revoke all on public.comments from anon, authenticated;
grant select (id,post_slug,display_name,body,status,created_at) on public.comments to anon, authenticated;
create policy approved_comments on public.comments for select using (status='approved');
create policy admin_comments on public.comments for select to authenticated using ((select private.is_admin()));

create or replace function private.save_post(p_id uuid,p_version integer,p_slug text,p_title text,p_description text,p_category text,p_body text,p_youtube text default '')
returns public.cms_posts language plpgsql security definer set search_path = '' as $$
declare result public.cms_posts;
begin
 if not private.is_admin() then raise exception 'Acesso negado' using errcode='42501'; end if;
 if p_id is null then
   insert into public.cms_posts(slug,title,description,category,body,youtube)
   values(trim(p_slug),trim(p_title),trim(p_description),p_category,p_body,trim(p_youtube)) returning * into result;
 else
   select * into result from public.cms_posts where id=p_id for update;
   if result.id is null then raise exception 'Artigo não encontrado'; end if;
   if result.version <> p_version then raise exception 'O artigo foi alterado em outra sessão. Reabra antes de salvar.'; end if;
   if result.publish_lock_until > now() then raise exception 'Publicação em andamento. Aguarde antes de salvar.'; end if;
   if result.published_at is not null and result.slug <> trim(p_slug) then raise exception 'O endereço de um artigo já publicado não pode ser alterado.'; end if;
   update public.cms_posts set slug=trim(p_slug),title=trim(p_title),description=trim(p_description),category=p_category,
    body=p_body,youtube=trim(p_youtube),version=version+1,updated_at=now(),publication_status='draft'
    where id=p_id returning * into result;
 end if;
 return result;
end; $$;

create or replace function private.submit_comment(p_slug text,p_body text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); person text; result uuid;
begin
 if uid is null or not exists(select 1 from auth.identities where user_id=uid and provider='google') then
   raise exception 'Entre com sua conta Google para comentar.' using errcode='42501';
 end if;
 if p_body is null or length(trim(p_body)) not between 3 and 2000 then raise exception 'Escreva entre 3 e 2000 caracteres.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 if exists(select 1 from public.comments where user_id=uid and created_at > now()-interval '1 minute')
 or (select count(*) from public.comments where user_id=uid and created_at>now()-interval '1 day')>=20 then
  raise exception 'Aguarde antes de enviar outro comentário.' using errcode='P0001';
 end if;
 select left(coalesce(nullif(trim(raw_user_meta_data->>'full_name'),''),nullif(trim(raw_user_meta_data->>'name'),''),'Leitor'),80) into person from auth.users where id=uid;
 -- Use a public display name, never an email address.
 if position('@' in person)>0 then person := 'Leitor'; end if;
 insert into public.comments(post_slug,user_id,display_name,body) values(p_slug,uid,coalesce(person,'Leitor'),trim(p_body)) returning id into result;
 return result;
end; $$;

create or replace function private.moderate_comment(p_id uuid,p_status text) returns void
language plpgsql security definer set search_path = '' as $$
begin
 if not private.is_admin() then raise exception 'Acesso negado' using errcode='42501'; end if;
 if p_status not in ('approved','rejected','pending') then raise exception 'Status inválido'; end if;
 update public.comments set status=p_status where id=p_id;
 if not found then raise exception 'Comentário não encontrado'; end if;
end; $$;

-- Edge Function takes a lease, so concurrent publish/save cannot mix revisions.
create or replace function private.claim_publication(p_id uuid,p_version integer,p_token uuid) returns public.cms_posts
language plpgsql security definer set search_path = '' as $$
declare result public.cms_posts;
begin
 update public.cms_posts set publish_lock_until=now()+interval '3 minutes',publish_token=p_token
 where id=p_id and version=p_version and (publish_lock_until is null or publish_lock_until<now()) returning * into result;
 if result.id is null then raise exception 'Versão alterada ou publicação em andamento.'; end if;
 return result;
end; $$;
create or replace function private.complete_publication(p_id uuid,p_token uuid,p_sha text,p_date timestamptz) returns void
language plpgsql security definer set search_path = '' as $$
declare result public.cms_posts;
begin
 update public.cms_posts set github_sha=p_sha,publication_status='queued',queued_version=version,
  published_at=coalesce(published_at,p_date),publish_lock_until=null,publish_token=null
 where id=p_id and publish_token=p_token returning * into result;
 if result.id is null then raise exception 'Publicação não encontrada'; end if;
 insert into public.published_posts(slug,title,published_at) values(result.slug,result.title,result.published_at)
 on conflict(slug) do update set title=excluded.title;
end; $$;
revoke all on function private.save_post(uuid,integer,text,text,text,text,text,text) from public;
revoke all on function private.submit_comment(text,text) from public;
revoke all on function private.moderate_comment(uuid,text) from public;
revoke all on function private.claim_publication(uuid,integer,uuid) from public;
revoke all on function private.complete_publication(uuid,uuid,text,timestamptz) from public;
grant execute on function private.save_post(uuid,integer,text,text,text,text,text,text), private.submit_comment(text,text),private.moderate_comment(uuid,text) to authenticated;
grant execute on function private.claim_publication(uuid,integer,uuid),private.complete_publication(uuid,uuid,text,timestamptz) to service_role;
grant all on public.cms_posts, public.published_posts, public.comments to service_role;

create or replace function public.is_admin() returns boolean
language sql stable security invoker set search_path = '' as $$
 select private.is_admin();
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.save_post(p_id uuid,p_version integer,p_slug text,p_title text,p_description text,p_category text,p_body text,p_youtube text default '') returns public.cms_posts
language sql volatile security invoker set search_path = '' as $$
 select * from private.save_post(p_id,p_version,p_slug,p_title,p_description,p_category,p_body,p_youtube);
$$;
revoke all on function public.save_post(uuid,integer,text,text,text,text,text,text) from public;
grant execute on function public.save_post(uuid,integer,text,text,text,text,text,text) to authenticated;

create or replace function public.submit_comment(p_slug text,p_body text) returns uuid
language sql volatile security invoker set search_path = '' as $$
 select private.submit_comment(p_slug,p_body);
$$;
revoke all on function public.submit_comment(text,text) from public;
grant execute on function public.submit_comment(text,text) to authenticated;

create or replace function public.moderate_comment(p_id uuid,p_status text) returns void
language sql volatile security invoker set search_path = '' as $$
 select private.moderate_comment(p_id,p_status);
$$;
revoke all on function public.moderate_comment(uuid,text) from public;
grant execute on function public.moderate_comment(uuid,text) to authenticated;

create or replace function public.claim_publication(p_id uuid,p_version integer,p_token uuid) returns public.cms_posts
language sql volatile security invoker set search_path = '' as $$
 select * from private.claim_publication(p_id,p_version,p_token);
$$;
revoke all on function public.claim_publication(uuid,integer,uuid) from public;
grant execute on function public.claim_publication(uuid,integer,uuid) to service_role;

create or replace function public.complete_publication(p_id uuid,p_token uuid,p_sha text,p_date timestamptz) returns void
language sql volatile security invoker set search_path = '' as $$
 select private.complete_publication(p_id,p_token,p_sha,p_date);
$$;
revoke all on function public.complete_publication(uuid,uuid,text,timestamptz) from public;
grant execute on function public.complete_publication(uuid,uuid,text,timestamptz) to service_role;
