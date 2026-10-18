---
slug: funcao-primeiro-grau
title: "Função do primeiro grau: o que a fórmula conta sobre o gráfico"
description: Ligue tabela, fórmula e gráfico para entender os coeficientes, a
  raiz e o crescimento de uma função.
category: matematica
topic: Funções
art: ax + b
date: 2026-10-12
published: true
cmsId: 0a7af0e4-dedd-4efa-a3e2-f118a00fdf9b
cmsVersion: 1
seoTitle: "Função do 1º grau: gráfico, coeficientes e raiz"
seoDescription: "Entenda a função afim f(x)=ax+b: veja como criar uma tabela,
  traçar o gráfico, interpretar os coeficientes e encontrar a raiz com
  exemplos."
tags:
  - função do primeiro grau
  - função afim
  - gráfico de função afim
  - coeficiente angular
  - raiz da função
author: Fernando da Silva Batista
updated: 2026-10-17
quickAnswer: "Uma função do primeiro grau tem a forma f(x)=ax+b, com a diferente
  de zero. Seu gráfico é uma reta: a indica a variação por unidade de x e b é o
  valor da função em x=0. Para encontrar a raiz, resolva ax+b=0; a função é
  crescente quando a>0 e decrescente quando a<0."
sources:
  - title: Khan Academy — Introdução à função afim
    url: https://pt.khanacademy.org/math/9-ano-mat-pr/xc330d75a48d4d1d9%3A3-trimestre/xc330d75a48d4d1d9%3Asemana-1-nocoes-de-funcoes-e-situacoes-problema-envolvendo-funcao-afim/a/introducao-a-funcao-afim
  - title: OpenStax — Gráficos de equações lineares
    url: https://openstax.org/books/elementary-algebra-2e/pages/4-2-graph-linear-equations-in-two-variables
cover: /imagens/blog/funcao-do-primeiro-grau-na-pratica.png
coverAlt: Menina pensando sobre a função de primeiro grau, olhando para o
  gráfico de uma reta que sobe
---
Uma função associa cada elemento de um conjunto de partida a um único resultado no conjunto de chegada. Para começar, imagine uma regra que recebe um número, multiplica por dois e soma um. A entrada 0 produz 1; a entrada 3 produz 7. Podemos representar essa regra por $f(x)=2x+1$.

A expressão $f(x)$ significa “valor da função na entrada $x$”. Ela não representa uma multiplicação entre $f$ e $x$. Essa distinção evita uma dificuldade comum ao ler a notação pela primeira vez.

## A forma geral e seus coeficientes

A função afim tem a forma $f(x)=ax+b$. Quando $a\ne0$, ela é de primeiro grau. O coeficiente $a$ indica quanto o valor da função varia quando $x$ aumenta uma unidade. O coeficiente $b$ é o valor da função em zero, pois $a\cdot0+b=b$.

Na função $f(x)=2x+1$, cada aumento de uma unidade na entrada acrescenta duas unidades ao resultado. Quando a entrada é zero, o resultado é um.


| Entrada $x$ | Cálculo | Saída $f(x)$ |
| ----------- | -------------- | ------------ |
| -1 | $2\cdot(-1)+1$ | -1 |
| 0 | $2\cdot0+1$ | 1 |
| 1 | $2\cdot1+1$ | 3 |
| 2 | $2\cdot2+1$ | 5 |


Observe a regularidade na tabela: entradas que aumentam igualmente produzem saídas com variações iguais. Essa taxa constante é uma característica central da função de primeiro grau.

## Como construir o gráfico

No plano cartesiano, a entrada fica no eixo horizontal e o resultado no vertical. Cada linha da tabela gera um ponto, como $(0,1)$ ou $(1,3)$. Para a função definida em todos os reais, o gráfico é uma reta. Dois pontos distintos determinam essa reta; usar um terceiro é uma boa forma de conferir o traçado.

Marque as escalas dos eixos antes de colocar os pontos. Se a escala horizontal for diferente da vertical, a aparência da inclinação muda, mas a relação entre as coordenadas continua a mesma. Inclinação visual e coeficiente precisam ser interpretados considerando as unidades dos eixos.

## Crescente ou decrescente?

Quando $a>0$, valores maiores de $x$ produzem valores maiores de $f(x)$: a função é crescente. Quando $a<0$, o resultado diminui conforme a entrada aumenta: a função é decrescente.

Por exemplo, em $g(x)=-3x+12$, cada unidade acrescentada à entrada reduz a saída em três. Já o coeficiente $b$ desloca a reta verticalmente: mudar de $2x+1$ para $2x+4$ acrescenta três a todos os resultados, mantendo a mesma taxa de variação.

## A raiz é a entrada que produz zero

Para encontrar a raiz de $f(x)=2x+1$, resolvemos $2x+1=0$. Assim, $2x=-1$ e $x=-\frac12$. No gráfico, essa é a coordenada horizontal do ponto onde a reta cruza o eixo $x$.

De modo geral, $ax+b=0$ resulta em $x=-\frac ba$, desde que $a\ne0$. Não confunda raiz com $b$: a raiz corresponde à saída zero; $b$ corresponde à entrada zero.

## Um modelo do cotidiano

Considere uma entrega com taxa fixa de 6 reais e acréscimo de 2 reais por quilômetro percorrido. Dentro desse modelo, o custo é $C(d)=2d+6$. Para cinco quilômetros, $C(5)=16$ reais. O dois representa reais por quilômetro; o seis representa a cobrança fixa.

No contexto da entrega, distâncias negativas não fazem sentido. Mesmo que a expressão algébrica possa ser calculada para qualquer número real, o domínio do problema precisa respeitar a situação. Se houver distância máxima atendida ou cobrança por faixas, o modelo deverá ser ajustado.

## Teste sua interpretação

Considere $h(x)=-2x+8$. Identifique os coeficientes, calcule $h(3)$ e encontre a raiz. Depois, diga se a função é crescente ou decrescente.

**Conferência:** $a=-2$ e $b=8$; $h(3)=2$; a raiz é 4; a função é decrescente. No gráfico completo, ela passa por $(0,8)$ e $(4,0)$. Usar fórmula, tabela e gráfico em conjunto ajuda a perceber que são três maneiras de descrever a mesma relação.

## Explore a função no GeoGebra

Depois de identificar os coeficientes, é útil variar os valores de $a$ e $b$ e observar o que muda na reta. A experiência ajuda a distinguir a taxa de variação do valor inicial. Para experimentar com ferramentas digitais, acompanhe o tutorial [Como visualizar uma função no GeoGebra](/blog/geogebra-funcao/). Se a dificuldade estiver em encontrar a raiz, revise antes [como resolver equações do primeiro grau](/blog/equacao-primeiro-grau/).