---
slug: "lista-exercicios-latex"
title: "Como montar uma lista de exercícios simples em LaTeX"
description: "Crie uma lista numerada, deixe espaço para resolução e organize um gabarito fácil de atualizar."
category: "latex"
topic: "Materiais para ensinar"
art: "1. 2. 3."
date: "2026-10-12"
published: true
cmsId: "07b7a7d8-488d-419a-acf6-ff54388bf2ee"
cmsVersion: 1
seoTitle: "Lista de exercícios em LaTeX: modelo com gabarito"
seoDescription: "Veja um modelo completo de lista de exercícios em LaTeX, com enumerate, espaço para respostas e gabarito em outra página. Código pronto para adaptar."
tags:
  - "lista de exercícios LaTeX"
  - "gabarito em LaTeX"
  - "enumerate"
  - "atividades de matemática"
  - "espaçamento no LaTeX"
author: "Fernando da Silva Batista"
updated: "2026-10-17"
quickAnswer: "Para montar uma lista de exercícios em LaTeX, use o ambiente enumerate e inicie cada questão com \\item. Reserve espaço para resolução com \\vspace{...} e coloque o gabarito em uma nova página usando \\newpage. Compile o PDF e confira se a numeração, os espaços e as respostas continuam corretos depois das alterações."
sources:
  - title: "Overleaf — Listas numeradas com enumerate"
    url: "https://www.overleaf.com/learn/latex/Lists"
  - title: "Overleaf — Quebras de linha, de página e espaçamento"
    url: "https://www.overleaf.com/learn/latex/Line_breaks_and_blank_spaces"
---

Uma boa lista de exercícios precisa ser fácil de ler, resolver e revisar. O LaTeX ajuda a manter a numeração e a estrutura consistentes, especialmente quando você inclui ou reorganiza questões. Para começar, vamos montar um arquivo pequeno com três exercícios e um gabarito separado.

## Pense primeiro na atividade

Antes do código, defina o que pretende verificar. Uma lista sobre equações pode começar com uma conta direta, seguir para uma expressão com parênteses e terminar com um problema contextualizado. Essa sequência permite observar se o estudante apenas repete operações ou também consegue interpretar uma situação.

Outro ponto é o espaço disponível. Uma conta curta exige menos área que um problema com desenho, tabela e justificativa. Evite reservar automaticamente o mesmo espaço para todas as questões.

## Um arquivo completo

O exemplo usa `enumerate` para gerar a numeração. Cada `\item` inicia uma questão. O comando `\newpage` coloca o gabarito em uma página nova.

```latex
\documentclass[12pt,a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[brazil]{babel}
\usepackage{amsmath}

\begin{document}
\section*{Praticando equações}
Nome: \hrulefill

\begin{enumerate}
  \item Resolva $3x+6=21$.
  \vspace{2cm}

  \item Resolva $2(x-3)=14$.
  \vspace{2cm}

  \item Três cadernos iguais e uma caneta de
  4 reais custaram 31 reais. Qual é o preço
  de cada caderno?
  \vspace{3cm}
\end{enumerate}

\newpage
\section*{Gabarito}
\begin{enumerate}
  \item $x=5$.
  \item $x=10$.
  \item 9 reais por caderno.
\end{enumerate}
\end{document}
```

## Por que deixar a numeração automática?

Se você digitar “1.”, “2.” e “3.” manualmente, inserir uma nova questão no início exige revisar todos os números seguintes. Com o ambiente numerado, a lista cuida dessa sequência. Isso reduz o trabalho repetitivo, embora não confira a correspondência das respostas no gabarito.

Ao mudar a ordem das perguntas, reorganize também suas soluções. Uma rotina útil é revisar pergunta e resposta como um par, marcando cada par conferido em uma cópia de trabalho.

## Espaço em branco também comunica

O comando `\vspace{2cm}` solicita um espaço vertical. Seu comportamento depende do ponto da página, e uma lista maior pode precisar de ajustes de paginação. Compile e observe o PDF: o estudante deve perceber claramente onde termina uma questão e começa a próxima.

Não use o espaço apenas para “preencher a folha”. Reserve uma área coerente com a resolução esperada. Para a questão dos cadernos, por exemplo, o aluno pode escrever $3x+4=31$, resolver e apresentar a resposta com a unidade monetária.

## Transforme o gabarito em oportunidade de aprendizagem

O resultado numérico é útil para conferência, mas uma versão comentada pode mostrar o raciocínio. Na segunda questão, dividir ambos os lados por dois produz $x-3=7$. Somar três resulta em $x=10$. A substituição confirma: $2(10-3)=14$.

Ao preparar material para uma turma, mantenha uma versão do professor com resoluções e uma versão de atividade adequada ao objetivo da aula. Isso ajuda a evitar compartilhar respostas antes do momento planejado.

## Próximo exercício

Acrescente uma quarta questão com incógnitas dos dois lados. Resolva antes de incluí-la e confira a resposta substituindo o valor encontrado na igualdade original. Depois, observe se a lista ainda cabe nas páginas como você pretendia.

Para personalizar rótulos e espaçamentos, consulte a [documentação do Overleaf sobre listas](https://www.overleaf.com/learn/latex/Lists). Aprenda primeiro a estrutura básica; adicione novas opções quando elas resolverem uma necessidade concreta.


## Aproveite a mesma estrutura para outros conteúdos

Uma vez pronta a estrutura da lista, substitua as questões por exercícios sobre [equações do primeiro grau](/blog/equacao-primeiro-grau/) ou [frações e operações](/blog/fracoes-sem-decorar/). Se precisar de comandos para numeradores, expoentes e radicais, consulte [como escrever fórmulas no LaTeX](/blog/formulas-latex/). Antes de distribuir o arquivo, confirme no PDF se o gabarito ficou separado do material do estudante.
