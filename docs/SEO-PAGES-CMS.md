# SEO editorial do Cafemática — guia para publicar no Pages CMS

O campo `body` continua sendo a publicação real. Os campos abaixo ajudam a apresentar, organizar e compreender o conteúdo, mas nenhum deles garante posição no Google ou menção em ferramentas de IA.

## Preenchimento sugerido para cada artigo

1. **Título (obrigatório):** o nome visível na página, claro e específico. Exemplo: `Juros compostos: como calcular uma compra parcelada`.
2. **Resumo:** diga exatamente o que o leitor aprenderá. Aparece na abertura do artigo e, na ausência de descrição SEO, também na tag `description`.
3. **Título para Google (opcional):** permite ajustar o elemento `<title>` sem mudar o H1 da página. Escreva naturalmente e evite repetir o nome Cafemática, que já é acrescentado pelo site.
4. **Descrição para buscas (opcional):** resumo próprio da página, conciso e fiel ao texto. Os mecanismos podem escolher trechos diferentes conforme a pesquisa.
5. **Tags:** de três a seis temas *que realmente apareçam no artigo*, com vocabulário que o público usa. Exemplo: `juros compostos`, `educação financeira`, `parcelamento`, `calculadora financeira`. São mostradas como links para a busca interna, ajudando a encontrar conteúdos relacionados. Tags **não** são uma forma de forçar posições na Pesquisa Google.
6. **Capa e descrição da imagem:** imagem original ou licenciada, contextual e compreensível. Se possível, escolha fotos ou gráficos com pelo menos 1200 pixels de largura, comprimidos para web. Descreva o que a imagem mostra; evite encher o texto alternativo de palavras-chave.
7. **Autor e última revisão:** use o nome do responsável real; marque `Última revisão significativa` apenas quando revisar conteúdo de verdade. Nunca altere datas para simular atualização.
8. **Resposta curta:** duas a quatro frases úteis que respondam diretamente à pergunta principal, *visíveis aos leitores*. Use linguagem verificável e sem conclusões exageradas.
9. **Fontes e leituras recomendadas:** inclua referências confiáveis e atualizadas para definições, regras, dados e exemplos. Não coloque links artificiais apenas para SEO.
10. **Conteúdo:** use um H2 para cada etapa, fórmulas corretas, exemplos originais do cotidiano, imagens legíveis, alternativas acessíveis e links contextuais para outros artigos do Cafemática.

## Exemplo: artigo de juros compostos

- Título: `Juros compostos na prática: entenda com um exemplo real`
- SEO Title: `Juros compostos: fórmula e cálculo passo a passo`
- Descrição SEO: `Aprenda a calcular juros compostos e compare pagamentos à vista e parcelados com um exemplo resolvido.`
- Tags: `juros compostos`, `educação financeira`, `financiamento`
- Resposta curta: `Juros compostos são calculados sobre o capital e sobre os juros acumulados em períodos anteriores. Para uma taxa constante, o montante é M = C(1+i)^n. Antes de comparar investimentos ou dívidas, confira se a taxa e o prazo usam a mesma unidade.`
- Imagem: um exemplo de tabela de evolução do saldo, realmente relacionado ao conteúdo
- Referências: livros de Matemática Financeira e fontes institucionais relevantes para o que foi afirmado

## O que o site faz automaticamente

- Mantém as URLs canônicas e o sitemap existentes.
- Coloca o título de busca no `<title>` e na prévia de compartilhamento; se vazio, usa o título normal.
- Usa a descrição específica de busca; se vazia, usa o resumo do artigo.
- Usa a capa do artigo em `og:image` e em `BlogPosting.image` quando houver arquivo válido.
- Publica dados estruturados `BlogPosting` com título real, autoria, data original e data revisada, assunto e fontes.
- Exibe tags e links para a pesquisa do próprio blog; aperfeiçoa também as sugestões de leitura relacionadas.
- Não adiciona a meta tag `keywords`: o Google ignora essa tag para classificação.

## Visibilidade em pesquisas com IA

As recomendações oficiais do Google para AI Overviews e Modo IA continuam sendo SEO tradicional de qualidade: texto rastreável, páginas indexáveis, navegação interna, apresentação clara, imagens relevantes e conteúdo confiável. O Google não exige um arquivo `llms.txt`, schema especial nem marcações secretas para inclusão nesses recursos.

Ferramentas de IA de outros fornecedores podem usar buscadores e robôs próprios. Ser rastreável é útil, mas não garante indexação, citações ou destaque.

As melhorias mais fortes a longo prazo são **conteúdo original de autoria identificada, respostas precisas, referências verificáveis, boa experiência mobile e links de outros sites confiáveis**. Estime resultados no Search Console após semanas, não minutos.

## Fontes oficiais

- Google Search Central — AI Features: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central — Article / BlogPosting: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central — Google Discover: https://developers.google.com/search/docs/appearance/google-discover
- Google Search Central — Meta tags ignoradas: https://developers.google.com/search/docs/crawling-indexing/special-tags
- Pages CMS — Listas de campos: https://pagescms.org/docs/configuration/content/list/
- Pages CMS — Campos disponíveis: https://pagescms.org/docs/configuration/content/fields/
