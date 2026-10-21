---
slug: probabilidade-mega-sena-matematica-apostas
title: "Qual é a probabilidade de ganhar na Mega-Sena? Entenda a Matemática por trás das apostas"
description: "Descubra de onde vem a chance de 1 em 50.063.860 na Mega-Sena e aprenda combinações, probabilidade, quina, quadra e os mitos sobre números da sorte."
category: matematica
topic: Probabilidade e Análise Combinatória
art: "1/50M"
date: 2026-10-21
published: false
publicationStatus: scheduled
publishAt: "2026-10-21T08:00"
seoTitle: "Qual é a probabilidade de ganhar na Mega-Sena? Veja o cálculo"
seoDescription: "Entenda por que a chance de acertar a Mega-Sena é de 1 em 50.063.860. Veja o cálculo com combinações, as chances de quina e quadra e os mitos comuns."
tags:
  - Mega-Sena
  - probabilidade
  - análise combinatória
  - combinações
  - educação financeira
  - matemática das loterias
author: Fernando da Silva Batista
quickAnswer: "Uma aposta simples de seis dezenas tem chance de 1 em 50.063.860 de acertar a sena, cerca de 0,000002% por sorteio. O número vem das combinações de seis elementos escolhidos entre 60, sem importar a ordem. A chance de acertar a quina é de aproximadamente 1 em 154.518; a da quadra, de 1 em 2.332."
faq:
  - question: "Qual é a probabilidade de acertar os seis números da Mega-Sena?"
    answer: "Com uma única aposta simples de seis dezenas, a chance é de 1 em 50.063.860 por sorteio, aproximadamente 0,000002%. Esse total corresponde ao número de combinações possíveis de seis dezenas entre 60."
  - question: "Qual é a probabilidade de ganhar na quina ou na quadra?"
    answer: "Na aposta simples de seis números, a probabilidade aproximada da quina é de 1 em 154.518, e a da quadra é de 1 em 2.332. São premiações distintas de acertar todos os seis números."
  - question: "Escolher números que saem mais ou estão atrasados aumenta a chance?"
    answer: "Não. Se os sorteios forem independentes e realizados corretamente, toda combinação de seis dezenas tem a mesma probabilidade no sorteio seguinte. Resultados passados não criam uma dívida matemática para determinada dezena."
  - question: "Marcar sete dezenas melhora a probabilidade de acertar a sena?"
    answer: "Sim, porque sete dezenas formam sete combinações distintas de seis números. A chance passa a 1 em 7.151.980, mas o valor da aposta também é multiplicado por sete: na tabela oficial consultada em outubro de 2026, passa de R$ 6,00 para R$ 42,00."
  - question: "Uma aposta com números em sequência tem menos chance?"
    answer: "Não. A combinação 01-02-03-04-05-06 tem exatamente a mesma chance que qualquer outra combinação específica de seis dezenas. O que muda é a percepção humana de aleatoriedade, não a probabilidade do resultado."
sources:
  - title: "CAIXA — Mega-Sena: regras, preços e probabilidades"
    url: https://loterias.caixa.gov.br/Paginas/mega-sena.aspx
  - title: "CAIXA — Manual de Produtos Loterias, março de 2026"
    url: https://www.caixa.gov.br/Downloads/loterias-manual-de-produtos/MANUAL_DE_PRODUTOS_v19.pdf
  - title: "CAIXA — Jogo Responsável: informações e prevenção"
    url: https://www.caixa.gov.br/jogo-responsavel/Paginas/default.aspx
---

Imagine colocar **60 bolinhas numeradas de 01 a 60** em uma urna e retirar seis delas, sem devolver nenhuma. Se você tivesse escolhido antecipadamente seis números, qual seria a chance de acertar todos?

A resposta pode surpreender: **uma em 50.063.860**. Esse número não surgiu de uma estimativa nem de um palpite. Ele é uma consequência da **Análise Combinatória**, uma área da Matemática que estuda maneiras de selecionar e organizar elementos.

