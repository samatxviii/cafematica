# Cafemática

Portal editorial de Matemática, LaTeX e tecnologia do Prof. Fernando Batista.

**Site público:** https://www.cafematica.com.br/ · **Repositório:** samatxviii/cafematica

A versão atual usa Astro para gerar HTML completo. A leitura dos artigos e a navegação não dependem de consultas ao banco. A busca, o menu do celular e as preferências de vídeos usam JavaScript local. As fontes são hospedadas junto com o site.

## Desenvolvimento

Requer Node.js 24. Instale com `npm ci`.

- `npm run dev`: desenvolvimento local.
- `npm test`: testes de sanitização, metadados, interação e permissões PostgreSQL.
- `npm run build`: gera `dist/`, incluindo as ferramentas antigas.
- `npm run verify`: verifica metadados, links e o pacote público.
- `npm run admin:build`: gera `admin-dist/` para hospedar o painel em origem separada.

O workflow `.github/workflows/portal.yml` valida e publica `dist/` no GitHub Pages. Somente `main` pode publicar. PRs executam as verificações. O domínio original é preservado em `CNAME`. Enquanto a origem do Pages estiver configurada como branch, o workflow aguarda a publicação automática anterior e depois implanta o pacote correto. A troca para origem GitHub Actions pode ser feita posteriormente nas configurações do Pages.

## Conteúdo

Edite `content/posts/*.md` ou utilize o painel depois da configuração do Supabase. Cada artigo tem título, resumo, categoria, slug, data e texto Markdown. Fórmulas usam `$...$` e `$$...$$`. HTML é sanitizado durante a geração. Apenas artigos com `published: true` entram no site. Não envie rascunhos privados ao repositório público.

As páginas institucionais estão em `src/pages/`; os textos de privacidade, cookies e termos estão em `content/pages/`. A configuração pública fica em `config/site.json`. Nunca coloque senhas, tokens privados ou chaves `service_role` nesse arquivo.

## Administração e comentários

O painel editorial está no mesmo domínio do site, em `/admin/`, hospedado pelo GitHub Pages. O Supabase Auth oferece login Google (após configurar o provedor) e link de acesso por e-mail, sem receber senhas no Pages. O controle de edição é verificado no servidor via `private.admins`, RLS e RPCs protegidas. Os 10 artigos iniciais já foram importados para o banco.

O editor permite criar e revisar rascunhos, enviar capa e imagens internas ao Supabase Storage, escrever Markdown e LaTeX, visualizar uma prévia e solicitar publicação. A Edge Function `publish-post` envia conteúdo ao GitHub, onde o workflow atualiza o site, depois de configurar `GITHUB_TOKEN` como segredo no Supabase.

**Passos restantes para o primeiro acesso:** configurar URLs de redirecionamento no Supabase Auth, entrar com um e-mail confirmado, autorizar esse usuário em `private.admins` e cadastrar um token restrito do GitHub no Supabase. O Google OAuth demanda Client ID e Client Secret criados no Google Cloud; o link por e-mail pode ser usado primeiro. O sistema não confunde editor acessível com publicação operacional sem essas etapas.

Os comentários de leitores permanecem desativados (`commentsEnabled=false`) até validar Google OAuth e moderação. Consulte [docs/CONFIGURACAO.md](docs/CONFIGURACAO.md) para os procedimentos exatos.

## AdSense

Não existe garantia de aprovação. A base inclui conteúdo original, autoria editorial, navegação, contato, políticas, sitemap, RSS e HTML rastreável. Os artigos iniciais foram elaborados com apoio de IA; isso é informado ao leitor. Recomenda-se a revisão pedagógica do professor antes da solicitação.

Anúncios e rastreamento estão desligados. Um ID real `ca-pub-...` em `adsensePublisherId` gera a meta de verificação e `ads.txt`; não habilita publicidade. A integração de anúncios deverá respeitar a política de consentimento aplicável e a configuração da conta. Ver [docs/ADSENSE.md](docs/ADSENSE.md).

## Arquivos anteriores

Agenda, agendamento, exercício de assobio, estudos, áudio, WhatsApp e ferramenta de sorteio mantêm seus caminhos. `membros/` é uma aplicação Flask anterior: permanece no histórico/repositório, mas não integra o pacote público nem a autenticação nova. As antigas partes `menu.html`, `conteudo.html` e `rodape.html` estão preservadas no repositório para referência.
