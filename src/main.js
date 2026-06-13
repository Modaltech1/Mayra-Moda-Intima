import { products, categories } from './data/products.js';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const CART_KEY = 'mayra-local-cart-v1';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const setCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartEverywhere();
};
const productById = (id) => products.find((product) => product.id === id);

const icons = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5h14l-1 12H6l-1-12Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>'
};

function productUrl(id) {
  return `/products/product.html?id=${encodeURIComponent(id)}`;
}

function collectionMeta(slug) {
  return categories.find((category) => category.slug === slug) || {
    name: 'Todos os produtos',
    description: 'Conheça a seleção completa Mayra.'
  };
}

function buildShell() {
  const announcement = $('.announcement');
  if (announcement) {
    announcement.innerHTML = '<span>←</span><strong>Frete grátis acima de R$ 299</strong><span>→</span>';
  }

  const header = $('[data-header]');
  if (header) {
    header.innerHTML = `
      <button class="icon-btn menu-toggle" aria-label="Abrir menu" data-menu-toggle>${icons.menu}</button>
      <a class="brand" href="/" aria-label="Mayra Moda Íntima">
        <img src="/assets/logo/logo-mayra.svg" alt="Mayra Moda Íntima" />
      </a>
      <nav class="main-nav" aria-label="Navegação principal">
        <a href="/collections/all.html">Todos os produtos</a>
        <a href="/collections/sutias.html">Sutiãs</a>
        <a href="/collections/calcinhas.html">Calcinhas</a>
        <a href="/collections/acessorios.html">Adesivos</a>
        <a href="/collections/conjuntos.html">Conjuntos</a>
        <a href="/collections/kits.html">Monte seu kit</a>
        <a href="/pages/sobre.html">Sobre a Mayra</a>
      </nav>
      <div class="header-actions">
        <button class="icon-btn" type="button" aria-label="Buscar" data-search-toggle>${icons.search}</button>
        <a class="icon-btn account-link" href="/pages/sobre.html" aria-label="Minha conta">${icons.user}</a>
        <button class="icon-btn bag-link" type="button" aria-label="Abrir sacola" data-cart-open>
          ${icons.bag}<span data-cart-count>0</span>
        </button>
      </div>`;
  }

  const mobileMenu = $('[data-mobile-menu]');
  if (mobileMenu) {
    mobileMenu.innerHTML = `
      <button class="icon-btn close" data-menu-toggle aria-label="Fechar menu">${icons.close}</button>
      <a class="brand side" href="/"><img src="/assets/logo/logo-mayra.svg" alt="Mayra" /></a>
      <a href="/collections/all.html">Todos os produtos</a>
      <a href="/collections/sutias.html">Sutiãs</a>
      <a href="/collections/calcinhas.html">Calcinhas</a>
      <a href="/collections/acessorios.html">Adesivos e acessórios</a>
      <a href="/collections/conjuntos.html">Conjuntos</a>
      <a href="/collections/kits.html">Monte seu kit</a>
      <a href="/pages/sobre.html">Sobre a Mayra</a>
      <a href="/pages/perguntas-frequentes.html">Perguntas frequentes</a>`;
  }

  const searchPanel = $('[data-search-panel]');
  if (searchPanel) {
    searchPanel.innerHTML = `
      <button class="icon-btn close" data-search-toggle aria-label="Fechar busca">${icons.close}</button>
      <span class="eyebrow">Encontre sua peça</span>
      <label for="siteSearch">O que você está buscando?</label>
      <div class="search-field">${icons.search}<input id="siteSearch" data-search-input type="search" placeholder="Sutiã, calcinha, fita..." /></div>
      <div class="search-results" data-search-results></div>`;
  }

  const newsletter = $('.newsletter');
  if (newsletter) {
    newsletter.innerHTML = `
      <div>
        <span class="eyebrow">Fique por dentro</span>
        <h2>Novidades e ofertas no seu e-mail.</h2>
        <p>Cadastre-se para receber lançamentos, dicas e condições especiais.</p>
      </div>
      <form data-newsletter-form>
        <input type="email" placeholder="Digite seu e-mail" aria-label="E-mail" required />
        <button class="btn primary">Quero receber</button>
      </form>`;
  }

  const footer = $('.site-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="footer-logo">
        <img src="/assets/logo/logo-mayra.svg" alt="Mayra Moda Íntima" />
        <p>Conforto e liberdade para você se vestir do seu jeito.</p>
      </div>
      <div><h3>Comprar</h3><a href="/collections/all.html">Todos os produtos</a><a href="/collections/sutias.html">Sutiãs</a><a href="/collections/calcinhas.html">Calcinhas</a><a href="/collections/kits.html">Kits</a></div>
      <div><h3>Institucional</h3><a href="/pages/sobre.html">Sobre a Mayra</a><a href="/pages/avaliacoes.html">Avaliações</a><a href="/blog/index.html">Conteúdo</a><a href="/pages/guia-de-tamanhos.html">Guia de tamanhos</a></div>
      <div><h3>Ajuda</h3><a href="/pages/perguntas-frequentes.html">Perguntas frequentes</a><a href="/cart.html">Minha sacola</a><a href="/pages/perguntas-frequentes.html">Trocas e devoluções</a><p>Atendimento de segunda a sexta.</p></div>
      <div class="footer-bottom"><span>© 2026 Mayra Moda Íntima</span><span>Compra segura • Pix • Cartão</span></div>`;
  }

  if (!$('.whatsapp-float')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<a class="whatsapp-float" href="#" aria-label="Falar com a Mayra no WhatsApp"><span>◔</span></a>'
    );
  }
}

function ratingMarkup(product) {
  return `<div class="rating" aria-label="${product.rating} de 5 estrelas">
    <span>★★★★★</span><small>${product.reviews} avaliações</small>
  </div>`;
}

function card(product) {
  const secondaryImage = product.gallery?.[1];
  return `<article class="product-card">
    <a class="product-card__media" href="${productUrl(product.id)}">
      <img class="primary-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      ${secondaryImage ? `<img class="secondary-image" src="${secondaryImage}" alt="" loading="lazy" />` : ''}
      ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
    </a>
    <div class="product-card__body">
      <a href="${productUrl(product.id)}"><h3>${product.name}</h3></a>
      <div class="price">
        <strong>${BRL.format(product.price)}</strong>
        ${product.compareAt ? `<s>${BRL.format(product.compareAt)}</s>` : ''}
      </div>
      ${ratingMarkup(product)}
      <button class="btn product-add" data-add-cart="${product.id}">Adicionar</button>
    </div>
  </article>`;
}

function renderProducts(root, list) {
  root.innerHTML = list.length
    ? list.map(card).join('')
    : '<div class="empty-state">Nenhum produto encontrado.</div>';
}

function initProductBlocks() {
  $$('[data-products]').forEach((root) => {
    const limit = Number(root.dataset.limit || products.length);
    const list = root.dataset.products === 'featured'
      ? products.filter((product) => product.featured).slice(0, limit)
      : products.slice(0, limit);
    renderProducts(root, list);
  });
}

function initCategoryGrid() {
  const root = $('[data-category-grid]');
  if (!root) return;
  root.innerHTML = categories.map((category) => `
    <a class="category-card" href="/collections/${category.slug}.html">
      <img src="${category.image}" alt="${category.name}" loading="lazy" />
      <div><h3>${category.name}</h3><p>${category.description}</p></div>
    </a>`).join('');
}

function initCollections() {
  const root = $('[data-collection]');
  if (!root) return;
  const slug = root.dataset.collection;
  const meta = collectionMeta(slug);
  const title = $('[data-collection-title]');
  const description = $('[data-collection-description]');
  if (title) title.textContent = meta.name;
  if (description) description.textContent = meta.description;

  const source = slug === 'all' ? [...products] : products.filter((product) => product.category === slug);
  const search = $('[data-page-search]');
  const sort = $('[data-sort]');

  function apply() {
    let list = [...source];
    const query = (search?.value || '').toLowerCase().trim();
    if (query) {
      list = list.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(query));
    }
    if (sort?.value === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort?.value === 'price-desc') list.sort((a, b) => b.price - a.price);
    renderProducts(root, list);
  }

  search?.addEventListener('input', apply);
  sort?.addEventListener('change', apply);
  apply();
}

function initProductPage() {
  const page = $('[data-product-page]');
  if (!page) return;
  const id = new URL(location.href).searchParams.get('id') || products[0].id;
  const product = productById(id) || products[0];
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const category = collectionMeta(product.category);
  const colorValues = {
    Baunilha: '#e5c8ad',
    Caramelo: '#a86f52',
    Preto: '#171313',
    'Rosé': '#e9aeb5',
    Bege: '#d3ad86',
    Nude: '#c99478',
    'Off white': '#f2efe8'
  };

  document.title = `${product.name} | Mayra Moda Íntima`;
  page.innerHTML = `
    <div class="product-layout">
      <section class="product-gallery" aria-label="Galeria de ${product.name}">
        <div class="product-gallery__viewport" data-gallery-viewport>
          <div class="product-gallery__track">
            ${gallery.map((src, index) => `
              <figure class="product-gallery__slide" data-gallery-slide="${index}">
                <img
                  src="${src}"
                  alt="${product.name} - foto ${index + 1} de ${gallery.length}"
                  ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
                  draggable="false"
                />
              </figure>`).join('')}
          </div>
          <button class="gallery-control gallery-control--previous" type="button" data-gallery-previous aria-label="Foto anterior">‹</button>
          <button class="gallery-control gallery-control--next" type="button" data-gallery-next aria-label="Próxima foto">›</button>
          <button class="gallery-zoom" type="button" data-gallery-open aria-label="Abrir foto em tela cheia">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5M10.5 8v5M8 10.5h5"/></svg>
          </button>
          <span class="gallery-counter" data-gallery-counter>1 / ${gallery.length}</span>
        </div>
        <div class="product-gallery__thumbnails" data-gallery-thumbnails aria-label="Escolher foto">
          ${gallery.map((src, index) => `
            <button class="gallery-thumbnail ${index === 0 ? 'is-active' : ''}" type="button" data-gallery-thumbnail="${index}" aria-label="Ver foto ${index + 1}">
              <img src="${src}" alt="" draggable="false" />
            </button>`).join('')}
        </div>
        <p class="gallery-hint">Arraste para o lado ou toque na foto para ampliar.</p>
      </section>

      <aside class="product-info">
        <span class="eyebrow">Mayra · ${category.name}</span>
        <h1>${product.name}</h1>
        ${ratingMarkup(product)}
        <div class="price product-price">
          <strong>${BRL.format(product.price)}</strong>
          ${product.compareAt ? `<s>${BRL.format(product.compareAt)}</s>` : ''}
        </div>
        <p class="installments">ou 3x de ${BRL.format(product.price / 3)} sem juros</p>

        <div class="variant-group">
          <div class="variant-label"><strong>Cor:</strong> <span data-selected-color>${product.colors[0]}</span></div>
          <div class="swatch-row">
            ${product.colors.map((color, index) => `
              <button
                class="color-swatch ${index === 0 ? 'is-active' : ''}"
                type="button"
                data-color="${color}"
                aria-label="${color}"
                aria-pressed="${index === 0}"
                title="${color}"
              ><span style="--swatch-color: ${colorValues[color] || '#d7b39b'}"></span></button>`).join('')}
          </div>
        </div>

        <div class="variant-group">
          <div class="variant-label"><strong>Tamanho:</strong> <span data-selected-size>${product.sizes[0]}</span></div>
          <div class="pill-row" data-size-options>
            ${product.sizes.map((size, index) => `<button class="${index === 0 ? 'is-active' : ''}" type="button" data-size="${size}" aria-pressed="${index === 0}">${size}</button>`).join('')}
          </div>
        </div>

        <div class="variant-group kit-options">
          <div class="variant-label"><strong>Escolha o kit</strong> <span>(leve mais, pague menos)</span></div>
          <div class="pill-row" data-kit-options>
            <button class="is-active" type="button" aria-pressed="true">1 peça</button>
            <button type="button" aria-pressed="false">2 peças: mesma cor</button>
            <button type="button" aria-pressed="false">2 peças: cores diferentes</button>
          </div>
        </div>

        <button class="btn primary full product-buy" data-add-cart="${product.id}">Comprar agora</button>
        <div class="product-service">
          <p><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg><strong>Frete grátis</strong> acima de R$ 299</p>
          <a href="/pages/guia-de-tamanhos.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 11-11 5 5-11 11H4v-5Z"/><path d="m13 6 5 5M7 15l2 2M10 12l2 2"/></svg> Guia de tamanhos</a>
        </div>

        <div class="product-description">
          <p>${product.description}</p>
          <ul>${product.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
        </div>
        <div class="product-details">
          <details open>
            <summary>Detalhes do produto</summary>
            <p>Modelagem pensada para acompanhar o corpo com conforto, segurança e acabamento discreto sob a roupa.</p>
          </details>
          <details>
            <summary>Cuidados e conservação</summary>
            <p>Lave à mão com sabão neutro, seque naturalmente e guarde em local protegido.</p>
          </details>
          <details>
            <summary>Entrega e trocas</summary>
            <p>Envio calculado no carrinho e primeira troca facilitada em até 7 dias após o recebimento.</p>
          </details>
        </div>
      </aside>
    </div>

    <div class="product-lightbox" data-product-lightbox role="dialog" aria-modal="true" aria-label="Visualizador de fotos" aria-hidden="true">
      <button class="lightbox-close" type="button" data-lightbox-close aria-label="Fechar visualizador">${icons.close}</button>
      <button class="lightbox-arrow lightbox-arrow--previous" type="button" data-lightbox-previous aria-label="Foto anterior">‹</button>
      <div class="lightbox-stage" data-lightbox-stage>
        <img data-lightbox-image src="${gallery[0]}" alt="${product.name}" draggable="false" />
      </div>
      <button class="lightbox-arrow lightbox-arrow--next" type="button" data-lightbox-next aria-label="Próxima foto">›</button>
      <div class="lightbox-toolbar">
        <button type="button" data-lightbox-zoom-out aria-label="Diminuir zoom">−</button>
        <button type="button" data-lightbox-reset aria-label="Redefinir zoom"><span data-lightbox-zoom>100%</span></button>
        <button type="button" data-lightbox-zoom-in aria-label="Aumentar zoom">+</button>
        <span data-lightbox-counter>1 / ${gallery.length}</span>
      </div>
    </div>`;

  const viewport = $('[data-gallery-viewport]', page);
  const thumbnails = $$('[data-gallery-thumbnail]', page);
  const thumbnailStrip = $('[data-gallery-thumbnails]', page);
  const galleryCounter = $('[data-gallery-counter]', page);
  const lightbox = $('[data-product-lightbox]', page);
  const lightboxImage = $('[data-lightbox-image]', lightbox);
  const lightboxCounter = $('[data-lightbox-counter]', lightbox);
  const lightboxZoom = $('[data-lightbox-zoom]', lightbox);
  const lightboxStage = $('[data-lightbox-stage]', lightbox);
  let galleryIndex = 0;
  let lightboxIndex = 0;
  let draggedGallery = false;
  let scrollFrame = 0;
  let zoom = 1;
  let imageX = 0;
  let imageY = 0;
  let imageDrag = null;
  let previousFocus = null;

  function normalizeIndex(index) {
    return (index + gallery.length) % gallery.length;
  }

  function updateGallery(index) {
    galleryIndex = normalizeIndex(index);
    thumbnails.forEach((thumbnail, itemIndex) => {
      const active = itemIndex === galleryIndex;
      thumbnail.classList.toggle('is-active', active);
      thumbnail.setAttribute('aria-current', active ? 'true' : 'false');
    });
    galleryCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
    const activeThumbnail = thumbnails[galleryIndex];
    const targetLeft = activeThumbnail.offsetLeft - (thumbnailStrip.clientWidth - activeThumbnail.offsetWidth) / 2;
    thumbnailStrip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }

  function goToGallery(index, behavior = 'smooth') {
    const nextIndex = normalizeIndex(index);
    viewport.scrollTo({ left: nextIndex * viewport.clientWidth, behavior });
    updateGallery(nextIndex);
  }

  function renderZoom() {
    lightboxImage.style.transform = `translate3d(${imageX}px, ${imageY}px, 0) scale(${zoom})`;
    lightboxImage.classList.toggle('is-zoomed', zoom > 1);
    lightboxZoom.textContent = `${Math.round(zoom * 100)}%`;
  }

  function resetZoom() {
    zoom = 1;
    imageX = 0;
    imageY = 0;
    renderZoom();
  }

  function setLightboxImage(index) {
    lightboxIndex = normalizeIndex(index);
    lightboxImage.src = gallery[lightboxIndex];
    lightboxImage.alt = `${product.name} - foto ${lightboxIndex + 1} de ${gallery.length}`;
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${gallery.length}`;
    resetZoom();
    const nextImage = new Image();
    nextImage.src = gallery[normalizeIndex(lightboxIndex + 1)];
  }

  function openLightbox(index = galleryIndex) {
    previousFocus = document.activeElement;
    setLightboxImage(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    $('[data-lightbox-close]', lightbox)?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    resetZoom();
    previousFocus?.focus?.();
  }

  function zoomBy(amount) {
    zoom = Math.min(4, Math.max(1, zoom + amount));
    if (zoom === 1) {
      imageX = 0;
      imageY = 0;
    }
    renderZoom();
  }

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => goToGallery(Number(thumbnail.dataset.galleryThumbnail)));
  });

  $('[data-gallery-previous]', page)?.addEventListener('click', () => goToGallery(galleryIndex - 1));
  $('[data-gallery-next]', page)?.addEventListener('click', () => goToGallery(galleryIndex + 1));
  $('[data-gallery-open]', page)?.addEventListener('click', () => openLightbox(galleryIndex));

  $$('[data-gallery-slide]', page).forEach((slide) => {
    slide.addEventListener('click', () => {
      if (!draggedGallery) openLightbox(Number(slide.dataset.gallerySlide));
    });
  });

  viewport.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      updateGallery(Math.round(viewport.scrollLeft / Math.max(viewport.clientWidth, 1)));
    });
  }, { passive: true });

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    draggedGallery = false;
    viewport.dataset.dragStart = String(event.clientX);
    viewport.dataset.scrollStart = String(viewport.scrollLeft);
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!viewport.hasPointerCapture(event.pointerId)) return;
    const distance = event.clientX - Number(viewport.dataset.dragStart);
    if (Math.abs(distance) > 6) draggedGallery = true;
    viewport.scrollLeft = Number(viewport.dataset.scrollStart) - distance;
  });

  function finishGalleryDrag(event) {
    if (!viewport.hasPointerCapture(event.pointerId)) return;
    viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove('is-dragging');
    goToGallery(Math.round(viewport.scrollLeft / Math.max(viewport.clientWidth, 1)));
    window.setTimeout(() => { draggedGallery = false; }, 0);
  }

  viewport.addEventListener('pointerup', finishGalleryDrag);
  viewport.addEventListener('pointercancel', finishGalleryDrag);

  $$('[data-size-options] button', page).forEach((button) => {
    button.addEventListener('click', () => {
      $$('[data-size-options] button', page).forEach((item) => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });
      $('[data-selected-size]', page).textContent = button.dataset.size;
    });
  });

  $$('.color-swatch', page).forEach((button) => {
    button.addEventListener('click', () => {
      $$('.color-swatch', page).forEach((item) => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });
      $('[data-selected-color]', page).textContent = button.dataset.color;
    });
  });

  $$('[data-kit-options] button', page).forEach((button) => {
    button.addEventListener('click', () => {
      $$('[data-kit-options] button', page).forEach((item) => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });
    });
  });

  $('[data-lightbox-close]', lightbox)?.addEventListener('click', closeLightbox);
  $('[data-lightbox-previous]', lightbox)?.addEventListener('click', () => setLightboxImage(lightboxIndex - 1));
  $('[data-lightbox-next]', lightbox)?.addEventListener('click', () => setLightboxImage(lightboxIndex + 1));
  $('[data-lightbox-zoom-in]', lightbox)?.addEventListener('click', () => zoomBy(.5));
  $('[data-lightbox-zoom-out]', lightbox)?.addEventListener('click', () => zoomBy(-.5));
  $('[data-lightbox-reset]', lightbox)?.addEventListener('click', resetZoom);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightboxStage.addEventListener('wheel', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? .25 : -.25);
  }, { passive: false });

  lightboxStage.addEventListener('dblclick', () => {
    zoom = zoom > 1 ? 1 : 2.25;
    imageX = 0;
    imageY = 0;
    renderZoom();
  });

  lightboxStage.addEventListener('pointerdown', (event) => {
    if (zoom <= 1 || event.button !== 0) return;
    imageDrag = { x: event.clientX, y: event.clientY, imageX, imageY };
    lightboxStage.setPointerCapture(event.pointerId);
    lightboxStage.classList.add('is-panning');
  });

  lightboxStage.addEventListener('pointermove', (event) => {
    if (!imageDrag || !lightboxStage.hasPointerCapture(event.pointerId)) return;
    imageX = imageDrag.imageX + event.clientX - imageDrag.x;
    imageY = imageDrag.imageY + event.clientY - imageDrag.y;
    renderZoom();
  });

  function finishImageDrag(event) {
    if (!lightboxStage.hasPointerCapture(event.pointerId)) return;
    lightboxStage.releasePointerCapture(event.pointerId);
    lightboxStage.classList.remove('is-panning');
    imageDrag = null;
  }

  lightboxStage.addEventListener('pointerup', finishImageDrag);
  lightboxStage.addEventListener('pointercancel', finishImageDrag);

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') setLightboxImage(lightboxIndex - 1);
    if (event.key === 'ArrowRight') setLightboxImage(lightboxIndex + 1);
    if (event.key === '+' || event.key === '=') zoomBy(.5);
    if (event.key === '-') zoomBy(-.5);
  });

  window.addEventListener('resize', () => goToGallery(galleryIndex, 'auto'));
}

