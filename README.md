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

Edite `content/posts/*.md` ou utilize o painel depois da configuração do Supabase. Cada artigo tem título, resumo, categoria, slug, data e texto Markdown. Fórmulas usam `$...$` e `$$...$$`. HTML é sanitizado durante a geração. O site publica artigos com `publicationStatus: published` ou `publicationStatus: scheduled` quando `publishAt` é alcançado (UTC−4). O legado `published: true` continua aceito quando ainda não existe `publicationStatus`. Rascunhos e agendamentos futuros não geram páginas, cartões, RSS nem URLs no sitemap. Não envie rascunhos privados ao repositório público.

As páginas institucionais estão em `src/pages/`; os textos de privacidade, cookies e termos estão em `content/pages/`. A configuração pública fica em `config/site.json`. Nunca coloque senhas, tokens privados ou chaves `service_role` nesse arquivo.

## Edição do blog — sem servidor e sem Supabase

**O editor recomendado é o [Pages CMS](https://app.pagescms.org/).** Ele permite criar e alterar publicações, escolher categorias, definir capa, enviar imagens e editar texto pelo navegador.

1. Acesse [www.cafematica.com.br/admin/](https://www.cafematica.com.br/admin/) e clique em **Abrir editor de publicações**.
2. Entre no Pages CMS com a conta GitHub que administra `samatxviii/cafematica`; na primeira vez, autorize o aplicativo para **apenas esse repositório**.
3. Escolha **Artigos do Cafemática**, edite um artigo ou crie um novo.
4. Escolha a categoria, a imagem de capa e o texto. Para fórmulas em LaTeX, alterne para **Source** no editor de conteúdo.
5. Salve. O Pages CMS grava em `content/posts/*.md`, e o GitHub Actions recompila automaticamente o site. Aguarde a execução terminar.

A configuração do editor está em `.pages.yml`, com diretório de imagens `public/imagens/blog` e URL `/imagens/blog`. Os slugs antigos são mantidos; não altere o campo de endereço dos artigos publicados. No **Modo de publicação**, escolha **Rascunho — não publicar**, **Publicar imediatamente** ou **Agendar publicação**. Para agendar, preencha **Data e horário programados (UTC−4)**; por exemplo, 25/10/2026 às 18h equivale a 22h UTC. Se um artigo já publicado for reagendado, ele sairá do site na próxima implantação e voltará quando o horário chegar. O campo **Data de publicação** é uma data editorial separada. A conferência automática executa a cada 5 minutos em `.github/workflows/scheduled-posts.yml`, compara os artigos esperados com o manifesto `/publication.json` e solicita implantação somente quando houver divergência. Pode haver atrasos do GitHub Actions e do deploy. Como este repositório é público, rascunhos salvos no GitHub também poderão ser visualizados por quem examinar seu código.

O antigo painel Supabase foi substituído como método de edição, **sem apagar artigos nem banco**. O projeto Supabase fica reservado para uma eventual abertura de comentários com Google; `commentsEnabled` permanece desativado. Não precisamos configurar SMTP, Google OAuth ou um token secreto GitHub só para publicar o blog.

## AdSense

Não existe garantia de aprovação. A base inclui conteúdo original, autoria editorial, navegação, contato, políticas, sitemap, RSS e HTML rastreável. Os artigos iniciais foram elaborados com apoio de IA; isso é informado ao leitor. Recomenda-se a revisão pedagógica do professor antes da solicitação.

Anúncios e rastreamento estão desligados. Um ID real `ca-pub-...` em `adsensePublisherId` gera a meta de verificação e `ads.txt`; não habilita publicidade. A integração de anúncios deverá respeitar a política de consentimento aplicável e a configuração da conta. Ver [docs/ADSENSE.md](docs/ADSENSE.md).

## Arquivos anteriores

Agenda, agendamento, exercício de assobio, estudos, áudio, WhatsApp e ferramenta de sorteio mantêm seus caminhos. `membros/` é uma aplicação Flask anterior: permanece no histórico/repositório, mas não integra o pacote público nem a autenticação nova. As antigas partes `menu.html`, `conteudo.html` e `rodape.html` estão preservadas no repositório para referência.
