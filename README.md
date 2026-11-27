# YAP Soluções · Landing page

Landing page estática (HTML, CSS e JavaScript, sem build) de pintura predial e impermeabilização da YAP Soluções.

- `index.html`: versão principal, com as fotos reais da YAP, o GTM-TNHPX6W4 e os dados estruturados (empresa, site, página e FAQ).
- `ia/index.html`: versão alternativa com as imagens geradas por IA, sem GTM e fora dos buscadores (`noindex`). Não vai para o servidor de produção.
- `assets/css/style.css`: estilos (mobile first, tokens do YAP Design System). Telas a partir de 1800 px ampliam o `.wrap` com `zoom`.
- `assets/js/main.js`: menu, revelação na rolagem, FAQ, botão flutuante e evento `whatsapp_click` no `dataLayer`.
- `assets/img/`, `assets/fonts/`: imagens otimizadas (WebP com JPEG de reserva) e fontes WOFF2 locais.
- `robots.txt`, `sitemap.xml`, `llms.txt` e `llm.txt` (mesmo conteúdo), `favicon.ico`: arquivos de descoberta na raiz do subdomínio.
- `.htaccess`: HTTPS, CSP e demais cabeçalhos de segurança, cache e compressão. É a única fonte da CSP.
- `tools/atualizar-csp.py`: recalcula os hashes da CSP. Não vai para o servidor.

## Regras de manutenção

- **CSP:** depois de mudar o script do GTM ou o bloco `<style>` do `<head>`, rode `python3 tools/atualizar-csp.py` (ou `--check` para só conferir). Não use atributo `style=""` no HTML: crie uma classe no bloco `<style>`.
- **Cache:** CSS e JS ficam um ano em cache, então suba o `?v=` ao alterá-los. Imagens e fontes também ficam um ano: ao trocar uma imagem, use um nome de arquivo novo.
- **Integrações:** a CSP libera GTM (inclusive o modo de visualização), GA4, Google Ads (conversão, remarketing e dados fornecidos pelo usuário), Floodlight e YouTube (`youtube-nocookie.com`). Tags de HTML personalizado e variáveis de JavaScript personalizado do GTM não rodam com essa CSP; prefira modelos do GTM. Não há webhook hoje; ao criar um formulário, acrescente a origem HTTPS do endpoint em `connect-src`.

## Publicação

Publicação no `https://servicos.yapsolucoes.com.br/` pelo Git Version Control do cPanel. O repositório é clonado em `/home1/yapnet60/repositories/yap-solucoes`; o `.cpanel.yml` copia a página principal, `.htaccess`, os arquivos de descoberta e `assets/` para a raiz do subdomínio. Após cada push, use **Update from Remote** e **Deploy HEAD Commit** no cPanel.
