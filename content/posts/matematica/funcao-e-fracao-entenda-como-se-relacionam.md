---
slug: funcao-e-fracao-entenda-como-se-relacionam
title: "Função e fração: entenda como esses dois assuntos se conectam"
description: "Aprenda a usar frações em funções, calcular valores, interpretar coeficientes fracionários, montar tabelas e reconhecer funções com a variável no denominador."
category: matematica
topic: Funções e frações
art: "3x/4"
date: 2026-10-27
published: true
publicationStatus: published
seoTitle: "Função e fração: exemplos, gráficos e exercícios resolvidos"
seoDescription: "Entenda como frações aparecem em funções. Veja f(x)=3x/4, coeficientes fracionários, tabelas, gráficos, funções racionais e exercícios resolvidos."
tags:
  - função e fração
  - funções com frações
  - coeficiente fracionário
  - função do primeiro grau
  - função racional
  - operações com frações
  - gráficos de funções
author: Fernando da Silva Batista
quickAnswer: "Frações e funções se conectam porque uma função pode ter coeficientes fracionários, receber uma fração como entrada ou produzir uma fração como resultado. Por exemplo, f(x)=3x/4 é uma função do primeiro grau, e f(2)=3/2. Já g(x)=12/x tem a variável no denominador e não é uma função do primeiro grau: nela, x não pode ser zero."
faq:
  - question: "Uma função pode ter fração no coeficiente?"
    answer: "Sim. A função f(x)=3x/4 é de primeiro grau, pois pode ser escrita como f(x)=(3/4)x, com coeficiente angular 3/4 e termo constante zero."
  - question: "Como calcular uma função quando x é uma fração?"
    answer: "Basta substituir x pela fração e realizar as operações na ordem correta. Se f(x)=3x/4, então f(2/3)=(3/4)(2/3)=1/2."
  - question: "Toda função com fração é uma função racional?"
    answer: "Não. A função f(x)=x/2 é de primeiro grau e pode ser escrita como (1/2)x. Já g(x)=1/x é uma função racional com x no denominador e não está definida em x=0."
  - question: "O que significa o coeficiente 3/4 no gráfico de uma função?"
    answer: "Em f(x)=3x/4, o valor da função aumenta 3 unidades quando x aumenta 4 unidades. A taxa de variação é 3/4 por unidade de x e o gráfico é uma reta crescente."
  - question: "Como saber se um valor é proibido em uma função com fração?"
    answer: "Verifique se a variável aparece em algum denominador. Os valores que tornam o denominador igual a zero devem ser excluídos do domínio; em g(x)=12/x, por exemplo, x=0 é proibido."
sources:
  - title: "OpenStax — Frações e operações fundamentais"
    url: https://openstax.org/books/prealgebra-2e/pages/4-introduction-to-fractions
  - title: "OpenStax — Gráficos de equações lineares em duas variáveis"
    url: https://openstax.org/books/elementary-algebra-2e/pages/4-2-graph-linear-equations-in-two-variables
  - title: "Khan Academy — Introdução à função afim"
    url: https://pt.khanacademy.org/math/9-ano-mat-pr/xc330d75a48d4d1d9%3A3-trimestre/xc330d75a48d4d1d9%3Asemana-1-nocoes-de-funcoes-e-situacoes-problema-envolvendo-funcao-afim/a/introducao-a-funcao-afim
---

**Fração e função parecem conteúdos separados quando os estudamos pela primeira vez.** Um fala de partes e divisões; o outro, de uma regra que relaciona entradas e saídas. Mas esses assuntos se encontram o tempo todo — nas receitas, nos preços, nos gráficos e em problemas do ENEM.

Imagine uma receita que utiliza **três quartos de xícara de farinha para cada bolo**. Quanto será necessário para produzir dois bolos? E quatro? E se fizermos apenas metade da receita?

Você pode resolver cada situação separadamente. Ou pode criar uma **função** que responde a todas de uma vez.

Neste artigo, vamos aprender a passar de uma fração para uma fórmula, de uma fórmula para uma tabela e de uma tabela para um gráfico. Depois, vamos descobrir por que nem toda expressão com uma divisão representa o mesmo tipo de função.

