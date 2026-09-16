/**
 * D10S Cup - productos.js
 * Lógica optimizada en Vanilla JS para tienda y carrito.
 */

// ============ DATOS DE PRODUCTOS ============
const PRODUCTS_DATA = {
  'apparel-camiseta-oficial': {
    id: 'apparel-camiseta-oficial', title: 'Camiseta Oficial 2026', category: 'camisetas', tag: 'Indumentaria Oficial',
    price: 25000, priceFormatted: '$25.000', image: '../assets/camiseta_oficial.png', sizes: ['S', 'M', 'L', 'XL'], defaultSize: 'M',
    stockStatus: 'En Stock', stockAvailable: true, description: 'Camiseta oficial titular del torneo D10S Cup 2026. Tela deportiva transpirable de excelente calidad con escudo bordado.'
  },
  'apparel-camiseta-alternativa': {
    id: 'apparel-camiseta-alternativa', title: 'Camiseta Alternativa', category: 'camisetas', tag: 'Indumentaria Oficial',
    price: 25000, priceFormatted: '$25.000', image: '../assets/camiseta_alternativa.png', sizes: ['S', 'M', 'L', 'XL'], defaultSize: 'M',
    stockStatus: 'En Stock', stockAvailable: true, description: 'Camiseta suplente oficial del torneo D10S Cup. Confeccionada en microfibra liviana ideal para partidos.'
  },
  'apparel-campera-oficial': {
    id: 'apparel-campera-oficial', title: 'Campera Oficial', category: 'accesorios', tag: 'Indumentaria Oficial',
    price: 35000, priceFormatted: '$35.000', image: '../assets/campera_oficial.png', sizes: ['S', 'M', 'L', 'XL'], defaultSize: 'L',
    stockStatus: 'En Stock', stockAvailable: true, description: 'Campera de entrenamiento oficial con abrigo liviano y bolsillos laterales con cierre.'
  },
  'apparel-gorra-oficial': {
    id: 'apparel-gorra-oficial', title: 'Gorra Oficial', category: 'accesorios', tag: 'Indumentaria Oficial',
    price: 10000, priceFormatted: '$10.000', image: '../assets/gorra_oficial.png', sizes: ['Único'], defaultSize: 'Único',
    stockStatus: 'En Stock', stockAvailable: true, description: 'Gorra oficial D10S Cup con visera curva y broche ajustable posterior. Escudo bordado en el frente.'
  },
  'ticket-halcones': {
    id: 'ticket-halcones', title: 'Entrada: Los Halcones vs La 10 FC', category: 'entradas', tag: 'Fase de Grupos',
    price: 5000, priceFormatted: '$5.000', image: '../assets/logo_d1os_cup.png', sizes: ['General'], defaultSize: 'General',
    stockStatus: 'Disponible', stockAvailable: true, description: 'Entrada general para el partido entre Los Halcones y La 10 FC.'
  },
  'ticket-talento': {
    id: 'ticket-talento', title: 'Entrada: Talento FC vs Los Cracks', category: 'entradas', tag: 'Fase de Grupos',
    price: 5000, priceFormatted: '$5.000', image: '../assets/logo_d1os_cup.png', sizes: ['General'], defaultSize: 'General',
    stockStatus: 'Disponible', stockAvailable: true, description: 'Entrada general para el partido entre Talento FC y Los Cracks.'
  },
  'ticket-semifinal': {
    id: 'ticket-semifinal', title: 'Entrada: Semifinal', category: 'entradas', tag: 'Semifinal',
    price: 7000, priceFormatted: '$7.000', image: '../assets/logo_d1os_cup.png', sizes: ['General'], defaultSize: 'General',
    stockStatus: 'Disponible', stockAvailable: true, description: 'Entrada general para la Semifinal del torneo.'
  },
  'ticket-final': {
    id: 'ticket-final', title: 'Entrada: Final', category: 'entradas', tag: 'Final',
    price: 10000, priceFormatted: '$10.000', image: '../assets/logo_d1os_cup.png', sizes: ['General'], defaultSize: 'General',
    stockStatus: 'Disponible', stockAvailable: true, description: 'Entrada general para la Gran Final de la D10S Cup.'
  }
};

// ============ ESTADO Y REFERENCIAS ============
let cartState = [{ id: 'ticket-final', size: 'General', qty: 1 }];
let selectedProductState = { productId: null, size: null, quantity: 1 };