Mas há uma diferença importante entre **ter alguma chance de ganhar** e **ter uma chance razoável de ganhar**. Entender essa distinção ajuda a interpretar notícias sobre prêmios milionários, reconhecer erros de raciocínio e tomar decisões mais conscientes sobre dinheiro.

Neste artigo, vamos reconstruir os cálculos da Mega-Sena passo a passo, sem fórmulas mágicas ou promessas de previsão.

## Como funciona a probabilidade da Mega-Sena?

Na modalidade regular da Mega-Sena, são sorteadas seis dezenas entre as 60 disponíveis. Uma aposta simples escolhe seis dessas dezenas; a ordem em que elas aparecem não altera o resultado.

Isso significa que marcar **01, 08, 17, 26, 39 e 54** corresponde à mesma combinação, independentemente da ordem em que esses seis números sejam escritos.

Existem três faixas principais de premiação para a aposta simples:

- **Sena:** acertar as seis dezenas sorteadas;
- **Quina:** acertar exatamente cinco dezenas;
- **Quadra:** acertar exatamente quatro dezenas.

As chances de cada faixa são diferentes. Quando alguém pergunta qual é a probabilidade de "ganhar na Mega-Sena", é importante saber se está falando especificamente da sena ou de **qualquer faixa premiada**.

## Por que existem exatamente 50.063.860 combinações?

Vamos começar com uma pergunta mais simples: de quantas maneiras podemos escolher **duas** pessoas entre cinco para formar uma dupla?

Se a ordem importasse, seriam cinco possibilidades para a primeira pessoa e quatro para a segunda: $5\times4=20$. Mas Ana–Bruno e Bruno–Ana representam a **mesma dupla**. Por isso, dividimos o resultado por $2!=2$ e encontramos **10 duplas diferentes**.

Na Mega-Sena, o princípio é o mesmo, mas escolhemos **seis entre 60**.

Usamos a fórmula das combinações:

$$
C_{n,p}=\binom{n}{p}=\frac{n!}{p!(n-p)!}.
$$

Aqui, o símbolo $!$ representa o **fatorial**: por exemplo, $4!=4\times3\times2\times1=24$.

Substituindo $n=60$ e $p=6$:

$$
\binom{60}{6}
=\frac{60!}{6!\,54!}
=\frac{60\cdot59\cdot58\cdot57\cdot56\cdot55}
{6\cdot5\cdot4\cdot3\cdot2\cdot1}.
$$

O resultado é:

$$
\boxed{\binom{60}{6}=50\,063\,860}.
$$

Portanto, há **50.063.860 conjuntos diferentes de seis dezenas**. Se todos forem igualmente prováveis, apenas **um** coincide exatamente com uma aposta simples específica.

A probabilidade de acertar a sena é:

$$
P(\text{sena})=\frac{1}{50\,063\,860}
\approx 0{,}000001997\%.
$$

Em outras palavras, arredondando, **0,000002% por aposta simples e por sorteio**.

É um valor muito pequeno. Mas a Matemática permite enxergar seu tamanho sem depender apenas da expressão "uma chance em milhões".

## E as chances de acertar a quina e a quadra?

Acertar seis dezenas não é a única possibilidade de premiação. Na aposta simples também existem a quina e a quadra.

Para entender a **quina**, imagine que as seis dezenas sorteadas já são conhecidas. Uma aposta com exatamente cinco acertos escolhe:

- cinco das seis dezenas sorteadas: $\binom{6}{5}=6$ possibilidades;
- uma das outras 54 dezenas: $\binom{54}{1}=54$ possibilidades.

Portanto, existem:

$$
\binom{6}{5}\binom{54}{1}=6\times54=324
$$

combinações que acertam exatamente cinco números.

Como o universo total tem 50.063.860 combinações:

$$
P(\text{quina})=\frac{324}{50\,063\,860}
\approx\frac{1}{154\,518}.
$$

Para a **quadra**, escolhemos quatro das seis dezenas sorteadas e duas das outras 54:

$$
\binom{6}{4}\binom{54}{2}
=15\times1\,431
=21\,465.
$$

Assim:

$$
P(\text{quadra})=\frac{21\,465}{50\,063\,860}
\approx\frac{1}{2\,332}.
$$

