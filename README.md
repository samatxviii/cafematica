# Cafemática — site separado em arquivos

Arquivos principais:

- `index.html`: página principal, SEO, Open Graph e chamada dos arquivos externos.
- `menu.html`: menu superior.
- `conteudo.html`: corpo principal da página.
- `rodape.html`: rodapé.
- `estilos.css`: estilos visuais do site.
- `scripts.js`: carregamento das partes, menu mobile e animações.

Observação: por usar `fetch()` para carregar `menu.html`, `conteudo.html` e `rodape.html`, esta versão deve ser testada em um servidor/local host ou publicada no GitHub Pages/hospedagem. Ao abrir diretamente pelo arquivo no celular ou no computador, alguns navegadores podem bloquear o carregamento dos arquivos separados.
