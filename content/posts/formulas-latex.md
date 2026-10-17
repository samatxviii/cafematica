---
slug: "formulas-latex"
title: "Fórmulas no LaTeX: frações, potências e raízes bem escritas"
description: "Aprenda os comandos essenciais e entenda quando uma expressão deve aparecer no texto ou em destaque."
category: "latex"
topic: "Escrita matemática"
art: "√x"
date: "2026-10-12"
published: true
cmsId: "682e5df5-e186-4a28-af98-03f39dbe20b4"
cmsVersion: 1
seoTitle: "Fórmulas em LaTeX: frações, raízes e potências"
seoDescription: "Veja como escrever fórmulas matemáticas em LaTeX com frac, sqrt, expoentes e índices. Exemplos prontos para copiar em documentos e no Overleaf."
tags:
  - "fórmulas em LaTeX"
  - "frações no LaTeX"
  - "raiz quadrada no LaTeX"
  - "expoentes e índices"
  - "Overleaf"
author: "Fernando da Silva Batista"
updated: "2026-10-17"
quickAnswer: "No LaTeX, escreva uma fração com \\frac{numerador}{denominador}, uma raiz com \\sqrt{x}, uma potência com x^{2} e um índice com a_{n}. Use o modo matemático para essas expressões e chaves para agrupar numeradores, expoentes ou índices com vários caracteres. Para destacar uma equação sem numeração, use \\[ ... \\]."
sources:
  - title: "Overleaf — Como escrever expressões matemáticas em LaTeX"
    url: "https://www.overleaf.com/learn/latex/Mathematical_expressions"
  - title: "Overleaf — Frações e binômios no LaTeX"
    url: "https://www.overleaf.com/learn/latex/Fractions_and_Binomials"
  - title: "Overleaf — Índices inferiores e expoentes"
    url: "https://www.overleaf.com/learn/latex/Subscripts_and_superscripts"
seoScore: 9
---

Uma fórmula bem escrita ajuda o leitor a perceber a estrutura de uma ideia. No LaTeX, o modo matemático cuida do espaçamento entre operadores e da apresentação dos símbolos, mas você precisa indicar corretamente quais partes pertencem a cada comando.

Comece com uma frase simples: “Se $x=3$, então $x^2=9$”. A expressão participa da frase e acompanha sua linha. Em um arquivo `.tex`, você pode escrevê-la entre um par de cifrões, como no exemplo a seguir.

```latex
Se $x=3$, então $x^2=9$.
```

## Expressão no texto ou em destaque?

Uma conta central ou mais longa costuma merecer uma linha própria. Para isso, use os delimitadores `\[` e `\]`. Eles indicam uma expressão em destaque sem numeração.

```latex
\[
  f(x)=2x+1
\]
```

Quando for preciso numerar e referenciar uma equação, um ambiente como `equation` será mais adequado. O pacote `amsmath` oferece recursos úteis para organizar a escrita matemática e pode ser carregado no preâmbulo com `\usepackage{amsmath}`.

## As chaves definem os grupos

Para escrever uma fração, use `\frac{numerador}{denominador}`. Em `\frac{x+1}{2}`, toda a expressão $x+1$ está no numerador. Em `x+\frac12`, apenas o número 1 é dividido por 2.

Essas duas escritas representam quantidades diferentes. Para $x=3$, a primeira vale 2, e a segunda vale 3,5. Portanto, a escolha das chaves participa do significado, não apenas da aparência.

```latex
\[
  \frac{x+1}{2} \neq x+\frac{1}{2}
\]
```

## Potências e índices

O caractere `^` indica uma potência, enquanto `_` indica um índice inferior. Uma potência com mais de um caractere precisa ser agrupada: `x^{12}` produz $x^{12}$. Escrever `x^12` associa a potência apenas ao primeiro caractere e deixa o 2 fora do expoente.

O mesmo cuidado vale para `a_{n+1}`. Sem as chaves, o índice pode ficar diferente do pretendido. Sempre que a expressão inteira deve ocupar uma posição, trate-a como um grupo.

## Raízes e uma expressão completa

Use `\sqrt{x}` para $\sqrt{x}$ e `\sqrt[3]{8}` para $\sqrt[3]{8}$. O número entre colchetes indica o índice da raiz.

Podemos combinar os comandos em uma expressão conhecida:

```latex
\[
  x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
\]
```

Essa fórmula representa as soluções da equação do segundo grau, com $a\ne0$, no contexto numérico adequado. Observe a organização: o numerador inteiro ocupa a primeira chave de `\frac`, e o denominador inteiro ocupa a segunda. Conferir os grupos de fora para dentro ajuda a encontrar chaves esquecidas.

## Como praticar sem depender de copiar tudo

Tente escrever, nesta ordem, $\frac35$, $x^{10}$, $a_{12}$, $\sqrt{x+2}$ e $\frac{x^2+1}{x-3}$. Depois, mude os valores e descreva quais comandos precisou alterar.

No último exemplo, a escrita está bem formada, mas o denominador informa uma restrição matemática: $x\ne3$. O compilador não substitui a revisão do raciocínio. Ele pode apresentar com excelente aparência uma expressão matematicamente inadequada.

Consulte a [documentação do Overleaf sobre expressões matemáticas](https://www.overleaf.com/learn/latex/Mathematical_expressions) para explorar outras formas de apresentação. Se ainda não tem um arquivo de trabalho, comece pelo [primeiro documento em LaTeX](/blog/primeiro-documento-latex/).


## Aplique esses comandos em um material didático

Para treinar a escrita de frações, raízes e potências, experimente incorporá-las a uma atividade pronta. O tutorial [Como montar uma lista de exercícios em LaTeX](/blog/lista-exercicios-latex/) mostra a estrutura de uma lista numerada com gabarito. Se quiser começar por um documento mínimo antes de trabalhar com fórmulas, veja [Seu primeiro documento em LaTeX](/blog/primeiro-documento-latex/). Para conferir o significado matemático de uma fração antes de digitá-la, relembre [frações equivalentes e operações](/blog/fracoes-sem-decorar/).
