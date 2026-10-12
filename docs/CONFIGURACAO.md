# Ativação do painel e dos comentários

O código está pronto para configuração. Não há projeto Supabase associado, conta administrativa provisionada, credenciais Google configuradas ou segredos GitHub implantados nesta etapa. Não marque os recursos como ativos antes da validação real.

## 1. Projeto Supabase

Use a organização `cafematica` e, preferencialmente, a região São Paulo (`sa-east-1`). Confira o preço apresentado pelo serviço antes de criar o projeto; não habilite cobranças nem altere o plano automaticamente.

As migrações estão em `supabase/migrations/`, na ordem:

- `cms_schema`: tabelas, permissões e funções.
- `initial_articles`: importação dos dez artigos públicos iniciais, sem substituir rascunhos posteriores.

Aplique as migrações no projeto escolhido. Execute os advisors de segurança e verifique as tabelas e políticas. Os testes locais usam PostgreSQL real via PGlite com as identidades do Auth simuladas; não substituem um teste de integração com Supabase Auth e Google.

O schema `private` não deve ser exposto na Data API. As funções privadas têm permissões explícitas, `search_path` vazio e verificações no servidor. As RPCs públicas são `SECURITY INVOKER`. `anon` só lê o catálogo e os campos públicos de comentários aprovados. `authenticated` não pode inserir diretamente em tabelas ou se tornar administrador.

## 2. Administrador

Crie o usuário em Supabase Auth com seu e-mail real e uma senha exclusiva de pelo menos 12 caracteres. Não use senhas do código legado. Não envie senhas ao GitHub.

Associe o UUID real dessa conta a `private.admins`, por operação administrativa autenticada. Exemplo com marcador que deve ser substituído, nunca executado literalmente:

```sql
insert into private.admins(user_id)
select id from auth.users where email = 'SEU_EMAIL_REAL';
```

Confira que exatamente uma conta foi associada. Não há cadastro administrativo pelo navegador. Desative o cadastro público por senha se não for utilizado; preserve o cadastro pelo provedor Google para leitores. Configure proteção contra força bruta, senha forte e recuperação de conta. A entrega de recuperação de senha exige SMTP funcional; o provedor de e-mail de teste do Supabase tem restrições.

## 3. Hospedagem do painel

O GitHub Pages desaconselha transações sensíveis, incluindo envio de senhas. O painel foi projetado para uma origem separada, por exemplo Cloudflare Pages em `https://admin.cafematica.com.br`.

1. Hospede `admin-dist/` (gerado por `npm run build && npm run admin:build`) no serviço escolhido.
2. Configure HTTPS e o domínio. A origem precisa funcionar antes da ativação.
3. Em `config/site.json`, preencha `adminUrl` com `https://ENDERECO_REAL/admin/`, `supabaseUrl` e uma chave **publishable** ativa. Essas são configurações públicas.
4. Mude `authEnabled` para `true` somente após testar a conta e as permissões.
5. Recompile o site e o painel com a mesma configuração.

O painel recusa entrada de senha na origem do site público ou em `*.github.io`. Seus cabeçalhos incluem noindex, restrição de enquadramento e CSP. O botão discreto de cadeado usa `adminUrl`.

## 4. Google para leitores

No Google Auth Platform, registre o aplicativo web com as URLs públicas de privacidade e termos. Use apenas `openid`, e-mail e perfil. Crie um OAuth Client ID para web.

- Origem: `https://www.cafematica.com.br`.
- Callback autorizado no Google: `https://REF_DO_PROJETO.supabase.co/auth/v1/callback`.
- Supabase Auth: habilite Google com o Client ID e Client Secret reais.
- Supabase Site URL: `https://www.cafematica.com.br`.
- Redirect URLs: `https://www.cafematica.com.br/blog/**` e a URL exata do painel `/admin/` para recuperação.
- Teste Google com uma conta comum, incluindo cancelamento e retorno ao mesmo artigo. Configure a audiência de produção do OAuth; aplicativos em teste restringem usuários.

O segredo Google deve permanecer nas configurações privadas do Supabase. Nunca inclua em `config/site.json`. Ative `commentsEnabled` somente depois do teste real. Atualize os textos de privacidade e cookies para refletir os serviços e a região efetivamente usados.

## 5. Publicação pelo painel

Implante a função `publish-post` junto com `_shared/publish.ts`. Ela valida o usuário com `auth.getUser()` e consulta a permissão administrativa; por isso a verificação JWT legada do gateway está desativada. Não remova a autenticação implementada no corpo.

Segredos da Edge Function:

- `ADMIN_ORIGINS`: origem exata do painel (sem barra final). Não use `*`.
- `GITHUB_REPOSITORY`: `samatxviii/cafematica`.
- `GITHUB_BRANCH`: `main`.
- `GITHUB_TOKEN`: token de escopo restrito, com `Contents: write` apenas para esse repositório. Uma GitHub App é uma alternativa para rotação automática. O token nunca vai para o navegador.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: variáveis padrão da Edge Function. O cliente público usa a publishable key; a compatibilidade com a anon key é necessária somente nesse componente servidor quando usada para verificar a sessão do usuário.

A função aceita apenas o ID do artigo e sua versão. Uma trava impede publicar enquanto outra sessão modifica o mesmo rascunho. O commit usa avanço normal da branch, sem force push. Colisões com um artigo que pertença a outro ID são recusadas. Não há exclusão de artigos publicados pelo painel nesta versão.

O envio ao GitHub retorna “enviado”. Falhas no build não são confundidas com publicação concluída. Confira o workflow e a página pública. O arquivo público `publication.json` contém as versões efetivamente compiladas, sem rascunhos.

## 6. Verificação final

Teste login/sair/recuperação do administrador, salvar e reabrir rascunho, conflitos de versão, prévia de fórmulas, publicar e atualizar um artigo. Teste leitor Google, envio pendente, aprovação/recusa e confirmação de que outro leitor não lê rascunhos nem comentários pendentes. Repita os advisors após aplicar mudanças.

Nunca use uma chave secreta no cliente para resolver problemas de permissão. Ajuste as políticas e os grants.

Referências oficiais: [Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).