const $ = id => document.getElementById(id);
const modalOverlay = $('modal-overlay');
const cartOverlay = $('cart-overlay');
const cartDrawer = $('cart-drawer');
const cartItemsList = $('cart-items-list');

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
  setupProductModalEvents();
  setupTicketBuyListeners();
  setupCartEvents();
  setupFilterTabs();
  setupMobileSidebar();
  checkUrlQueryParams();
  updateCartUI();
});

function initLucide() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function checkUrlQueryParams() {
  const ticketId = new URLSearchParams(window.location.search).get('buy_ticket');
  if (ticketId && PRODUCTS_DATA[ticketId]) {
    addToCart(ticketId, 'General', 1);
    openCart();
  }
}

// ============ NOTIFICACIONES TOAST ============
function showNotification(message, type = 'info') {
  let toast = $('d10s-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'd10s-toast';
    toast.className = 'd10s-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i> <span>${message}</span>`;
  toast.classList.add('show');
  initLucide();
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ============ MODAL DE PRODUCTO ============
function setupProductModalEvents() {
  document.querySelectorAll('.apparel-card-item').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.btn-detail')?.addEventListener('click', e => { e.stopPropagation(); openProductModal(id); });
    const imgContainer = card.querySelector('.product-image-container');
    if (imgContainer) {
      imgContainer.style.cursor = 'pointer';
      imgContainer.addEventListener('click', () => openProductModal(id));
    }
  });

  $('close-modal-btn')?.addEventListener('click', closeProductModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeProductModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeProductModal(); closeCart(); }
  });

  // Selector de cantidad
  const qtyVal = $('modal-qty-val');
  $('modal-qty-minus')?.addEventListener('click', () => {
    if (selectedProductState.quantity > 1) {
      selectedProductState.quantity--;
      if (qtyVal) qtyVal.textContent = selectedProductState.quantity;
    }
  });
  $('modal-qty-plus')?.addEventListener('click', () => {
    if (selectedProductState.quantity < 10) {
      selectedProductState.quantity++;
      if (qtyVal) qtyVal.textContent = selectedProductState.quantity;
    }
  });

  // Acciones modal
  $('modal-add-cart-btn')?.addEventListener('click', () => {
    const p = PRODUCTS_DATA[selectedProductState.productId] || { title: 'Producto' };
    addToCart(selectedProductState.productId, selectedProductState.size, selectedProductState.quantity);
    closeProductModal();
    showNotification(`¡${p.title} (Talle ${selectedProductState.size}) agregado al carrito!`, 'success');
  });

  $('modal-buy-now-btn')?.addEventListener('click', () => {
    addToCart(selectedProductState.productId, selectedProductState.size, selectedProductState.quantity);
    closeProductModal();
    openCart();
  });
}

function openProductModal(productId) {
  const p = PRODUCTS_DATA[productId];
  if (!p) return;

  selectedProductState = { productId, size: p.defaultSize || p.sizes[0], quantity: 1 };

  const setEl = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  setEl('modal-product-tag', p.tag);
  setEl('modal-product-title', p.title);
  setEl('modal-product-price', p.priceFormatted);
  setEl('modal-product-description', p.description);
  setEl('modal-stock-text', p.stockStatus);
  setEl('modal-qty-val', 1);

  const imgEl = $('modal-product-img');
  if (imgEl) { imgEl.src = p.image; imgEl.alt = p.title; }

  const badgeEl = $('modal-stock-badge');
  if (badgeEl) badgeEl.className = `stock-badge ${p.stockAvailable ? 'in-stock' : 'low-stock'}`;

  const sizeSelectorEl = $('modal-size-selector');
  if (sizeSelectorEl) {
    sizeSelectorEl.innerHTML = p.sizes.map(s => `
      <button class="size-pill ${s === selectedProductState.size ? 'active' : ''}" data-size="${s}" type="button">${s}</button>
    `).join('');

    sizeSelectorEl.querySelectorAll('.size-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        sizeSelectorEl.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedProductState.size = btn.dataset.size;
      });
    });
  }

  modalOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  initLucide();
}

function closeProductModal() {
  modalOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

// ============ ENTRADAS & CARRITO ============
function setupTicketBuyListeners() {
  document.querySelectorAll('.btn-buy-ticket').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ticket-card-item');
      if (card && PRODUCTS_DATA[card.dataset.id]) {
        addToCart(card.dataset.id, 'General', 1);
        openCart();
      }
    });
  });
}

