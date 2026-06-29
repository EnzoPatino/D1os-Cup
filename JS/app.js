document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- State ---
  let cart = [
    {
      id: 'ticket-final',
      type: 'ticket',
      name: 'Entrada: Final - Por Confirmar vs Por Confirmar',
      price: 10000,
      quantity: 1,
      image: '../assets/logo_d1os_cup.png',
      meta: 'General | Dom, 7 Jun'
    },
    {
      id: 'apparel-camiseta-oficial',
      type: 'apparel',
      name: 'Camiseta Oficial 2026',
      price: 25000,
      quantity: 1,
      image: '../assets/camiseta_oficial.png',
      meta: 'Talle: M'
    }
  ];

  const productsData = {
    'ticket-halcones': {
      id: 'ticket-halcones',
      name: 'Los Halcones vs La 10 FC',
      price: 5000,
      type: 'ticket',
      image: '../assets/logo_d1os_cup.png',
      tag: 'FASE DE GRUPOS',
      tagClass: 'tag-grupos',
      date: 'Sáb, 24 May - 16:00 hs',
      venue: 'Cancha Principal',
      description: 'Entrada general para el emocionante encuentro de fase de grupos entre Los Halcones y La 10 FC. El ingreso al estadio comienza 1 hora antes del partido.'
    },
    'ticket-talento': {
      id: 'ticket-talento',
      name: 'Talento FC vs Los Cracks',
      price: 5000,
      type: 'ticket',
      image: '../assets/logo_d1os_cup.png',
      tag: 'FASE DE GRUPOS',
      tagClass: 'tag-grupos',
      date: 'Dom, 25 May - 18:00 hs',
      venue: 'Cancha Principal',
      description: 'Entrada general para el cruce clave de la fase de grupos entre Talento FC y Los Cracks. ¡No te pierdas este duelo que define la clasificación!'
    },
    'ticket-semifinal': {
      id: 'ticket-semifinal',
      name: 'Por Confirmar vs Por Confirmar',
      price: 7000,
      type: 'ticket',
      image: '../assets/logo_d1os_cup.png',
      tag: 'SEMIFINAL',
      tagClass: 'tag-semifinal',
      date: 'Sáb, 31 May - 17:00 hs',
      venue: 'Cancha Principal',
      description: 'Entrada general para la gran Semifinal de la D10S Cup. Viví la tensión del partido que depositará a uno de los equipos en la gran final del torneo.'
    },
    'ticket-final': {
      id: 'ticket-final',
      name: 'Por Confirmar vs Por Confirmar',
      price: 10000,
      type: 'ticket',
      image: '../assets/logo_d1os_cup.png',
      tag: 'FINAL',
      tagClass: 'tag-final',
      date: 'Dom, 7 Jun - 17:00 hs',
      venue: 'Cancha Principal',
      description: 'Entrada general para la finalísima de la D10S Cup. Sé testigo de la coronación del campeón y el festejo del legado eterno.'
    },
    'apparel-camiseta-oficial': {
      id: 'apparel-camiseta-oficial',
      name: 'Camiseta Oficial 2026',
      price: 25000,
      type: 'camiseta',
      image: '../assets/camiseta_oficial.png',
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'La camiseta titular oficial de la D10S Cup 2026. Diseñada en color negro premium con elegantes bastones dorados finos y el escudo oficial estampado en oro. Tecnología dry-fit transpirable para máximo rendimiento en la cancha.'
    },
    'apparel-camiseta-alternativa': {
      id: 'apparel-camiseta-alternativa',
      name: 'Camiseta Alternativa',
      price: 25000,
      type: 'camiseta',
      image: '../assets/camiseta_alternativa.png',
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'La camiseta de visita de la D10S Cup 2026. Presenta un diseño blanco inmaculado con terminaciones en cuello y mangas doradas de alta costura, y el logo del torneo bordado en el pecho. Comodidad y estilo inigualables.'
    },
    'apparel-campera-oficial': {
      id: 'apparel-campera-oficial',
      name: 'Campera Oficial',
      price: 35000,
      type: 'accesorio',
      image: '../assets/campera_oficial.png',
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Campera deportiva con capucha de algodón premium. Color negro mate con cordones ajustables con punteras doradas metálicas y escudo bordado en hilo de oro de alta densidad. Ideal para abrigarse antes y después de cada partido.'
    },
    'apparel-gorra-oficial': {
      id: 'apparel-gorra-oficial',
      name: 'Gorra Oficial',
      price: 10000,
      type: 'accesorio',
      image: '../assets/gorra_oficial.png',
      sizes: ['Único'],
      description: 'Gorra de béisbol oficial regulable. Color negro con costuras de visera doradas a tono y el logo de la D10S Cup bordado en relieve 3D dorado en el frente. Hebilla metálica trasera para un ajuste personalizado.'
    }
  };

  // --- Selectors ---
  const sidebar = document.getElementById('sidebar');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const ticketsSection = document.getElementById('entradas-section');
  const apparelSection = document.getElementById('indumentaria-section');
  const ticketCards = document.querySelectorAll('.ticket-card-item');
  const apparelCards = document.querySelectorAll('.apparel-card-item');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const toastContainer = document.getElementById('toast-container');
  const checkoutBtn = document.getElementById('checkout-btn');

  // --- Helper Functions ---
  const formatCurrency = (amount) => {
    return '$' + amount.toLocaleString('es-AR');
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="lucide-shopping-bag"></i>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  // --- Cart Management ---
  const updateCartUI = () => {
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i data-lucide="shopping-cart"></i>
          <p>Tu carrito está vacío</p>
        </div>
      `;
    } else {
      cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <div>
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-meta">${item.meta}</p>
            </div>
            <div class="cart-item-bottom">
              <div class="qty-control">
                <button class="qty-btn dec-qty" data-index="${index}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn inc-qty" data-index="${index}">+</button>
              </div>
              <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
            </div>
          </div>
          <button class="remove-item" data-index="${index}">
            <i data-lucide="trash-2"></i>
          </button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
      });
    }

    // Update Totals
    cartSubtotalEl.textContent = formatCurrency(subtotal);
    cartTotalEl.textContent = formatCurrency(subtotal);
    
    // Update Badge
    cartCountBadge.textContent = totalItems;
    if (totalItems > 0) {
      cartCountBadge.style.display = 'flex';
    } else {
      cartCountBadge.style.display = 'none';
    }

    // Sync button states on the main catalog
    // Specifically sync the "FINAL: Por Confirmar vs Por Confirmar" (ticket-final)
    const finalBtn = document.getElementById('btn-ticket-final');
    if (finalBtn) {
      const isInCart = cart.some(item => item.id === 'ticket-final');
      if (isInCart) {
        finalBtn.className = 'btn btn-solid';
        finalBtn.innerHTML = '<i data-lucide="shopping-cart"></i> Ir al carrito';
      } else {
        finalBtn.className = 'btn btn-outline';
        finalBtn.innerHTML = 'Comprar';
      }
    }

    // Sync other ticket buttons
    ['ticket-halcones', 'ticket-talento', 'ticket-semifinal'].forEach(id => {
      const btn = document.getElementById(`btn-${id}`);
      if (btn) {
        const isInCart = cart.some(item => item.id === id);
        if (isInCart) {
          btn.className = 'btn btn-solid';
          btn.innerHTML = '<i data-lucide="shopping-cart"></i> Ir al carrito';
        } else {
          btn.className = 'btn btn-outline';
          btn.innerHTML = 'Comprar';
        }
      }
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  const addToCart = (productId, selectedSize = null) => {
    const product = productsData[productId];
    if (!product) return;

    // Build unique identifier based on product + size (for clothes)
    const sizeMeta = selectedSize ? `Talle: ${selectedSize}` : '';
    const cartId = selectedSize ? `${productId}-${selectedSize}` : productId;
    
    const existingItem = cart.find(item => item.id === cartId);

    if (existingItem) {
      existingItem.quantity += 1;
      showToast(`Cantidad de "${product.name}" incrementada en el carrito.`);
    } else {
      cart.push({
        id: cartId,
        type: product.type,
        name: product.type === 'ticket' ? `Entrada: ${product.name}` : product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        meta: product.type === 'ticket' ? `General | ${product.date.split(' - ')[0]}` : sizeMeta
      });
      showToast(`"${product.name}" agregado al carrito.`);
    }

    updateCartUI();
  };

  // --- Event Listeners ---

  // Sidebar mobile toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      cartOverlay.classList.toggle('active');
    });
  }

  // Cart open/close
  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      sidebar.classList.remove('active'); // Close mobile menu if open
    });
  }

  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    sidebar.classList.remove('active');
  };

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Cart Qty & Remove delegation
  cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.qty-btn, .remove-item');
    if (!target) return;

    const index = parseInt(target.getAttribute('data-index'), 10);
    
    if (target.classList.contains('inc-qty')) {
      cart[index].quantity += 1;
    } else if (target.classList.contains('dec-qty')) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
    } else if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
      cart.splice(index, 1);
    }

    updateCartUI();
  });

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      if (filterVal === 'todos') {
        ticketsSection.style.display = 'block';
        apparelSection.style.display = 'block';
        ticketCards.forEach(c => c.style.display = 'flex');
        apparelCards.forEach(c => c.style.display = 'flex');
      } else if (filterVal === 'entradas') {
        ticketsSection.style.display = 'block';
        apparelSection.style.display = 'none';
        ticketCards.forEach(c => c.style.display = 'flex');
      } else if (filterVal === 'camisetas') {
        ticketsSection.style.display = 'none';
        apparelSection.style.display = 'block';
        apparelCards.forEach(c => {
          const prodId = c.getAttribute('data-id');
          const product = productsData[prodId];
          if (product && product.type === 'camiseta') {
            c.style.display = 'flex';
          } else {
            c.style.display = 'none';
          }
        });
      } else if (filterVal === 'accesorios') {
        ticketsSection.style.display = 'none';
        apparelSection.style.display = 'block';
        apparelCards.forEach(c => {
          const prodId = c.getAttribute('data-id');
          const product = productsData[prodId];
          if (product && product.type === 'accesorio') {
            c.style.display = 'flex';
          } else {
            c.style.display = 'none';
          }
        });
      } else if (filterVal === 'agendar') {
        // Scroll to Agendar banner
        const banner = document.getElementById('agendar-banner');
        if (banner) {
          banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Trigger a pulse animation on the banner border
          banner.style.boxShadow = '0 0 35px rgba(229, 184, 66, 0.6)';
          banner.style.transition = 'box-shadow 0.3s ease';
          setTimeout(() => {
            banner.style.boxShadow = 'var(--shadow-gold-glow)';
          }, 1500);
        }
      }
    });
  });

  // Ticket Buy Buttons
  const setupTicketButtons = () => {
    ['ticket-halcones', 'ticket-talento', 'ticket-semifinal', 'ticket-final'].forEach(id => {
      const btn = document.getElementById(`btn-${id}`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const isInCart = cart.some(item => item.id === id);
          if (isInCart) {
            // Open cart drawer
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
          } else {
            addToCart(id);
          }
        });
      }
    });
  };

  // Apparel Details Buttons / Modal opening
  const setupApparelButtons = () => {
    apparelCards.forEach(card => {
      const btn = card.querySelector('.btn-detail');
      const prodId = card.getAttribute('data-id');
      
      if (btn && prodId) {
        btn.addEventListener('click', () => {
          openDetailsModal(prodId);
        });
      }
    });
  };

  const openDetailsModal = (productId) => {
    const product = productsData[productId];
    if (!product) return;

    const modalBody = document.getElementById('modal-body-content');
    
    // Build sizes layout
    let sizesHtml = '';
    if (product.sizes) {
      sizesHtml = `
        <h5 class="modal-option-title">Seleccionar Talle:</h5>
        <div class="size-selector" id="modal-size-selector">
          ${product.sizes.map((s, idx) => `
            <button class="size-pill ${idx === 1 ? 'active' : ''}" data-size="${s}">${s}</button>
          `).join('')}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-content-layout">
        <div class="modal-img-container">
          <img src="${product.image}" alt="${product.name}" class="modal-img">
        </div>
        <div class="modal-info-side">
          <h3 class="modal-title">${product.name}</h3>
          <span class="modal-price">${formatCurrency(product.price)}</span>
          <p class="modal-description">${product.description}</p>
          
          ${sizesHtml}
          
          <button class="btn btn-solid checkout-btn" id="modal-add-to-cart-btn">
            <i class="lucide-shopping-cart"></i> Agregar al carrito
          </button>
        </div>
      </div>
    `;

    // Size Selection handler
    const sizePills = modalBody.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
      pill.addEventListener('click', () => {
        sizePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Add to Cart handler inside Modal
    const addBtn = modalBody.querySelector('#modal-add-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const activeSizePill = modalBody.querySelector('.size-pill.active');
        const selectedSize = activeSizePill ? activeSizePill.getAttribute('data-size') : null;
        addToCart(productId, selectedSize);
        closeDetailsModal();
      });
    }

    modalOverlay.classList.add('active');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  const closeDetailsModal = () => {
    modalOverlay.classList.remove('active');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeDetailsModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeDetailsModal();
    });
  }

  // Checkout click handler
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      alert('¡Gracias por tu compra simulada! Procediendo al pago de los productos de la D10S Cup.');
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // --- Initial Setup ---
  setupTicketButtons();
  setupApparelButtons();
  updateCartUI();
});
