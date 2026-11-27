# YAP Soluções · Landing page

Landing page estática (HTML, CSS e JavaScript, sem build) de pintura predial e impermeabilização da YAP Soluções.

- `index.html`: versão principal, com as fotos reais da YAP e o GTM-TNHPX6W4.
- `ia/index.html`: versão alternativa com as imagens geradas por IA, sem GTM e fora dos buscadores (`noindex`).
- `assets/css/style.css`: estilos (mobile first, tokens do YAP Design System).
- `assets/js/main.js`: menu, revelação na rolagem, FAQ, botão flutuante e evento `whatsapp_click` no `dataLayer`.
- `assets/img/`, `assets/fonts/`: imagens otimizadas (WebP com JPEG de reserva) e fontes WOFF2 locais.

Publicação no `https://servicos.yapsolucoes.com.br/` pelo Git Version Control do cPanel. O repositório é clonado em `/home1/yapnet60/repositories/yap-solucoes`; o `.cpanel.yml` copia a página principal e `assets/` para a raiz do subdomínio. Após cada push, use **Update from Remote** e **Deploy HEAD Commit** no cPanel.