function setupCartEvents() {
  $('cart-toggle-btn')?.addEventListener('click', openCart);
  $('close-cart-btn')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  $('checkout-btn')?.addEventListener('click', () => {
    if (cartState.length === 0) {
      showNotification('Tu carrito está vacío.', 'info');
      return;
    }
    showNotification('¡Gracias por tu compra! Procesando entrada(s)...', 'success');
    cartState = [];
    updateCartUI();
    setTimeout(closeCart, 1500);
  });
}

function openCart() {
  cartDrawer?.classList.add('active');
  cartOverlay?.classList.add('active');
}

function closeCart() {
  cartDrawer?.classList.remove('active');
  cartOverlay?.classList.remove('active');
}

function addToCart(productId, size, qty = 1) {
  const item = cartState.find(i => i.id === productId && i.size === size);
  if (item) item.qty += qty;
  else cartState.push({ id: productId, size, qty });
  updateCartUI();
}

function removeFromCart(index) {
  cartState.splice(index, 1);
  updateCartUI();
}

function changeCartQty(index, change) {
  if (cartState[index]) {
    cartState[index].qty += change;
    if (cartState[index].qty <= 0) removeFromCart(index);
    else updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cartState.reduce((acc, i) => acc + i.qty, 0);
  const badge = $('cart-count-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  if (!cartItemsList) return;

  if (cartState.length === 0) {
    cartItemsList.innerHTML = `<div class="cart-empty"><i data-lucide="shopping-bag"></i><p>Tu carrito está vacío</p></div>`;
    if ($('cart-subtotal')) $('cart-subtotal').textContent = '$0';
    if ($('cart-total')) $('cart-total').textContent = '$0';
    initLucide();
    return;
  }

  let subtotal = 0;
  cartItemsList.innerHTML = cartState.map((item, index) => {
    const p = PRODUCTS_DATA[item.id] || { title: 'Producto', price: 0, image: '../assets/logo_d1os_cup.png' };
    const itemTotal = p.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${p.image}" alt="${p.title}" /></div>
        <div class="cart-item-details">
          <div class="cart-item-name">${p.title}</div>
          <div class="cart-item-meta">Talle: ${item.size}</div>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button class="qty-btn" onclick="changeCartQty(${index}, -1)"><i data-lucide="minus"></i></button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="changeCartQty(${index}, 1)"><i data-lucide="plus"></i></button>
            </div>
            <span class="cart-item-price">$${itemTotal.toLocaleString('es-AR')}</span>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${index})" aria-label="Eliminar producto">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
  }).join('');

  const formattedSubtotal = `$${subtotal.toLocaleString('es-AR')}`;
  if ($('cart-subtotal')) $('cart-subtotal').textContent = formattedSubtotal;
  if ($('cart-total')) $('cart-total').textContent = formattedSubtotal;

  initLucide();
}

window.changeCartQty = changeCartQty;
window.removeFromCart = removeFromCart;

// ============ FILTROS ============
function setupFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-tabs .tab-btn');
  const ticketsSection = $('entradas-section');
  const apparelSection = $('indumentaria-section');
  const agendarBanner = $('agendar-banner');

  const applyFilter = filter => {
    const isTodos = filter === 'todos';
    const isEntradas = filter === 'entradas';
    const isAgendar = filter === 'agendar';
    
    if (ticketsSection) ticketsSection.style.display = (isTodos || isEntradas) ? 'block' : 'none';
    if (apparelSection) apparelSection.style.display = (isTodos || filter === 'camisetas' || filter === 'accesorios') ? 'block' : 'none';
    if (agendarBanner) agendarBanner.style.display = (isTodos || isAgendar) ? 'flex' : 'none';

    if (filter === 'camisetas' || filter === 'accesorios' || isTodos) {
      document.querySelectorAll('.apparel-card-item').forEach(card => {
        const p = PRODUCTS_DATA[card.dataset.id];
        card.style.display = (isTodos || (p && p.category === filter)) ? 'flex' : 'none';
      });
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  const bindSubmenu = (elId, filterName) => {
    $(elId)?.addEventListener('click', e => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filterName));
      applyFilter(filterName);
    });
  };

  bindSubmenu('submenu-filter-tickets', 'entradas');
  bindSubmenu('submenu-filter-apparel', 'camisetas');
}

// ============ MENÚ MOBILE ============
function setupMobileSidebar() {
  const mobileMenuToggle = $('mobile-menu-toggle');
  const sidebar = $('sidebar');
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
  }
}