function addToCart(id, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += quantity;
  else cart.push({ id, qty: quantity });
  setCart(cart);
  openCart();
}

function updateQty(id, delta) {
  const cart = getCart()
    .map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
    .filter((item) => item.qty > 0);
  setCart(cart);
}

function removeItem(id) {
  setCart(getCart().filter((item) => item.id !== id));
}

function cartRows() {
  const cart = getCart();
  if (!cart.length) return '<div class="empty-state">Sua sacola está vazia.</div>';
  return cart.map((item) => {
    const product = productById(item.id);
    if (!product) return '';
    return `<div class="cart-item">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <strong>${product.name}</strong>
        <div class="muted">${BRL.format(product.price)}</div>
        <div class="qty-controls">
          <button data-qty-minus="${product.id}" aria-label="Diminuir quantidade">−</button>
          <span>${item.qty}</span>
          <button data-qty-plus="${product.id}" aria-label="Aumentar quantidade">+</button>
          <button class="remove-btn" data-remove="${product.id}">Remover</button>
        </div>
      </div>
      <strong>${BRL.format(product.price * item.qty)}</strong>
    </div>`;
  }).join('');
}

function cartTotal() {
  return getCart().reduce((sum, item) => sum + (productById(item.id)?.price || 0) * item.qty, 0);
}

