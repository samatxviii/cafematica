---
slug: "primeiro-documento-latex"
title: "Seu primeiro documento em LaTeX, uma linha de cada vez"
description: "Um exemplo pequeno e completo para transformar texto e comandos em um PDF organizado."
category: "latex"
topic: "Comece aqui"
art: ".tex"
date: "2026-10-12"
published: true
cmsId: "2a2591c2-0053-4ef2-a1eb-3433190ddc68"
cmsVersion: 1
seoTitle: "Como começar no LaTeX: crie seu primeiro documento PDF"
seoDescription: "Aprenda LaTeX do zero com um exemplo completo: configure o preâmbulo, escreva seções, insira uma fórmula e gere seu primeiro PDF no Overleaf."
tags:
  - "LaTeX para iniciantes"
  - "primeiro documento LaTeX"
  - "Overleaf"
  - "estrutura do documento"
  - "compilação PDF"
author: "Fernando da Silva Batista"
updated: "2026-10-17"
quickAnswer: "Para criar seu primeiro documento em LaTeX, escolha um editor como o Overleaf, declare uma classe com \\documentclass{article} e escreva o conteúdo entre \\begin{document} e \\end{document}. Use \\section{...} para organizar as partes, compile o arquivo .tex e revise o PDF resultante. Comece com um exemplo curto antes de personalizar o layout."
sources:
  - title: "Overleaf — Aprenda LaTeX em 30 minutos"
    url: "https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes"
  - title: "Overleaf — Introdução às expressões matemáticas"
    url: "https://www.overleaf.com/learn/latex/Mathematical_expressions"
---

Começar com LaTeX não exige memorizar uma grande quantidade de comandos. Um objetivo melhor é montar um documento curto, compilar e perceber a função de cada parte. Depois, você amplia esse primeiro arquivo conforme a necessidade.

No LaTeX, você escreve o conteúdo em um arquivo de texto com extensão `.tex`. Os comandos descrevem estruturas como títulos, seções e expressões matemáticas. Um programa processa esse código e produz o documento final, normalmente em PDF. Essa etapa é chamada de compilação.

## Um projeto pequeno para experimentar

Crie um projeto vazio em um editor LaTeX. Você pode usar o Overleaf no navegador ou um editor local com uma distribuição TeX instalada. O exemplo abaixo foi pensado para compilação com pdfLaTeX em uma distribuição atual.

```latex
\documentclass[12pt,a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[brazil]{babel}
\usepackage{amsmath}

\title{Meu caderno de descobertas}
\author{Seu nome}
\date{}

\begin{document}
\maketitle

\section{Uma ideia importante}
Aprender envolve experimentar, conferir e corrigir.

\section{Um exemplo matemático}
Se $x=4$, então $2x+3=11$.

\end{document}
```

Copie o exemplo completo, compile e confira o PDF. Antes de modificar margens, cores e fontes, verifique se aparecem o título, o nome do autor, as duas seções e a expressão matemática.

## Entendendo a estrutura

O comando `\documentclass` define a classe do documento. Neste caso, `article` atende a um texto curto, enquanto as opções indicam fonte-base de 12 pontos e papel A4.

Tudo o que vem antes de `\begin{document}` forma o preâmbulo. É nele que configuramos o documento e carregamos os pacotes. O conteúdo principal fica entre `\begin{document}` e `\end{document}`. O comando `\maketitle` produz o bloco com título e autor a partir das informações que declaramos.

No nosso exercício, pense no preâmbulo como a preparação da mesa de trabalho e no corpo como o que você efetivamente vai escrever. Essa comparação é útil no início, embora os recursos da linguagem permitam configurações mais avançadas.

## Faça uma alteração por vez

Troque o título para “Revisão de equações” e compile novamente. Depois, acrescente uma terceira seção chamada “O que ainda preciso estudar”. Escreva um parágrafo nela e confira o resultado.

Esse ritmo ajuda a relacionar causa e efeito. Se dez mudanças forem feitas ao mesmo tempo e surgir um erro, você terá mais pontos para investigar. Ao experimentar em pequenos passos, fica mais fácil identificar qual alteração causou o problema.

## Três cuidados que evitam confusão

As chaves precisam formar pares. Se você abrir `\section{` e não fechar a chave depois do título, o compilador pode interpretar as linhas seguintes de modo inesperado.

Alguns caracteres têm funções especiais. Para escrever o símbolo de porcentagem no texto, use `\%`. Para um sublinhado literal, use `\_`. Uma linha vazia no código inicia um novo parágrafo; não é necessário usar uma sequência de barras para separar todos os parágrafos.

Se houver erro, procure primeiro a mensagem inicial do relatório. Vários avisos posteriores podem ser consequências do mesmo problema. Corrigir um erro de cada vez costuma ser mais produtivo que tentar responder a todas as mensagens simultaneamente.

## Um desafio para finalizar

Transforme o arquivo em uma ficha de estudo sobre um assunto que você está aprendendo. Use três seções: ideia principal, exemplo e dúvida. O objetivo é produzir algo útil com a estrutura que você já compreendeu.

Para aprofundar a linguagem e consultar exemplos, veja a [introdução oficial do Overleaf ao LaTeX](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes). Depois, continue com o artigo sobre [fórmulas matemáticas](/blog/formulas-latex/).


## Próximo passo: aprenda a escrever fórmulas e atividades

Depois de compilar seu primeiro arquivo, experimente inserir uma fração e uma raiz seguindo o tutorial [Fórmulas em LaTeX: frações, potências e raízes](/blog/formulas-latex/). Quando estiver confortável com a estrutura do documento, avance para [uma lista de exercícios em LaTeX com gabarito](/blog/lista-exercicios-latex/). Esses exercícios permitem reutilizar as mesmas bases e perceber como o LaTeX ajuda a manter materiais didáticos organizados.