## 1. Relembrando: o que é uma fração e o que é uma função?

Uma fração, como $\frac34$, representa uma divisão:

$$
\frac34=3\div4=0{,}75.
$$

Ela pode representar uma parte de um inteiro, uma razão entre quantidades ou o resultado de uma divisão. O denominador nunca pode ser zero.

Uma **função** é uma regra que associa a cada entrada permitida **exatamente uma saída**. Por exemplo:

$$
f(x)=2x+1.
$$

Essa regra manda multiplicar a entrada por dois e acrescentar um. Se a entrada for 3, a saída será 7, pois $f(3)=2\cdot3+1=7$.

A conexão aparece quando a própria regra envolve frações:

$$
f(x)=\frac34x.
$$

Agora, em vez de multiplicar por 2, multiplicamos por $\frac34$. E isso continua sendo uma função.

## 2. A receita: uma função com coeficiente fracionário

Voltemos ao exemplo da receita. Cada bolo exige $\frac34$ de xícara de farinha. Se $x$ representa o número de bolos e $F(x)$ representa a farinha necessária, então:

$$
\boxed{F(x)=\frac34x}
$$

Leia a fórmula como **“três quartos de xícara para cada bolo”**.

Vamos construir a tabela:

| Número de bolos $x$ | Cálculo | Farinha $F(x)$ |
| ---: | --- | ---: |
| 0 | $\frac34\cdot0$ | 0 xícara |
| 1 | $\frac34\cdot1$ | $\frac34$ de xícara |
| 2 | $\frac34\cdot2$ | $\frac32$ de xícara |
| 4 | $\frac34\cdot4$ | 3 xícaras |
| 8 | $\frac34\cdot8$ | 6 xícaras |

Observe a linha de dois bolos:

$$
F(2)=\frac34\cdot2=\frac64=\frac32=1{,}5.
$$

Dois bolos precisam de **uma xícara e meia** de farinha.

E se quisermos fazer **meia receita**, isto é, metade de um bolo, no modelo matemático?

$$
F\left(\frac12\right)=\frac34\cdot\frac12=\frac38.
$$

Precisaríamos de **três oitavos de xícara**.

Aqui já aparecem duas conexões: a fração faz parte da fórmula **e também pode ser a entrada da função**. No contexto da receita, valores fracionários representam lotes parciais; não é necessário que $x$ seja sempre inteiro.

## 3. Multiplicar uma fração não é o mesmo que somá-la

Em funções, o coeficiente fracionário indica uma multiplicação.

Na expressão $f(x)=\frac34x$, quando substituímos $x=2$ fazemos:

$$
\frac34\times2=\frac{3\times2}{4}=\frac32.
$$

Não estamos somando $\frac34+2$.

Outro erro comum é imaginar que $\frac34x$ significa $\frac{3}{4x}$. **Não significa!** Veja a diferença:

$$
\frac34x=\frac{3x}{4},
\qquad
\frac{3}{4x}\ne\frac{3x}{4}.
$$

Na primeira expressão, **$x$ está no numerador**. Na segunda, **$x$ aparece no denominador**.

Essa posição muda completamente o comportamento da função, como veremos adiante.

## 4. Uma reta pode ter inclinação de três quartos?

Pode! A função

$$
f(x)=\frac34x
$$

é uma **função do primeiro grau**. Ela está na forma $f(x)=ax+b$, com:

$$
a=\frac34,\qquad b=0.
$$

O gráfico completo dessa função, considerando qualquer número real como entrada, é uma **reta que passa pela origem** $(0,0)$.

Mas como desenhar uma reta com coeficiente angular fracionário?

Uma maneira é escolher pontos fáceis:

- Se $x=0$, então $f(x)=0$, formando o ponto $(0,0)$.
- Se $x=4$, então $f(x)=3$, formando o ponto $(4,3)$.
- Se $x=8$, então $f(x)=6$, formando o ponto $(8,6)$.

Ao passar de $x=0$ para $x=4$, a saída sobe de 0 para 3. Assim, a taxa de variação é:

$$
a=\frac{\Delta y}{\Delta x}=\frac{3-0}{4-0}=\frac34.
$$