function renderCartEverywhere() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  $$('[data-cart-count]').forEach((element) => { element.textContent = count; });
  $$('[data-cart-total]').forEach((element) => { element.textContent = BRL.format(cartTotal()); });
  $$('[data-cart-drawer-items], [data-cart-page-items]').forEach((element) => { element.innerHTML = cartRows(); });
}

function openCart() {
  const drawer = $('[data-cart-drawer]');
  drawer?.classList.add('is-open');
  drawer?.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  const drawer = $('[data-cart-drawer]');
  drawer?.classList.remove('is-open');
  drawer?.setAttribute('aria-hidden', 'true');
}

function showToast(message) {
  let toast = $('.site-toast');
  if (!toast) {
    document.body.insertAdjacentHTML('beforeend', '<div class="site-toast" role="status"></div>');
    toast = $('.site-toast');
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function initDelegation() {
  document.addEventListener('click', (event) => {
    const add = event.target.closest('[data-add-cart]');
    if (add) {
      event.preventDefault();
      addToCart(add.dataset.addCart);
    }
    const plus = event.target.closest('[data-qty-plus]');
    if (plus) updateQty(plus.dataset.qtyPlus, 1);
    const minus = event.target.closest('[data-qty-minus]');
    if (minus) updateQty(minus.dataset.qtyMinus, -1);
    const remove = event.target.closest('[data-remove]');
    if (remove) removeItem(remove.dataset.remove);
    if (event.target.closest('[data-cart-open]')) openCart();
    if (event.target.closest('[data-cart-close]')) closeCart();
    if (event.target.closest('[data-clear-cart]')) setCart([]);
    if (event.target.closest('[data-checkout-notice]')) {
      showToast('O pagamento será conectado na publicação da loja.');
    }
    if (event.target.matches('.cart-drawer')) closeCart();
  });
}

function initPanels() {
  $$('[data-menu-toggle]').forEach((button) => {
    button.addEventListener('click', () => $('[data-mobile-menu]')?.classList.toggle('is-open'));
  });
  $$('[data-search-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = $('[data-search-panel]');
      panel?.classList.toggle('is-open');
      if (panel?.classList.contains('is-open')) setTimeout(() => $('[data-search-input]')?.focus(), 150);
    });
  });

  const input = $('[data-search-input]');
  const results = $('[data-search-results]');
  input?.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    const list = query
      ? products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query)).slice(0, 6)
      : [];
    results.innerHTML = list.map((product) => `
      <a class="search-result" href="${productUrl(product.id)}">
        <img src="${product.image}" alt="${product.name}" />
        <div><strong>${product.name}</strong><span>${BRL.format(product.price)}</span></div>
      </a>`).join('') || (query ? '<p class="muted">Nenhum resultado encontrado.</p>' : '');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    $('[data-mobile-menu]')?.classList.remove('is-open');
    $('[data-search-panel]')?.classList.remove('is-open');
    closeCart();
  });
}

function initStories() {
  const videos = $$('.story-card video');
  if (!videos.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.play().catch(() => {});
      else entry.target.pause();
    });
  }, { threshold: 0.45 });
  videos.forEach((video) => observer.observe(video));
}

function initNewsletter() {
  $('[data-newsletter-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = $('button', event.currentTarget);
    button.textContent = 'Cadastrado';
    button.disabled = true;
  });
}

function boot() {
  buildShell();
  initCategoryGrid();
  initProductBlocks();
  initCollections();
  initProductPage();
  initDelegation();
  initPanels();
  initStories();
  initNewsletter();
  renderCartEverywhere();
}

boot();
