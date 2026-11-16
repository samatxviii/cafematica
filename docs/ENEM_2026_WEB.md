# ENEM 2026 — 45 questões no site Cafemática

## Instalação no repositório `samatxviii/cafematica`

Copie as pastas `src/`, `public/` e `docs/` deste pacote **sobre** as mesmas pastas do repositório, sem excluir o conteúdo existente. Esta atualização apenas acrescenta novos arquivos.

O projeto usa a estrutura Astro 7 existente e a biblioteca KaTeX que o site já tem como dependência. Não é necessário instalar plugins ou serviços pagos.

### Rotas geradas

- `/enem2026/`: índice das 45 questões, com escolha da cor do caderno e busca por número ou assunto.
- `/enem2026/amarela-136-cinza-148-azul-144-verde-140/`: página da primeira questão.
- As demais URLs são produzidas automaticamente pelos 45 registros do JSON.

### Onde editar

- `src/data/enem2026.json`: numeração, enunciados, alternativas, quantidade de colunas.
- `public/imagens/enem2026/`: 40 imagens originais, com nomes da prova amarela.
- `src/styles/enem2026.css`: estilo e adaptação mobile.
- `src/pages/enem2026/index.astro`: índice e busca.
- `src/pages/enem2026/[slug].astro`: modelo único das páginas individuais, fórmulas renderizadas com KaTeX no build.

### Conferência local

```sh
npm ci
npm run build
npm run verify
node scripts/verify-enem2026.mjs
```

As páginas são estáticas, com textos e fórmulas no HTML gerado. Não dependem de JavaScript do visitante para ler as questões, tabelas ou imagens. Apenas a busca da listagem e as marcações de alternativas dependem de interação local. Seleções não são armazenadas e não exibem gabarito.

### Sobre a publicação

Os arquivos estão prontos para integrar o repositório; o ZIP não publica sozinho no GitHub Pages. Depois de inserir os arquivos, o workflow existente do repositório poderá construir e implantar o site conforme as regras do projeto.

### Conferência dos dados

Fonte de conteúdo: projeto LaTeX corrigido do Cafemática enviado pelo usuário. Ordens: AMARELO, CINZA, AZUL, VERDE. Figuras: extraídas do caderno verde de 2026, nomeadas segundo a numeração amarela. Não foram criadas respostas nem soluções.

### Visibilidade no Cafemática

A coleção tem um link de acesso na seção Matemática do portal. O processo de deploy permanece o fluxo **Portal Cafemática** (Astro/GitHub Actions), com uma validação de integridade para as 45 questões. O Pages CMS de artigos permanece independente e funcionando normalmente.