A tabela da CAIXA confirma esses valores arredondados para uma aposta simples:

| Resultado | Chance aproximada |
| --- | --- |
| **Sena — 6 acertos** | 1 em 50.063.860 |
| **Quina — 5 acertos** | 1 em 154.518 |
| **Quadra — 4 acertos** | 1 em 2.332 |

Se considerarmos **qualquer uma dessas três faixas**, as combinações favoráveis somam $1+324+21\,465=21\,790$. Isso representa aproximadamente **uma chance em 2.298** de obter ao menos uma premiação na aposta simples, sem levar em conta o valor recebido.

**Ganhar algum prêmio não significa recuperar o dinheiro gasto.** O prêmio da quadra ou da quina varia conforme as regras de distribuição e o resultado do concurso.

## Marcar mais números realmente melhora as chances?

Sim, mas é importante compreender **por quê** — e quanto isso custa.

Ao marcar sete dezenas, estamos incluindo todas as combinações possíveis de seis dezenas dentro daquele conjunto. O número dessas combinações é:

$$
\binom{7}{6}=7.
$$

Com oito dezenas, são:

$$
\binom{8}{6}=28.
$$

Essas apostas ampliadas cobrem mais combinações. Por isso, a chance de acertar a sena aumenta. Mas o preço cresce na mesma proporção do número de apostas simples equivalentes.

Segundo a tabela oficial da CAIXA consultada em outubro de 2026:

| Dezenas marcadas | Combinações de 6 | Valor da aposta | Chance de sena |
| --- | ---: | ---: | --- |
| 6 | 1 | R$ 6,00 | 1 em 50.063.860 |
| 7 | 7 | R$ 42,00 | 1 em 7.151.980 |
| 8 | 28 | R$ 168,00 | 1 em 1.787.995 |
| 10 | 210 | R$ 1.260,00 | Aproximadamente 1 em 238.399 |

Observe o caso das sete dezenas: a probabilidade de sena aumenta **sete vezes**, mas o gasto também aumenta **sete vezes**. Isso não transforma a loteria em um investimento nem garante retorno.

Os valores são os informados pela CAIXA na data de consulta; tarifas e regras podem ser alteradas.

## A sequência 01, 02, 03, 04, 05, 06 tem menos chance de sair?

**Não.** Essa é uma das confusões mais comuns quando estudamos probabilidade.

A combinação:

**01 – 02 – 03 – 04 – 05 – 06**

tem exatamente a mesma chance de sair que:

**07 – 19 – 28 – 34 – 46 – 59**.

Nossa intuição estranha uma sequência ordenada porque ela *parece menos aleatória*. Entretanto, em um sorteio justo, **cada combinação específica** tem probabilidade igual a $1/50\,063\,860$.

Isso não significa que padrões sejam tão comuns quanto resultados sem padrões quando agrupamos várias combinações: existem muitas combinações que não formam a sequência crescente mais óbvia. Mas, ao comparar **uma combinação particular com outra**, as probabilidades são iguais.

E há outra distinção: uma sequência muito popular pode ser escolhida por mais pessoas. Se ela for sorteada e houver vários ganhadores, o prêmio poderá ser dividido. **Isso não altera a chance de sair**, apenas pode afetar a divisão do prêmio.

## Números "atrasados" têm mais chance no próximo sorteio?

Também não.

Se uma dezena não apareceu em muitos concursos, isso não cria uma obrigação matemática de que ela apareça no próximo. Essa ideia é conhecida como **falácia do apostador**.

Considere o lançamento de uma moeda equilibrada. Mesmo que ela tenha apresentado cara cinco vezes seguidas, a chance de cara no lançamento seguinte continua sendo:

$$
P(\text{cara})=\frac12=50\%.
$$

Os lançamentos anteriores não tornam o próximo resultado mais previsível, desde que sejam eventos independentes.

Na Mega-Sena, o raciocínio é semelhante: **sob condições de sorteio justo e independente**, o resultado anterior não muda a probabilidade de cada combinação no próximo sorteio.

Consultar quais números apareceram mais vezes pode servir como exercício de **Estatística descritiva**, mas não demonstra que esses números terão maior chance no futuro.

