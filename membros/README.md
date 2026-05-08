# Cafemática — Área de Membros MVP

Esta é uma primeira versão funcional da área de membros do Cafemática, pensada para ficar separada da página principal atual.

## O que já vem implementado

- Login e logout.
- Senhas com hash seguro.
- Proteção CSRF simples nos formulários.
- Banco SQLite em `instance/cafematica.db`.
- Página do aluno com cursos comprados.
- Controle de acesso por matrícula e data de expiração.
- Aviso discreto de renovação no último mês, com opção de fechar por um dia.
- Botão “continuar de onde parei”, salvando a última aula realmente acessada.
- Cadastro de alunos, categorias, cursos, aulas e e-books pelo admin.
- Matrícula manual de alunos em cursos.
- Recomendações de cursos por categoria, sem recomendar curso já comprado.
- Comentários em aulas com respostas encadeadas e curtidas.
- Avaliação de aulas com até 5 estrelas.
- Tickets de suporte com conversa entre aluno e administrador.
- FAQ com botão para abrir ticket.
- E-book personalizado com nome e CPF em todas as páginas, alternando posições discretas.
- Painel admin com filtros por curso e vencimento.

## Como rodar no Windows

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python seed.py
python app.py
```

Depois acesse:

```text
http://127.0.0.1:5000
```

## Login inicial

Administrador:

```text
admin@cafematica.com.br
Senha: Admin@12345
```

Aluno de teste:

```text
aluno@exemplo.com
Senha: Aluno@12345
```

Troque essas senhas antes de usar com dados reais.

## Como integrar ao site atual

Sua página principal pode continuar exatamente como está. Basta adicionar um botão apontando para a área de login:

```html
<a href="/login" class="botao-login">Área de membros</a>
```

## Importante

GitHub Pages sozinho não roda Flask nem SQLite em produção. O GitHub serve para versionar o código. Para colocar no ar, você precisa de hospedagem com suporte a Python/Flask.

Para produção real: use HTTPS, backup automático do banco, uma `SECRET_KEY` forte, senhas fortes, permissões corretas nos arquivos e hospedagem confiável.

Sobre vídeos do YouTube: o embed dificulta, mas não impede totalmente que um usuário avançado descubra a URL. Para proteção forte de vídeo, o caminho correto é usar plataforma de vídeo com DRM.
