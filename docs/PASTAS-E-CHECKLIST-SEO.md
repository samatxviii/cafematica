# Pastas editoriais e checklist SEO no Pages CMS

## Pastas: organização sem alterar URLs

O Cafemática gera a página usando o campo `slug` do artigo. O local físico
do arquivo é somente uma escolha de organização do repositório.

Exemplo:
- Antes: `content/posts/equacao-primeiro-grau.md`
- Depois: `content/posts/matematica/equacao-primeiro-grau.md`
- Em ambos: `https://www.cafematica.com.br/blog/equacao-primeiro-grau/`

A coleção do Pages CMS permite subpastas e oferece uma ação **Mover artigo para pasta**
dentro do editor de uma publicação. Escolha Matemática, LaTeX, Tecnologia ou
Sem pasta (raiz). A ação dispara `.github/workflows/pages-cms-move-post.yml`,
que aceita somente arquivos Markdown do `content/posts` e uma das pastas autorizadas.
Ela recusa arquivos inexistentes, destinos já ocupados e caminhos desconhecidos.

O movimento não é por arrastar e soltar. Após executar a ação, aguarde o resultado
no GitHub Actions e recarregue a coleção no Pages CMS.

O aplicativo não deve ser usado para renomear o slug de um artigo publicado.
O gerador agora descobre Markdown em subpastas e falha na compilação caso existam
slugs duplicados em diretórios diferentes.

## Nota: checklist técnico e editorial — não é classificação do Google

A coluna **Checklist SEO (0-10)** mostra um número calculado automaticamente
pelo script `scripts/seo-score.mjs` quando um artigo é salvo no GitHub.
O workflow `.github/workflows/seo-checklist.yml` calcula e grava `seoScore`
no frontmatter do artigo; os campos `seoScore`, `seoSummary` e `seoChecklist` são somente leitura no editor. A atualização
não é instantânea: depende da execução do workflow, que geralmente leva
alguns instantes após o commit. Se um workflow falhar, a nota antiga pode
permanecer e deve ser considerada desatualizada.

## Como interpretar as notas no editor

A tabela do Pages CMS agora apresenta duas colunas lado a lado:

- **Checklist SEO (0-10)**: a quantidade de verificações técnicas e editoriais atendidas.
- **O que falta para melhorar o SEO**: o principal item pendente e, se existirem vários, um aviso de que há mais.

Abra um artigo em **Edit** e consulte os campos de somente leitura no início do
formulário: a nota, o resumo da pendência e **Diagnóstico completo de SEO — 10
critérios e como corrigir**. O relatório identifica cada item com ✓ (atendido) ou
✗ (pendente) e traz uma instrução específica de correção para cada item que falta.

Exemplos de leitura:

- **10/10** — os dez critérios automáticos foram preenchidos. Ainda vale revisar a exatidão, a experiência de leitura, a originalidade e eventuais erros de Matemática.
- **9/10** — exatamente um critério está pendente. Veja qual na coluna *O que falta*; se for imagem, adicione uma capa real e o texto alternativo.
- **7/10** — três critérios não foram atendidos. Consulte o diagnóstico para ver quais; a nota não diz sozinha o que falta.
- **5/10** — cinco critérios não foram atendidos, independentemente de quais sejam. O diagnóstico mostra os cinco e o que editar.

Depois de **Salvar**, o GitHub recalcula os campos; recarregue o Pages CMS após
a automação concluir. Não é uma auditoria em tempo real enquanto o texto é digitado.
Se o relatório ainda for o anterior, confira o
[workflow Verificar checklist SEO dos artigos](https://github.com/samatxviii/cafematica/actions/workflows/seo-checklist.yml).

Cada critério vale **exatamente um ponto**, sem pesos ocultos:

| Ponto | Verificação que pode ser automatizada |
| --- | --- |
| 1 | Título SEO preenchido, exclusivo e dentro de 15–75 caracteres. |
| 2 | Descrição SEO preenchida, exclusiva e dentro de 60–180 caracteres. |
| 3 | Título visível do artigo preenchido, exclusivo e dentro de 12–160 caracteres. |
| 4 | Slug válido e exclusivo, que é usado pela URL canônica pública. |
| 5 | Texto organizado em pelo menos duas seções Markdown H2. |
| 6 | Pelo menos um link contextual apontando para outro artigo existente. |
| 7 | Campo de fontes preenchido, com título e endereço HTTPS bem formado. |
| 8 | Resposta curta existente, entre 80 e 600 caracteres. |
| 9 | Autor identificado e data de publicação corretamente formatada. |
| 10 | Imagem de capa disponível com texto alternativo, ou capa externa já admitida pelo site. |

**Importante:** os comprimentos e quantidades acima são limites editoriais
adotados pelo Cafemática para manter informações úteis e completas.
**Não são exigências universais, fatores de ranqueamento garantidos ou regras
numéricas publicadas pelo Google.** A presença de link não significa que a
referência seja confiável; a presença de texto não garante qualidade ou
precisão matemática. Isso exige revisão humana e acompanhamento no Search Console.

Uma nota 10/10 **não** significa que o artigo terá melhor posição nos buscadores
ou será citado por ferramentas de IA. Trata-se de uma auditoria de **completude
técnica verificável** e nada mais. Não se pontua a meta tag `keywords`, que o
Google ignora, nem se promete tráfego, posições ou indexação.

Fontes que orientam a escolha das verificações:
- [Google Search Central — guia de SEO para iniciantes](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central — títulos nas buscas](https://developers.google.com/search/docs/appearance/title-link)
- [Google Search Central — descrições de pesquisa](https://developers.google.com/search/docs/appearance/snippet)
- [Google Search Central — links rastreáveis](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Pages CMS — configuração da lista](https://pagescms.org/docs/configuration/content/view/)
- [Pages CMS — botões personalizados com GitHub Actions](https://pagescms.org/docs/configuration/actions/)

Para detalhes de cada erro, é possível executar `node scripts/seo-score.mjs`
localmente após `npm ci`, sem alterar arquivos. Para atualizar os campos,
execute `node scripts/seo-score.mjs --write`.