**Interpretação:** a cada aumento de **4 unidades na entrada**, o valor da função aumenta **3 unidades na saída**. Equivalentemente, para cada aumento de uma unidade na entrada, a saída aumenta três quartos de unidade.

Na receita, isso significa que **mais quatro bolos exigem mais três xícaras de farinha**.

A reta completa é um modelo algébrico. Se estivermos estudando apenas uma quantidade não negativa de receita, usaremos somente a parte do gráfico correspondente a $x\ge0$.

## 5. E quando existe uma parte fixa na função?

Agora imagine um serviço de entrega com uma taxa fixa de **R$ 4,00** e uma cobrança de **R$ 1,50 por quilômetro**.

Como $1{,}50=\frac32$, o custo para uma distância $d$, em quilômetros, pode ser representado por:

$$
C(d)=\frac32d+4.
$$

Essa função tem **coeficiente angular fracionário**, $\frac32$, e **termo constante**, 4.

Para uma entrega de 6 quilômetros:

$$
C(6)=\frac32\cdot6+4=9+4=13.
$$

O custo, nesse modelo simplificado, seria **R$ 13,00**.

Observe o significado dos dois números:

- $\frac32$: o preço aumenta R$ 1,50 a cada quilômetro;
- $4$: é o preço cobrado mesmo para distância zero, isto é, a taxa fixa.

O gráfico é uma reta crescente que cruza o eixo vertical em $(0,4)$. No mundo real, a distância precisa ser não negativa, e outras tarifas poderiam exigir um modelo mais complexo.

## 6. Função com fração e função racional: qual é a diferença?

Uma dúvida aparece quando encontramos estas duas expressões:

$$
f(x)=\frac{x}{2}
\qquad\text{e}\qquad
g(x)=\frac{12}{x}.
$$

Ambas possuem uma divisão. No entanto, não funcionam da mesma maneira.

**Na primeira**, $f(x)=\frac{x}{2}=\frac12x$. O denominador é o número fixo 2. É uma função do primeiro grau, e seu gráfico é uma reta.

**Na segunda**, $g(x)=\frac{12}{x}$. O denominador é a variável $x$. Trata-se de uma função racional, cujo gráfico, no domínio real não nulo, tem dois ramos de uma hipérbole.

Por que isso importa? Porque, em $g(x)$, **não podemos usar $x=0$**:

$$
g(0)=\frac{12}{0}
$$

não está definido.

Uma função não pode atribuir um resultado numérico a uma divisão por zero.

### Exemplo: repartir 12 pedaços de pizza

Imagine uma pizza cortada em 12 pedaços iguais. Se os pedaços forem distribuídos igualmente entre $x$ pessoas, cada uma recebe:

$$
P(x)=\frac{12}{x}.
$$

| Pessoas $x$ | Pedaços por pessoa $P(x)$ |
| ---: | ---: |
| 1 | 12 |
| 2 | 6 |
| 3 | 4 |
| 4 | 3 |
| 6 | 2 |
| 12 | 1 |

Quanto **mais pessoas**, **menos pedaços por pessoa**. A relação é inversamente proporcional.

Nesse problema, $x$ representa uma quantidade de pessoas e, por isso, assume valores **inteiros positivos**. Não faz sentido usar zero pessoas nem uma quantidade negativa.

Esse exemplo mostra por que precisamos prestar atenção tanto à fórmula quanto ao **domínio**, o conjunto das entradas permitidas.

## 7. O que acontece com o gráfico quando o coeficiente é uma fração?

Compare estas três funções:

$$
f(x)=2x,\qquad
g(x)=\frac12x,\qquad
h(x)=-\frac32x.
$$

Todas são funções do primeiro grau, mas apresentam taxas de variação diferentes.

| Função | Taxa de variação | Comportamento |
| --- | ---: | --- |
| $f(x)=2x$ | $2$ | Crescente |
| $g(x)=\frac12x$ | $\frac12$ | Crescente |
| $h(x)=-\frac32x$ | $-\frac32$ | Decrescente |

Em $f(x)=2x$, a saída sobe duas unidades quando a entrada aumenta uma.

Em $g(x)=\frac12x$, a saída sobe apenas meia unidade para cada unidade a mais na entrada.

