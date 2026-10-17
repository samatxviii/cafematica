# Administração do Cafemática — GitHub Pages + Supabase

Não há Render nem outro servidor de hospedagem. O site público e o painel ficam no GitHub Pages; o Supabase cuida da identidade, dos rascunhos, das imagens e das permissões. O publicador usa uma Edge Function para gravar artigos no GitHub.

## O que já está configurado

- Projeto Supabase: `cafematica-site`, ID `bgzxqfslersfmsluuszs`, região São Paulo.
- Banco de dados com migrações `cms_schema`, `initial_articles` e `cms_cover_storage`.
- Os 10 artigos existentes foram importados preservando seus IDs e slugs.
- Tabelas com RLS ativo e administrador autorizado por `private.admins`.
- Bucket público `article-images`, com escrita somente para administradores; imagens de até 5 MB em JPG/PNG/WebP/AVIF.
- Edge Function `publish-post` implantada, com validação de sessão e autorização administrativa.
- Painel em `https://www.cafematica.com.br/admin/`, autenticação Google OAuth ou link por e-mail sem entrada de senha no GitHub Pages.
- URL e chave **publishable** no código público, sem tokens secretos de GitHub ou Supabase.

## Passos que exigem acesso às contas externas

### 1. URLs de autenticação do Supabase

Abra [Supabase Auth — URL Configuration](https://supabase.com/dashboard/project/bgzxqfslersfmsluuszs/auth/url-configuration).

- **Site URL:** `https://www.cafematica.com.br`
- **Redirect URLs:** `https://www.cafematica.com.br/admin/` e `https://www.cafematica.com.br/blog/**` (esta segunda rota somente quando comentários Google forem ativados).

Para o primeiro acesso administrativo, pode-se usar **Enviar link de acesso**, sem configurar o Google. O provedor de e-mail do Supabase tem limites de envio; não repita muitos links. Abra o link no mesmo navegador em que o solicitou.

### 2. Conta administrativa

Entre no painel com um endereço de e-mail sob seu controle; depois autorize o UUID real da conta. A autorização **não** é feita pela página pública, apenas pelo banco. Após o primeiro login, um operador com acesso administrativo ao projeto pode conferir a identidade no Supabase Auth e executar:

```sql
insert into private.admins(user_id)
select id from auth.users
where lower(email)=lower('EMAIL_CONFIRMADO_DO_ADMIN')
  and email_confirmed_at is not null
on conflict (user_id) do nothing;
```

Substitua o marcador por um endereço previamente confirmado pelo proprietário. Confira que somente a conta autorizada foi incluída. Não copie senhas, links mágicos ou tokens para conversas.

### 3. Permissão de publicar no GitHub

A Edge Function `publish-post` precisa de um segredo **GITHUB_TOKEN** configurado somente no [painel de segredos das Edge Functions](https://supabase.com/dashboard/project/bgzxqfslersfmsluuszs/functions/secrets).

Crie um [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) restrito a `samatxviii/cafematica` com permissão **Contents: Read and write**. Ajuste a expiração e rotacione quando necessário. **Não envie o token por mensagens e nunca insira em `config/site.json`.**

Os valores `GITHUB_REPOSITORY=samatxviii/cafematica`, `GITHUB_BRANCH=main` e `ADMIN_ORIGINS=https://www.cafematica.com.br` já têm valores padrão explícitos no código da função.

### 4. Google (opcional para primeiro acesso; obrigatório para comentários de leitores)

Para o botão **Continuar com Google**, configure o provedor Google em [Supabase Auth — Providers](https://supabase.com/dashboard/project/bgzxqfslersfmsluuszs/auth/providers).
Crie o OAuth Client ID de tipo **Web application** no [Google Auth Platform](https://console.cloud.google.com/auth/clients), com:

- **Origem JavaScript autorizada:** `https://www.cafematica.com.br`
- **URI de redirecionamento autorizada:** `https://bgzxqfslersfmsluuszs.supabase.co/auth/v1/callback`
- Permissões mínimas: `openid`, `email` e `profile`.

Preencha o Client ID e o Client Secret **somente** no Supabase. Para comentários de leitores, habilite `commentsEnabled` apenas depois de testar o OAuth e a moderação.

## Como trabalhar após configurar

Acesse `/admin/` e entre. Em **Seus artigos**, selecione uma das 10 publicações importadas ou clique **+ Novo**. Edite texto, fórmulas em LaTeX, título, resumo e imagens. Salve o rascunho. A prévia não publica nada. Ao clicar **Publicar no site**, a Edge Function verifica a permissão, envia o Markdown ao GitHub e o GitHub Actions recompila o site.

Verifique a página publicada e a execução em [GitHub Actions](https://github.com/samatxviii/cafematica/actions). O retorno **Enviado** não significa publicação concluída até o deploy terminar.

## Segurança e limites

- A chave publicável é deliberadamente visível no JavaScript; a autorização real é feita no banco (RLS e RPC) e na Edge Function.
- Nenhum usuário pode se promover a administrador pelo navegador.
- O GitHub Pages não recebe uma senha de administração; o login externo cria a sessão no Supabase.
- As imagens de artigos são públicas por URL logo após o envio, antes mesmo de publicar o texto; não envie imagens sensíveis.
- No plano gratuito, respeite os limites do Supabase Storage, Auth e Edge Functions.
- Não desative RLS, não use service-role keys no frontend e não compartilhe tokens privados.
