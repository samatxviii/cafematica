# Organização de artigos e campos SEO no Pages CMS

## Pastas: organização sem alterar URLs

O Cafemática gera as páginas pelo campo `slug` de cada artigo, sem usar
o caminho físico do arquivo. Assim, mover o arquivo de
`content/posts/equacao-primeiro-grau.md` para
`content/posts/matematica/equacao-primeiro-grau.md` mantém o endereço
`https://www.cafematica.com.br/blog/equacao-primeiro-grau/`.

A coleção do Pages CMS permite subpastas. A ação **Mover artigo para pasta**
oferece Matemática, LaTeX, Tecnologia ou Sem pasta (raiz), usando o workflow
`.github/workflows/pages-cms-move-post.yml`. Após acioná-la, aguarde a
execução no GitHub Actions e atualize a lista no editor.

A ação foi programada para aceitar apenas pastas autorizadas e conservar o
`slug`. Ela não oferece arrastar e soltar; o funcionamento pela interface
hospedada do Pages CMS ainda deve ser validado em um artigo de teste.

Não altere o `slug` de um artigo publicado sem antes planejar os
redirecionamentos. O compilador também impede slugs duplicados em subpastas.

## Campos editoriais preservados

O editor mantém título, resumo, título de busca, descrição para buscas,
tags, categoria, assunto, capa e texto alternativo, autor, data de publicação,
data da revisão, status de publicação, vídeo opcional, resposta curta,
fontes e conteúdo do artigo.

**A avaliação numérica de SEO foi desativada a pedido do editor.**
Os campos `seoScore`, `seoSummary` e `seoChecklist` foram retirados
do formulário e dos artigos. A lista voltou a exibir apenas título,
categoria, status de publicação e data.

Para orientações sobre os campos de SEO que permanecem disponíveis,
consulte [o guia editorial](SEO-PAGES-CMS.md). Esses recursos contribuem
para organizar conteúdos e construir boas páginas, mas não garantem
posicionamento no Google nem citações por sistemas de IA.
