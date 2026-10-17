-- Capas e imagens para artigos; acesso de escrita restrito ao administrador.
alter table public.cms_posts
  add column if not exists cover text not null default ''
  constraint cms_posts_cover_length check (length(cover)<=1024);

create or replace function private.save_post_with_cover(
 p_id uuid,p_version integer,p_slug text,p_title text,p_description text,
 p_category text,p_body text,p_youtube text,p_cover text
) returns public.cms_posts
language plpgsql security definer set search_path = '' as $$
declare result public.cms_posts;
begin
 if not private.is_admin() then raise exception 'Acesso negado' using errcode='42501'; end if;
 if p_cover is null or length(p_cover)>1024 then raise exception 'Endereço de capa inválido.'; end if;
 select * into result from private.save_post(p_id,p_version,p_slug,p_title,p_description,p_category,p_body,p_youtube);
 update public.cms_posts set cover=trim(p_cover) where id=result.id returning * into result;
 return result;
end;
$$;
revoke all on function private.save_post_with_cover(uuid,integer,text,text,text,text,text,text,text) from public;
grant execute on function private.save_post_with_cover(uuid,integer,text,text,text,text,text,text,text) to authenticated;

create or replace function public.save_post_with_cover(
 p_id uuid,p_version integer,p_slug text,p_title text,p_description text,
 p_category text,p_body text,p_youtube text,p_cover text
) returns public.cms_posts
language sql volatile security invoker set search_path = '' as $$
 select * from private.save_post_with_cover(p_id,p_version,p_slug,p_title,p_description,p_category,p_body,p_youtube,p_cover);
$$;
revoke all on function public.save_post_with_cover(uuid,integer,text,text,text,text,text,text,text) from public;
grant execute on function public.save_post_with_cover(uuid,integer,text,text,text,text,text,text,text) to authenticated;

-- As imagens publicadas são públicas; upload e remoção dependem do administrador.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('article-images','article-images',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy cafematica_admin_images_insert on storage.objects
for insert to authenticated with check (bucket_id='article-images' and (select private.is_admin()));
create policy cafematica_admin_images_select on storage.objects
for select to authenticated using (bucket_id='article-images' and (select private.is_admin()));
create policy cafematica_admin_images_delete on storage.objects
for delete to authenticated using (bucket_id='article-images' and (select private.is_admin()));
