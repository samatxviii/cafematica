---
slug: "geogebra-funcao"
title: "Explore a função do primeiro grau com o GeoGebra"
description: "Uma atividade guiada para investigar o que muda no gráfico quando você altera os coeficientes."
category: "tecnologia"
topic: "Matemática e tecnologia"
art: "f(x)"
date: "2026-10-12"
published: true
cmsId: "b07ccf4a-7226-4404-a3a2-d8aa5ab0f874"
cmsVersion: 1
seoTitle: "GeoGebra: como fazer o gráfico da função afim"
seoDescription: "Aprenda a desenhar e comparar retas no GeoGebra. Investigue f(x)=ax+b, coeficientes, crescimento e variações do gráfico com uma atividade guiada."
tags:
  - "GeoGebra"
  - "gráfico de função afim"
  - "função do primeiro grau"
  - "coeficiente angular"
  - "calculadora gráfica"
author: "Fernando da Silva Batista"
updated: "2026-10-17"
quickAnswer: "Abra a Calculadora Gráfica do GeoGebra e digite f(x)=2x+1 para desenhar uma reta. Em seguida, compare com g(x)=2x+4: a inclinação permanece igual, mas a reta muda de altura. Se alterar o coeficiente de x, como em h(x)=3x+1, muda a taxa de variação da função. Faça previsões e confira no gráfico."
sources:
  - title: "GeoGebra — Ajuda oficial da Calculadora Gráfica"
    url: "https://help.geogebra.org/hc/en-us/articles/8379920754717-Graphing-Calculator"
  - title: "GeoGebra — Ferramenta Deslizante (manual oficial)"
    url: "https://geogebra.github.io/docs/manual/en/tools/Slider/"
seoScore: 9
---

Um gráfico pronto pode mostrar uma resposta. Uma investigação com gráficos pode revelar relações. Nesta atividade, vamos usar a Calculadora Gráfica do GeoGebra para comparar funções do primeiro grau, fazer previsões e conferir se elas se confirmam.

Abra a [Calculadora Gráfica do GeoGebra](https://www.geogebra.org/graphing?lang=pt). A interface pode mudar conforme o dispositivo, mas a atividade precisa apenas da área de entrada de expressões e do plano cartesiano. Digite as expressões indicadas uma de cada vez e observe os gráficos.

## Primeiro, faça uma previsão no papel

Antes de digitar, calcule dois valores para $f(x)=2x+1$. Quando $x=0$, a saída é 1. Quando $x=1$, a saída é 3. Assim, esperamos uma reta que passe por $(0,1)$ e $(1,3)$.

Digite `f(x)=2x+1` e compare a imagem com sua previsão. Se o gráfico parecer estranho, confira a janela de visualização e a escala dos eixos. Uma reta não deixa de representar a mesma função porque você aproximou ou afastou a visualização.

## Investigação 1: mantenha o dois

Acrescente `g(x)=2x+4`. As duas retas têm o mesmo coeficiente de $x$, mas valores diferentes no termo constante. Compare as saídas para uma mesma entrada: em qualquer $x$, o resultado de $g$ é três unidades maior que o de $f$.

Na tabela, isso aparece como uma diferença constante. No gráfico, as retas são paralelas. Agora preveja onde ficará `h(x)=2x-3` antes de digitá-la. Explique sua previsão usando o termo constante, não apenas expressões como “vai para lá”.

## Investigação 2: mantenha o um

Compare `p(x)=x+1` e `q(x)=3x+1`. As duas funções valem 1 quando a entrada é zero, por isso as retas passam por $(0,1)$. Para $x=2$, os resultados são 3 e 7, respectivamente.

O que mudou foi a taxa de variação. Em $p$, acrescentar uma unidade à entrada acrescenta uma à saída. Em $q$, a mesma alteração da entrada acrescenta três à saída. Verifique se esse padrão permanece ao comparar outras entradas.

## Investigação 3: mude o sinal

Digite `r(x)=-2x+1`. Quando $x$ aumenta, a saída diminui. A reta representa uma função decrescente. Compare $r(0)$, $r(1)$ e $r(2)$, obtendo 1, -1 e -3.

É possível que uma reta muito inclinada pareça quase vertical dependendo da escala. Mesmo assim, uma função da forma $ax+b$, com coeficientes reais, não tem uma reta vertical como gráfico. Para cada entrada há uma única saída.

## Uma pergunta para fechar

Qual função de primeiro grau passa por $(0,3)$ e $(2,7)$? O primeiro ponto informa que $b=3$. Entre os pontos, a saída aumenta quatro unidades enquanto a entrada aumenta duas. Portanto, $a=4/2=2$, e a função é $f(x)=2x+3$.

Digite essa expressão e confira os pontos. Depois, crie seu próprio desafio com dois pontos de abscissas diferentes. Resolva no papel e use a ferramenta como uma segunda forma de verificar.

O GeoGebra permite experimentar rapidamente, mas a investigação fica mais rica quando você registra três coisas: o que imaginou antes, o que observou e como explica a diferença. Para revisar o conteúdo algébrico, consulte [função do primeiro grau](/blog/funcao-primeiro-grau/).


## Um passo além: experimente controles deslizantes

Além de digitar várias expressões, você pode criar controles deslizantes para os coeficientes e observar a reta mudar continuamente. Experimente definir números chamados `a` e `b` na Calculadora Gráfica e então inserir `f(x)=a*x+b`. Ajuste os valores para investigar a inclinação e o intercepto. A disponibilidade e a posição dessas ferramentas variam conforme a versão do GeoGebra; consulte o [manual oficial dos controles deslizantes](https://geogebra.github.io/docs/manual/en/tools/Slider/) quando necessário. Para revisar por que o gráfico é uma reta, leia [Função do primeiro grau: fórmula, gráfico e raiz](/blog/funcao-primeiro-grau/).