Em $h(x)=-\frac32x$, a saída **diminui** uma unidade e meia a cada aumento de uma unidade na entrada.

**Uma fração não torna a função decrescente.** O sinal do coeficiente é que determina se uma função do primeiro grau é crescente ou decrescente: positivo, crescente; negativo, decrescente.

## 8. Como trabalhar função e fração em sala de aula?

Uma estratégia simples é construir uma atividade que reúna **material concreto, tabela, fórmula e gráfico**.

Comece com uma medida real ou imaginária: uma fita, uma receita ou a quantidade de tinta para pintar uma parede. Defina uma fração por unidade e peça aos estudantes que calculem o consumo para quantidades diferentes.

Depois, conduza a transformação em quatro etapas:

1. **Fale:** “Para cada unidade, gasto três quartos de uma xícara.”
2. **Registre:** para uma unidade, $\frac34$; para duas, $\frac32$; para quatro, 3.
3. **Generalize:** $F(x)=\frac34x$.
4. **Represente:** marque os pares da tabela no plano cartesiano e discuta por que estão alinhados.

Para turmas que já estudaram o assunto, proponha uma segunda pergunta: *o que muda se a quantidade for dividida igualmente entre $x$ pessoas em vez de ser multiplicada por $x$?*

O contraste entre $\frac34x$ e $\frac{12}{x}$ ajuda os estudantes a diferenciar dois comportamentos matemáticos.

## 9. Exercícios: teste se você realmente entendeu

Tente resolver antes de consultar as respostas.

**Questão 1.** Uma função é dada por $f(x)=\frac25x$. Calcule $f(10)$ e $f(5)$.

**Questão 2.** Considere $g(x)=\frac12x+3$. Calcule $g(4)$ e determine o valor de $x$ para o qual $g(x)=0$.

**Questão 3.** Para a função $h(x)=-\frac34x+6$, diga se ela é crescente ou decrescente. Depois calcule $h(4)$.

**Questão 4.** Uma equipe divide R$ 60,00 igualmente entre $x$ pessoas. Escreva a função que representa quanto cada pessoa recebe e explique por que não podemos usar $x=0$.

**Questão 5.** Uma receita utiliza $\frac23$ de litro de leite por unidade. Escreva a função $L(x)$ e descubra quanto leite será necessário para $\frac32$ receita.

### Gabarito comentado

**1.** $f(10)=\frac25\cdot10=4$ e $f(5)=\frac25\cdot5=2$.

**2.** $g(4)=\frac12\cdot4+3=5$. Para achar a raiz, resolvemos $\frac12x+3=0$. Assim, $\frac12x=-3$, e **$x=-6$**.

**3.** A função é **decrescente**, pois o coeficiente de $x$ é negativo. Calculando, $h(4)=-\frac34\cdot4+6=-3+6=3$.

**4.** A função é $V(x)=\frac{60}{x}$. No contexto real, $x$ deve ser um inteiro positivo. Dividir por zero não é uma operação definida.

**5.** $L(x)=\frac23x$. Para uma receita e meia, $L\left(\frac32\right)=\frac23\cdot\frac32=1$. Portanto, será necessário **1 litro de leite**.

## Conclusão: fração e função fazem parte da mesma linguagem

A fração ajuda a expressar uma **razão, medida ou divisão**. A função transforma essa relação em uma regra capaz de responder a diferentes perguntas.

Quando você entende que $\frac34x$ significa multiplicar a entrada por três quartos, passa a interpretar tabelas e coeficientes sem medo dos números fracionários.

E, quando percebe a diferença entre $\frac{x}{2}$ e $\frac{12}{x}$, começa a compreender que **o lugar da variável na expressão importa**: ele pode alterar o tipo de função, o gráfico e os valores permitidos.

Para revisar a base, leia [Frações: entenda as partes antes de decorar as contas](/blog/fracoes-sem-decorar/). Depois, aprofunde a interpretação de gráficos em [Função do primeiro grau: o que a fórmula conta sobre o gráfico](/blog/funcao-primeiro-grau/).

**A Matemática fica mais clara quando percebemos que seus assuntos não são capítulos isolados: são diferentes maneiras de descrever relações.**