## Um prêmio maior aumenta a chance de ganhar?

Não. O valor anunciado como prêmio e a probabilidade matemática são grandezas diferentes.

Um concurso com prêmio acumulado pode despertar mais interesse, mas, se as regras de sorteio e a quantidade de dezenas continuarem iguais, **uma aposta simples ainda terá chance de 1 em 50.063.860 de acertar a sena**.

Outro detalhe importante: o prêmio divulgado é potencial, não necessariamente o valor que uma única pessoa receberá. Quando há mais de um acertador da sena, a premiação dessa faixa é dividida conforme as regras da modalidade.

**Prêmio grande não é sinônimo de probabilidade grande.**

## E se alguém apostar toda semana?

Repetir a aposta não torna uma determinada combinação mais provável no concurso seguinte. Cada sorteio continua tendo suas próprias probabilidades.

O que certamente se acumula é o **gasto**.

Considerando, apenas para ilustrar, uma aposta simples de R$ 6,00 por semana durante 52 semanas:

$$
52\times 6=\text{R\$ }312{,}00.
$$

Esse dinheiro foi destinado às apostas, independentemente de quantas vezes a pessoa ganhou ou perdeu. E esse cálculo não incorpora reajustes de preço ou eventuais prêmios recebidos.

Aqui entra um ponto de **educação financeira**: distinguir uma despesa de lazer, sujeita à perda, de uma estratégia de poupança ou investimento. Uma aposta é uma possibilidade de resultado incerto, não uma forma confiável de construir patrimônio.

Quer trabalhar essa comparação em aula? Leia também [Educação financeira na escola: como criar mininegócios com alunos do Ensino Fundamental](/blog/educacao-financeira-ensino-fundamental-mininegocios/) e [Porcentagem no cotidiano: desconto, aumento e a base da comparação](/blog/porcentagem-cotidiano/).

## Três desafios para testar o que você aprendeu

**Desafio 1 — Combinações menores.** Uma urna tem oito bolinhas diferentes. Quantas combinações de três bolinhas podemos formar, sem importar a ordem?

**Desafio 2 — Probabilidade.** Um sorteio fictício seleciona dois números entre dez, sem repetição. Qual é a chance de acertar os dois escolhidos em uma aposta simples com dois números?

**Desafio 3 — Orçamento.** Se uma despesa de R$ 6,00 ocorre uma vez por semana durante dez semanas, qual é o gasto total? Por que essa informação é mais previsível do que qualquer premiação?

**Respostas comentadas:** no primeiro, $\binom83=56$. No segundo, $\binom{10}{2}=45$ combinações, então a chance de acertar as duas é $1/45$, aproximadamente 2,22%. No terceiro, o gasto é R$ 60,00: ele pode ser calculado com antecedência, enquanto o recebimento de prêmios não é garantido.

## O que a Mega-Sena ensina sobre Matemática?

A Mega-Sena é um ótimo **contexto de estudo** para combinações, probabilidade, porcentagem, independência de eventos, estatística e educação financeira.

Ela mostra que algumas ideias que parecem intuitivas — como "um número está devendo aparecer" ou "um prêmio muito grande fica mais fácil de ganhar" — não resistem ao cálculo.

Ao mesmo tempo, compreender uma chance pequena não é o mesmo que recomendar uma aposta. **Loterias são atividades para adultos, com risco de perda de dinheiro**, e não devem ser apresentadas como caminho de enriquecimento. No Brasil, menores de 18 anos não podem apostar.

O mais valioso, aqui, é usar a Matemática para pensar melhor: **antes de confiar em um palpite, pergunte qual é o espaço de possibilidades, quantas delas favorecem o resultado desejado e qual é o custo da decisão.**

Essas perguntas servem não só para analisar loterias, mas também para desenvolver uma relação mais crítica e consciente com números, riscos e dinheiro.

*Conteúdo educativo, sem incentivo à participação em apostas. As probabilidades e os valores de apostas citados foram conferidos na tabela oficial da CAIXA em 21 de outubro de 2026. Consulte as referências para eventuais alterações.*