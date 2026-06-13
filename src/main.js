
import { products, categories } from './data/products.js';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const CART_KEY = 'mayra-local-cart-v1';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const setCart = (cart) => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartEverywhere(); };
const productById = (id) => products.find((p) => p.id === id);

function productUrl(id){ return `/products/product.html?id=${encodeURIComponent(id)}`; }
function collectionMeta(slug){ return categories.find(c => c.slug === slug) || { name:'Todos os produtos', description:'Catálogo completo Mayra.' }; }
function card(product){
  return `<article class="product-card">
    <a class="product-card__media" href="${productUrl(product.id)}">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
    </a>
    <div class="product-card__body">
      <a href="${productUrl(product.id)}"><h3>${product.name}</h3></a>
      <div class="price"><strong>${BRL.format(product.price)}</strong>${product.compareAt ? `<s>${BRL.format(product.compareAt)}</s>` : ''}</div>
      <div class="swatches">${product.colors.map(c => `<span>${c}</span>`).join('')}</div>
      <button class="btn secondary" data-add-cart="${product.id}">Adicionar</button>
    </div>
  </article>`;
}
function renderProducts(root, list){ root.innerHTML = list.length ? list.map(card).join('') : `<div class="empty-state">Nenhum produto encontrado.</div>`; }
function initProductBlocks(){
  $$('[data-products]').forEach(root => {
    const limit = Number(root.dataset.limit || products.length);
    const mode = root.dataset.products;
    const list = mode === 'featured' ? products.filter(p => ['Novo','Mais vendido','Premium','Oferta','Kit'].includes(p.badge)).slice(0, limit) : products.slice(0, limit);
    renderProducts(root, list);
  });
}
function initCategoryGrid(){
  const root = $('[data-category-grid]');
  if(!root) return;
  root.innerHTML = categories.map(c => `<a class="category-card" href="/collections/${c.slug}.html"><img src="${c.image}" alt="${c.name}" loading="lazy" /><div><h3>${c.name}</h3><p>${c.description}</p></div></a>`).join('');
}
function initCollections(){
  const root = $('[data-collection]');
  if(!root) return;
  const slug = root.dataset.collection;
  const meta = collectionMeta(slug);
  const title = $('[data-collection-title]');
  const desc = $('[data-collection-description]');
  if(title) title.textContent = meta.name;
  if(desc) desc.textContent = meta.description || 'Catálogo Mayra.';
  let current = slug === 'all' ? [...products] : products.filter(p => p.category === slug);
  const search = $('[data-page-search]');
  const sort = $('[data-sort]');
  function apply(){
    let list = [...current];
    const q = (search?.value || '').toLowerCase().trim();
    if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const s = sort?.value;
    if(s === 'price-asc') list.sort((a,b) => a.price - b.price);
    if(s === 'price-desc') list.sort((a,b) => b.price - a.price);
    renderProducts(root, list);
  }
  search?.addEventListener('input', apply);
  sort?.addEventListener('change', apply);
  apply();
}
function initProductPage(){
  const page = $('[data-product-page]');
  if(!page) return;
  const id = new URL(location.href).searchParams.get('id') || products[0].id;
  const p = productById(id) || products[0];
  document.title = `${p.name} | Mayra Moda Íntima`;
  $('[data-product-gallery]').innerHTML = p.gallery.map(src => `<img src="${src}" alt="${p.name}" />`).join('');
  $('[data-product-info]').innerHTML = `<span class="eyebrow">${p.category}</span><h1>${p.name}</h1><div class="price"><strong>${BRL.format(p.price)}</strong>${p.compareAt ? `<s>${BRL.format(p.compareAt)}</s>` : ''}</div><p>${p.description}</p><div class="variant-group"><label>Cor</label><div class="pill-row" data-variant-colors>${p.colors.map((c,i)=>`<button class="${i===0?'is-active':''}" type="button">${c}</button>`).join('')}</div></div><div class="variant-group"><label>Tamanho</label><div class="pill-row" data-variant-sizes>${p.sizes.map((s,i)=>`<button class="${i===0?'is-active':''}" type="button">${s}</button>`).join('')}</div></div><button class="btn primary full" data-add-cart="${p.id}">Adicionar à sacola</button><ul class="feature-list">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul><p class="muted">Produto simulado. Substitua descrição, preço, variantes e fotos no arquivo de dados.</p>`;
  $$('.pill-row button').forEach(btn => btn.addEventListener('click', () => { $$('.pill-row button', btn.parentElement).forEach(b => b.classList.remove('is-active')); btn.classList.add('is-active'); }));
}
function addToCart(id, qty=1){
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty += qty; else cart.push({ id, qty });
  setCart(cart);
  openCart();
}
function updateQty(id, delta){
  const cart = getCart().map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0);
  setCart(cart);
}
function removeItem(id){ setCart(getCart().filter(i => i.id !== id)); }
function cartRows(){
  const cart = getCart();
  if(!cart.length) return '<div class="empty-state">Sua sacola está vazia.</div>';
  return cart.map(item => {
    const p = productById(item.id); if(!p) return '';
    return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"/><div><strong>${p.name}</strong><div class="muted">${BRL.format(p.price)}</div><div class="qty-controls"><button data-qty-minus="${p.id}">−</button><span>${item.qty}</span><button data-qty-plus="${p.id}">+</button><button class="remove-btn" data-remove="${p.id}">Remover</button></div></div><strong>${BRL.format(p.price * item.qty)}</strong></div>`;
  }).join('');
}
function cartTotal(){ return getCart().reduce((sum,item) => sum + (productById(item.id)?.price || 0) * item.qty, 0); }
function renderCartEverywhere(){
  const count = getCart().reduce((sum,item) => sum + item.qty, 0);
  $$('[data-cart-count]').forEach(el => el.textContent = count);
  $$('[data-cart-total]').forEach(el => el.textContent = BRL.format(cartTotal()));
  $$('[data-cart-drawer-items], [data-cart-page-items]').forEach(el => el.innerHTML = cartRows());
}
function openCart(){ $('[data-cart-drawer]')?.classList.add('is-open'); $('[data-cart-drawer]')?.setAttribute('aria-hidden','false'); }
function closeCart(){ $('[data-cart-drawer]')?.classList.remove('is-open'); $('[data-cart-drawer]')?.setAttribute('aria-hidden','true'); }
function initDelegation(){
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add-cart]');
    if(add){ e.preventDefault(); addToCart(add.dataset.addCart); }
    const plus = e.target.closest('[data-qty-plus]'); if(plus) updateQty(plus.dataset.qtyPlus, 1);
    const minus = e.target.closest('[data-qty-minus]'); if(minus) updateQty(minus.dataset.qtyMinus, -1);
    const rem = e.target.closest('[data-remove]'); if(rem) removeItem(rem.dataset.remove);
    if(e.target.closest('[data-cart-close]')) closeCart();
    if(e.target.closest('[data-clear-cart]')) setCart([]);
  });
}
function initPanels(){
  $$('[data-menu-toggle]').forEach(btn => btn.addEventListener('click', () => $('[data-mobile-menu]')?.classList.toggle('is-open')));
  $$('[data-search-toggle]').forEach(btn => btn.addEventListener('click', () => $('[data-search-panel]')?.classList.toggle('is-open')));
  const input = $('[data-search-input]');
  const results = $('[data-search-results]');
  input?.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const list = q ? products.filter(p => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)).slice(0, 8) : [];
    results.innerHTML = list.map(p => `<a class="search-result" href="${productUrl(p.id)}"><img src="${p.image}" alt="${p.name}"/><div><strong>${p.name}</strong><div>${BRL.format(p.price)}</div></div></a>`).join('') || (q ? '<p class="muted">Nenhum resultado.</p>' : '');
  });
}
function boot(){
  initCategoryGrid(); initProductBlocks(); initCollections(); initProductPage(); initDelegation(); initPanels(); renderCartEverywhere();
}
boot();
