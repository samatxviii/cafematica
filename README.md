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

Código implementado, ativação dependente de configuração externa. Por padrão `authEnabled` e `commentsEnabled` estão desligados. O site informa corretamente que os comentários ainda não estão abertos. O painel não apresenta um formulário de senha na origem do GitHub Pages.

Consulte [docs/CONFIGURACAO.md](docs/CONFIGURACAO.md) para instalar o banco, o login Google e o publicador. O funcionamento é:

1. Administrador entra por e-mail/senha na hospedagem própria do painel.
2. Rascunhos ficam no Supabase, com RLS e autorização administrativa no servidor.
3. Publicar envia o Markdown ao GitHub; o workflow reconstrói o site.
4. Leitores entram com Google e enviam comentários à fila de moderação.
5. O administrador aprova ou recusa comentários. E-mails não aparecem publicamente.

A indicação “enviado” significa que o GitHub recebeu o artigo, não que a publicação já terminou. Verifique a execução do workflow e a página pública.

## AdSense

Não existe garantia de aprovação. A base inclui conteúdo original, autoria editorial, navegação, contato, políticas, sitemap, RSS e HTML rastreável. Os artigos iniciais foram elaborados com apoio de IA; isso é informado ao leitor. Recomenda-se a revisão pedagógica do professor antes da solicitação.

Anúncios e rastreamento estão desligados. Um ID real `ca-pub-...` em `adsensePublisherId` gera a meta de verificação e `ads.txt`; não habilita publicidade. A integração de anúncios deverá respeitar a política de consentimento aplicável e a configuração da conta. Ver [docs/ADSENSE.md](docs/ADSENSE.md).

## Arquivos anteriores

Agenda, agendamento, exercício de assobio, estudos, áudio, WhatsApp e ferramenta de sorteio mantêm seus caminhos. `membros/` é uma aplicação Flask anterior: permanece no histórico/repositório, mas não integra o pacote público nem a autenticação nova. As antigas partes `menu.html`, `conteudo.html` e `rodape.html` estão preservadas no repositório para referência.
