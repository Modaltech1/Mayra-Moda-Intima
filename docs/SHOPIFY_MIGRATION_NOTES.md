# Notas de migração para Shopify

Este projeto foi feito para validação local. Para Shopify, o caminho mais limpo é criar um tema baseado no Dawn ou em um tema premium e portar os blocos visuais como sections.

## Mapeamento sugerido

| Bloco local | Shopify section sugerida | Observação |
|---|---|---|
| `.hero` | `sections/hero-video.liquid` | usar settings para vídeo desktop/mobile e posters |
| `.category-grid` | `sections/featured-collections-mayra.liquid` | puxar coleções reais |
| `.product-grid` | `sections/featured-products-mayra.liquid` | puxar produtos reais |
| `.editorial.two-col` | `sections/editorial-banner-mayra.liquid` | imagem + título + CTA |
| `.benefits` | `sections/benefits-grid.liquid` | ícones e textos editáveis |
| `.video-stories` | `sections/video-stories.liquid` | vídeos verticais editáveis |
| `.reviews-strip` | app ou section custom | ideal usar app de reviews depois |

## Dados

- `src/data/products.js` é apenas mock.
- Preço, estoque e variantes devem vir do Shopify.
- O carrinho local deve ser removido ao migrar.

## Assets

Veja `docs/asset-manifest.json` e o README principal.
