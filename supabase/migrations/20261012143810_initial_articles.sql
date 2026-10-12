-- Initial public content, with stable content IDs independent of database-generated IDs.
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('448a58d9-c844-4c45-ab31-ed15ce88157f','equacao-primeiro-grau','Equação do primeiro grau: resolva mantendo o equilíbrio','Entenda o que acontece em cada transformação da equação e aprenda a conferir sua resposta.','matematica','Resolver uma equação é procurar os valores que tornam uma igualdade verdadeira. Em $2x+7=19$, o símbolo $x$ representa um número que ainda queremos descobrir. A pergunta é: que número, multiplicado por dois e depois somado a sete, resulta em dezenove?

Uma equação do primeiro grau com uma incógnita pode ser escrita como $ax+b=0$, com $a\ne0$. A incógnita aparece elevada à primeira potência. É comum que ela esteja inicialmente em ambos os lados ou dentro de parênteses; organizar a expressão ajuda a reconhecer a forma.

## A ideia de equilíbrio

Pense nos dois lados da igualdade como quantidades equilibradas. Se subtrairmos o mesmo número dos dois lados, preservamos a igualdade. O mesmo vale para somar um número, multiplicar por um número diferente de zero ou dividir por um número diferente de zero.

No exemplo inicial, começamos retirando sete dos dois lados:

$$
2x+7-7=19-7.
$$

Logo, $2x=12$. Dividindo ambos os lados por dois, chegamos a $x=6$. Essa explicação mostra o que está por trás do atalho conhecido como “passar para o outro lado”. O termo não muda de sinal por atravessar uma fronteira: aplicamos uma operação equivalente aos dois membros.

## Como saber se a resposta está certa

Substitua a incógnita na equação original. Para $x=6$, temos $2\cdot6+7=12+7=19$. A igualdade é verdadeira. Conferir na equação original é importante porque uma transformação incorreta no meio da resolução pode produzir uma conta aparentemente organizada.

## Incógnita dos dois lados

Resolva $5x-4=2x+11$. Subtraindo $2x$ dos dois lados, obtemos $3x-4=11$. Somando quatro, temos $3x=15$. Dividindo por três, encontramos $x=5$.

A verificação mostra que os dois membros valem 21. Esse procedimento reúne os termos com a incógnita de um lado e os números do outro, mas a ordem das operações pode variar. O importante é preservar a equivalência.

## Um cuidado com os parênteses

Em $3(x-2)=15$, você pode dividir ambos os lados por três e obter $x-2=5$, portanto $x=7$. Também pode usar a propriedade distributiva: $3x-6=15$, depois $3x=21$ e $x=7$.

Um erro frequente seria escrever $3x-2=15$. O três multiplica **cada termo** dentro dos parênteses. A equivalência entre os dois caminhos corretos ajuda a verificar se a distribuição foi feita adequadamente.

## Transforme uma situação em equação

Uma oficina cobra uma taxa fixa de 20 reais mais 8 reais por peça ajustada. Um atendimento custou 68 reais. Quantas peças foram ajustadas, considerando esse modelo?

Representando a quantidade de peças por $x$, escrevemos $20+8x=68$. Subtraímos vinte: $8x=48$. Dividimos por oito: $x=6$. O resultado deve ser interpretado: foram seis peças, e a conferência é $20+8\cdot6=68$.

## Nem toda igualdade com letras tem uma única solução

Ao simplificar $2x+4=2(x+2)$, os termos com $x$ se cancelam e resta $4=4$. Todo número real satisfaz essa igualdade. Já em $2x+4=2x+5$, resta $4=5$, que é falso: não há solução real.

Nessas situações, o coeficiente da incógnita desaparece depois da simplificação. Por isso, é necessário observar a condição $a\ne0$ ao falar da forma de primeiro grau.

## Exercícios para praticar

1. $4x+3=27$.
2. $7x-5=3x+11$.
3. $2(x+4)=18$.

**Respostas:** $x=6$, $x=4$ e $x=5$. Escolha uma das equações e explique cada operação em voz alta. Se sua justificativa for “fiz a mesma operação nos dois lados”, você está usando a ideia central.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('equacao-primeiro-grau','Equação do primeiro grau: resolva mantendo o equilíbrio','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('682e5df5-e186-4a28-af98-03f39dbe20b4','formulas-latex','Fórmulas no LaTeX: frações, potências e raízes bem escritas','Aprenda os comandos essenciais e entenda quando uma expressão deve aparecer no texto ou em destaque.','latex','Uma fórmula bem escrita ajuda o leitor a perceber a estrutura de uma ideia. No LaTeX, o modo matemático cuida do espaçamento entre operadores e da apresentação dos símbolos, mas você precisa indicar corretamente quais partes pertencem a cada comando.

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

Consulte a [documentação do Overleaf sobre expressões matemáticas](https://www.overleaf.com/learn/latex/Mathematical_expressions) para explorar outras formas de apresentação. Se ainda não tem um arquivo de trabalho, comece pelo [primeiro documento em LaTeX](/blog/primeiro-documento-latex/).','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('formulas-latex','Fórmulas no LaTeX: frações, potências e raízes bem escritas','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('75c674fb-f0c2-41e9-ab5a-bb62b0a840bc','fracoes-sem-decorar','Frações: entenda as partes antes de decorar as contas','Descubra por que os denominadores precisam combinar e resolva somas de frações com sentido.','matematica','Imagine duas barras de chocolate do mesmo tamanho. Uma foi dividida em duas partes iguais; a outra, em três. Você pega uma parte de cada barra. Quantas barras recebeu ao todo? A resposta não é dois quintos. Para entender a conta, precisamos observar o tamanho das partes.

Uma fração como $\frac{a}{b}$ pode representar uma divisão, com $b\ne 0$. Quando trabalhamos com partes de um inteiro, o denominador indica em quantas partes iguais esse inteiro foi dividido; o numerador informa quantas dessas partes estamos considerando.

## O inteiro de referência precisa ser o mesmo

Metade de uma pizza pequena não tem necessariamente a mesma quantidade de comida que metade de uma pizza grande. As duas porções representam metade dos respectivos inteiros, mas os inteiros são diferentes.

Nos exemplos deste texto, as barras têm o mesmo tamanho. Isso permite comparar e somar suas partes usando a mesma unidade de referência. Antes de calcular uma situação concreta, pergunte: **fração de quê?**

## Frações diferentes podem representar o mesmo valor

Uma metade também pode ser descrita como duas partes de um inteiro dividido em quatro, ou três partes de um inteiro dividido em seis:

$$
\frac12=\frac24=\frac36.
$$

Para obter uma fração equivalente, podemos multiplicar numerador e denominador pelo mesmo número diferente de zero. Multiplicar ambos por três, por exemplo, mantém a razão entre eles. Simplificar faz o caminho inverso, dividindo os dois termos pelo mesmo divisor comum.

Assim, $\frac{18}{24}=\frac34$, pois dividimos 18 e 24 por 6. Essa simplificação não reduz a quantidade representada. Apenas troca a maneira de escrevê-la.

## Por que não somamos os denominadores?

Somar $\frac12+\frac13$ significa juntar uma metade e um terço. Como as partes têm tamanhos diferentes, primeiro escrevemos ambas em uma unidade comum: sextos.

$$
\frac12+\frac13=\frac36+\frac26=\frac56.
$$

O denominador continua sendo seis porque cada parte que contamos é um sexto. Somamos a quantidade de partes, não o número que define o tamanho delas.

Você pode visualizar isso repartindo cada metade em três pedaços e cada terço em dois. Os pedaços menores passam a ter o mesmo tamanho. O mínimo múltiplo comum ajuda a escolher um denominador comum pequeno, mas não é a única possibilidade: usar doze também funcionaria, desde que as equivalências fossem corretas.

## Um exemplo com medida

Uma receita utiliza $\frac34$ de xícara de leite e você já colocou $\frac12$ de xícara. Quanto falta?

$$
\frac34-\frac12=\frac34-\frac24=\frac14.
$$

Falta um quarto de xícara. A estimativa confirma: três quartos é maior que uma metade, então a diferença deve ser positiva e menor que uma metade.

## E quando o numerador é maior?

A fração $\frac74$ representa sete quartos. Quatro quartos formam um inteiro; sobram três quartos. Portanto, $\frac74=1+\frac34$. Frações podem representar valores maiores que um: elas não se limitam a uma pequena parte de um único objeto.

## Pratique e confira o raciocínio

1. Simplifique $\frac{12}{18}$.
2. Calcule $\frac25+\frac1{10}$.
3. Uma garrafa tinha $\frac56$ de litro de água. Foram consumidos $\frac13$ de litro. Quanto restou?

**Respostas comentadas:** na primeira, dividir ambos os termos por 6 produz $\frac23$. Na segunda, dois quintos equivalem a quatro décimos; o total é $\frac5{10}=\frac12$. Na terceira, um terço equivale a dois sextos, então restam três sextos, ou meio litro.

Ao conferir uma conta, tente explicar por que escolheu cada passo. Se você consegue justificar a equivalência das frações, já está construindo uma base mais sólida para porcentagens, proporções e equações.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('fracoes-sem-decorar','Frações: entenda as partes antes de decorar as contas','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('0a7af0e4-dedd-4efa-a3e2-f118a00fdf9b','funcao-primeiro-grau','Função do primeiro grau: o que a fórmula conta sobre o gráfico','Ligue tabela, fórmula e gráfico para entender os coeficientes, a raiz e o crescimento de uma função.','matematica','Uma função associa cada elemento de um conjunto de partida a um único resultado no conjunto de chegada. Para começar, imagine uma regra que recebe um número, multiplica por dois e soma um. A entrada 0 produz 1; a entrada 3 produz 7. Podemos representar essa regra por $f(x)=2x+1$.

A expressão $f(x)$ significa “valor da função na entrada $x$”. Ela não representa uma multiplicação entre $f$ e $x$. Essa distinção evita uma dificuldade comum ao ler a notação pela primeira vez.

## A forma geral e seus coeficientes

A função afim tem a forma $f(x)=ax+b$. Quando $a\ne0$, ela é de primeiro grau. O coeficiente $a$ indica quanto o valor da função varia quando $x$ aumenta uma unidade. O coeficiente $b$ é o valor da função em zero, pois $a\cdot0+b=b$.

Na função $f(x)=2x+1$, cada aumento de uma unidade na entrada acrescenta duas unidades ao resultado. Quando a entrada é zero, o resultado é um.

| Entrada $x$ | Cálculo | Saída $f(x)$ |
| --- | --- | --- |
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

**Conferência:** $a=-2$ e $b=8$; $h(3)=2$; a raiz é 4; a função é decrescente. No gráfico completo, ela passa por $(0,8)$ e $(4,0)$. Usar fórmula, tabela e gráfico em conjunto ajuda a perceber que são três maneiras de descrever a mesma relação.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('funcao-primeiro-grau','Função do primeiro grau: o que a fórmula conta sobre o gráfico','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('b07ccf4a-7226-4404-a3a2-d8aa5ab0f874','geogebra-funcao','Explore a função do primeiro grau com o GeoGebra','Uma atividade guiada para investigar o que muda no gráfico quando você altera os coeficientes.','tecnologia','Um gráfico pronto pode mostrar uma resposta. Uma investigação com gráficos pode revelar relações. Nesta atividade, vamos usar a Calculadora Gráfica do GeoGebra para comparar funções do primeiro grau, fazer previsões e conferir se elas se confirmam.

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

O GeoGebra permite experimentar rapidamente, mas a investigação fica mais rica quando você registra três coisas: o que imaginou antes, o que observou e como explica a diferença. Para revisar o conteúdo algébrico, consulte [função do primeiro grau](/blog/funcao-primeiro-grau/).','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('geogebra-funcao','Explore a função do primeiro grau com o GeoGebra','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('07b7a7d8-488d-419a-acf6-ff54388bf2ee','lista-exercicios-latex','Como montar uma lista de exercícios simples em LaTeX','Crie uma lista numerada, deixe espaço para resolução e organize um gabarito fácil de atualizar.','latex','Uma boa lista de exercícios precisa ser fácil de ler, resolver e revisar. O LaTeX ajuda a manter a numeração e a estrutura consistentes, especialmente quando você inclui ou reorganiza questões. Para começar, vamos montar um arquivo pequeno com três exercícios e um gabarito separado.

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

Para personalizar rótulos e espaçamentos, consulte a [documentação do Overleaf sobre listas](https://www.overleaf.com/learn/latex/Lists). Aprenda primeiro a estrutura básica; adicione novas opções quando elas resolverem uma necessidade concreta.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('lista-exercicios-latex','Como montar uma lista de exercícios simples em LaTeX','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('7cadeccd-5bee-453f-a1a9-782dc4cfc4c1','obs-primeira-aula','OBS para professores: prepare sua primeira aula gravada','Organize tela, câmera e áudio em uma estrutura simples e faça um teste antes de gravar a aula completa.','tecnologia','A primeira aula gravada não precisa de uma abertura animada ou de muitas transições. O mais importante é que o estudante consiga ouvir sua explicação e ler o material. Uma estrutura simples também facilita corrigir problemas antes que eles comprometam uma gravação longa.

O OBS Studio trabalha com cenas e fontes. Uma cena organiza o que aparecerá na saída; as fontes são os elementos que a compõem, como uma janela, uma câmera ou uma imagem. Vamos usar essa estrutura para planejar uma aula curta.

## Defina o que o aluno precisa enxergar

Antes de abrir o programa, escolha um objetivo pequeno: explicar a solução de uma equação, apresentar uma ferramenta ou comentar um exercício. Prepare o material com letra grande e deixe espaço para apontar ou escrever.

Um teste útil é abrir o material em uma janela menor. Se a fórmula fica difícil de distinguir nesse tamanho, ela provavelmente precisará de ajustes para quem assistir pelo celular. A câmera pode aproximar a conversa, mas não deve esconder uma parte importante da resolução.

## Monte duas cenas

Crie uma cena chamada “Apresentação”, contendo sua câmera, e outra chamada “Aula”, contendo o material de trabalho. Na segunda, você pode acrescentar uma câmera pequena no canto, desde que sobre espaço.

Para capturar um aplicativo, procure a fonte de captura de janela adequada ao seu sistema. Para capturar uma tela inteira, use a fonte correspondente. Os nomes e a disponibilidade podem variar conforme o sistema operacional. A captura de janela ajuda a limitar a área mostrada, mas é importante conferir o resultado real antes de gravar.

As fontes têm uma ordem: as que estão acima na lista podem cobrir as inferiores. Se a câmera sumiu, verifique essa ordem e a visibilidade indicada pelo ícone de olho.

## Trate o áudio como parte da explicação

Fale uma frase em volume normal e observe o medidor do microfone. Depois, grave uma amostra e escute com fones. Um medidor se movimentando confirma que há sinal, mas não garante que a voz esteja agradável ou que o dispositivo correto tenha sido selecionado.

Evite capturar o mesmo microfone em duas fontes ao mesmo tempo. Se houver eco ou voz duplicada, investigue fontes sobrepostas e monitoramento. Faça também um teste com alguns segundos de silêncio para perceber ruídos constantes.

Na aula de Matemática, pausas para pensar e escrever fazem parte do ritmo. Não é necessário preencher cada segundo com fala. O áudio deve ajudar o estudante a acompanhar seu raciocínio.

## Grave um ensaio de um minuto

Use o assistente de configuração do OBS como ponto de partida e faça uma gravação curta. No ensaio, apresente o tema, troque de cena, mostre uma conta e finalize. Abra o arquivo gravado, não apenas a prévia do programa.

Confira quatro pontos: a voz pode ser compreendida, o texto pode ser lido, nenhuma janela indevida aparece e a troca de cena acontece como esperado. A cada tentativa, altere apenas o necessário para resolver o problema observado.

## Organize uma rotina repetível

Crie uma pequena lista pessoal de preparação: material aberto, microfone selecionado, notificações controladas, destino da gravação conhecido e teste concluído. Depois da aula, assista a alguns trechos do início, do meio e do final antes de publicar.

As coleções de cenas e os perfis são recursos diferentes. Perfis guardam configurações relacionadas à transmissão e saída; cenas ficam nas coleções. Se você trabalha com vários canais, confira a conta e o destino efetivamente selecionados a cada transmissão, além de conferir a coleção visual usada.

Para consultar as opções do programa, veja o [guia inicial oficial](https://obsproject.com/kb/quick-start-guide), o [guia de fontes](https://obsproject.com/kb/sources-guide) e a [documentação de perfis](https://obsproject.com/kb/profiles). Os exemplos deste artigo são uma proposta de organização de aula; adapte-os ao seu equipamento e à sua forma de ensinar.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('obs-primeira-aula','OBS para professores: prepare sua primeira aula gravada','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('ddaf2764-12c4-4a4a-af11-5b804c78d33c','organizar-google-drive','Organize seus materiais de aula no Google Drive','Uma estrutura simples de pastas e nomes para encontrar atividades, versões e gabaritos com menos esforço.','tecnologia','“Lista final”, “lista final nova” e “lista final agora” são nomes que contam a história de uma dificuldade: falta um critério claro para identificar o material certo. A organização de arquivos fica mais útil quando responde a três perguntas: sobre qual assunto é o arquivo, para quem ele serve e qual versão deve ser usada?

A proposta abaixo é uma forma de organizar materiais de ensino. Ela não depende de uma quantidade específica de pastas e pode ser adaptada a quem estuda sozinho, atende alunos ou trabalha com várias turmas.

## Separe acervo de aplicação

Crie uma pasta de acervo por assunto, como “Matemática / Equações / Primeiro grau”. Nela, guarde os arquivos de referência que podem ser usados em diferentes ocasiões.

Em outra área, organize as aplicações por turma ou período: “Turmas / 2026 / Turma A”. Essa separação evita confundir o material original com a adaptação que você fez para uma aula específica.

Um acervo pode conter a explicação-base e uma lista-modelo. A pasta da turma pode conter a seleção de questões utilizada naquele encontro e orientações próprias para o grupo. O importante é saber qual arquivo tem qual função.

## Use nomes que sobrevivam à memória

Experimente nomes como `Equacoes_1grau_Atividade_v01` e `Equacoes_1grau_Gabarito_v01`. Se a data for parte da identificação, um formato como `2026-10-12` facilita ordenar arquivos por nome e acompanhar a sequência dos encontros.

Escolha poucos elementos e repita o padrão. Um nome enorme, cheio de abreviações que só você compreende hoje, pode ser tão difícil de usar quanto “documento novo”. Faça o teste de imaginar o arquivo fora da pasta: ainda seria possível reconhecer seu assunto?

## Crie e mova pastas com atenção

No Drive pelo computador, a opção “Novo” permite criar uma pasta. Para reorganizar um item existente, as opções de organização incluem movê-lo para outra pasta. Você precisa ter as permissões adequadas; dependendo da origem e do destino, um atalho pode ser usado em vez de mover o original.

Antes de reorganizar material compartilhado, verifique quem depende dele e quais permissões estão envolvidas. Uma estrutura limpa não deve tornar um arquivo inacessível para quem precisa trabalhar com você.

## Quando usar um atalho

Um atalho aponta para outro arquivo ou pasta. Ele pode ajudar a localizar um material em mais de um contexto sem criar cópias independentes. Se uma lista-base deve ser encontrada tanto pela pasta do assunto quanto pela de uma turma, um atalho pode ser útil.

Porém, o acesso ao atalho não concede automaticamente acesso ao arquivo original. As permissões do original continuam valendo. Para os detalhes atuais de criação, consulte as [orientações oficiais sobre atalhos](https://support.google.com/drive/answer/9700156?hl=pt-BR).

## Evite misturar a atividade e a resposta

Uma rotina prática é manter versões de distribuição em uma pasta claramente identificada. Antes de compartilhar, abra o arquivo final e confira se ele contém apenas o que o estudante deve receber naquele momento.

O mesmo cuidado vale para documentos com nomes, avaliações ou outras informações de alunos. Não amplie o acesso de uma pasta inteira apenas para entregar uma atividade isolada. Defina o acesso de acordo com o material e com as pessoas que precisam dele.

## Comece pequeno e mantenha uma rotina

Escolha um único assunto para reorganizar hoje. Identifique o arquivo principal, renomeie as versões que ainda importam e mova materiais antigos para uma pasta de arquivo. Não elimine documentos cuja utilidade ou obrigação de conservação você ainda não avaliou.

Depois de cada aula, reserve alguns minutos para guardar a versão utilizada e anotar o que precisa ser melhorado. A organização passa a servir à preparação do próximo encontro, em vez de virar uma grande tarefa acumulada.

Consulte também a [ajuda do Google sobre organização de arquivos](https://support.google.com/drive/answer/2375091?hl=pt-BR). Use as ferramentas para sustentar um critério que você consiga repetir.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('organizar-google-drive','Organize seus materiais de aula no Google Drive','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('0983ee68-7ad3-4c4e-af68-25ac1b169771','porcentagem-cotidiano','Porcentagem no cotidiano: desconto, aumento e a base da comparação','Aprenda a identificar o valor de referência e descubra por que aumentar e descontar 20% não se anulam.','matematica','Uma porcentagem sempre compara uma quantidade com uma base. Dizer apenas “aumentou 20%” deixa uma pergunta: vinte por cento de qual valor? Identificar essa base é o passo mais importante em problemas de descontos, reajustes e comparações.

O símbolo de porcentagem significa “por cento”. Assim, $20\%=\frac{20}{100}=0{,}20$. Calcular 20% de 150 corresponde a multiplicar 150 por 0,20, obtendo 30.

## Comece com porcentagens fáceis de visualizar

Dez por cento de um valor é sua décima parte. Um por cento é sua centésima parte. Cinquenta por cento é metade. Esses pontos de apoio tornam muitas contas mentais simples.

Para calcular 15% de 240, você pode somar 10% e 5%. Dez por cento são 24; cinco por cento são metade disso, ou 12. Portanto, quinze por cento são 36. Outra forma é multiplicar $240\times0{,}15$, chegando ao mesmo resultado.

O objetivo não é escolher um único procedimento para todas as situações. É compreender que métodos diferentes podem representar a mesma relação.

## Desconto: a parte que sai e o valor que fica

Considere um produto de 150 reais com desconto de 20%. O desconto vale 30 reais, mas esse não é o preço final. Precisamos subtrair:

$$
150-150\cdot0{,}20=150\cdot0{,}80=120.
$$

Depois de retirar 20%, permanecem 80% do preço. Por isso, multiplicar diretamente por 0,80 é um caminho eficiente. Para um desconto de 12%, o fator correspondente seria 0,88.

Em uma compra concreta, confira se a porcentagem se aplica ao preço de referência correto e se há outros valores, como frete. Aqui usamos um exemplo didático com um único preço.

## Aumento: somar uma parte ao valor inicial

Se uma quantidade de 200 unidades cresce 15%, o acréscimo é 30 e o novo total é 230. O fator de aumento é $1+0{,}15=1{,}15$:

$$
200\cdot1{,}15=230.
$$

O número 1 representa o total que já existia; 0,15 representa a parte acrescentada. Essa interpretação também ajuda a perceber por que o resultado precisa ser maior que 200.

## Aumentar e depois descontar a mesma taxa

Comece com 100. Um aumento de 20% leva a 120. Agora aplique um desconto de 20% sobre 120. O desconto será 24 e o resultado será 96.

$$
100\cdot1{,}20\cdot0{,}80=96.
$$

As operações não se anulam porque as bases são diferentes. No primeiro passo, a porcentagem foi calculada sobre 100; no segundo, sobre 120. O resultado final ficou 4% abaixo do inicial.

Da mesma forma, dois descontos sucessivos de 10% não equivalem a um desconto de 20%: $0{,}90\cdot0{,}90=0{,}81$. Permanecem 81% do preço original, correspondendo a 19% de desconto total.

## Descobrir a porcentagem de uma mudança

Uma turma passou de 25 para 30 estudantes. O crescimento absoluto foi de 5 estudantes. Em relação ao tamanho inicial, temos:

$$
\frac{30-25}{25}\cdot100\%=20\%.
$$

Observe que usamos 25 no denominador, pois queremos comparar o aumento com o valor inicial. Já uma taxa que passa de 20% para 25% aumenta **5 pontos percentuais**. Seu aumento relativo é de 25%, porque $5/20=0{,}25$. Porcentagem e ponto percentual respondem a perguntas diferentes.

## Faça três verificações

1. Quanto é 8% de 300?
2. Qual é o preço final de um item de 80 reais com 25% de desconto?
3. Uma quantidade passa de 40 para 50. Qual é o aumento percentual?

**Confira:** 24; 60 reais; 25%. Na última questão, a diferença é 10 e a base é 40. Antes de aceitar um resultado, escreva uma frase dizendo qual quantidade representa 100%. Isso evita boa parte das confusões.','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('porcentagem-cotidiano','Porcentagem no cotidiano: desconto, aumento e a base da comparação','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values('2a2591c2-0053-4ef2-a1eb-3433190ddc68','primeiro-documento-latex','Seu primeiro documento em LaTeX, uma linha de cada vez','Um exemplo pequeno e completo para transformar texto e comandos em um PDF organizado.','latex','Começar com LaTeX não exige memorizar uma grande quantidade de comandos. Um objetivo melhor é montar um documento curto, compilar e perceber a função de cada parte. Depois, você amplia esse primeiro arquivo conforme a necessidade.

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

Para aprofundar a linguagem e consultar exemplos, veja a [introdução oficial do Overleaf ao LaTeX](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes). Depois, continue com o artigo sobre [fórmulas matemáticas](/blog/formulas-latex/).','','2026-10-12T12:00:00-03:00','queued',1) on conflict(slug) do nothing;
insert into public.published_posts(slug,title,published_at) values('primeiro-documento-latex','Seu primeiro documento em LaTeX, uma linha de cada vez','2026-10-12T12:00:00-03:00') on conflict(slug) do nothing;
