import { supabase } from "./supabaseClient.js";

const grid = document.getElementById("product-grid");
const catalogStatus = document.getElementById("catalog-status");
const cartItemsNode = document.getElementById("cart-items-list");
const cartStatus = document.getElementById("cart-status");
const cartStorageKey = "d10s-cart-v1";
const categoryButtons = [...document.querySelectorAll(".filter-tabs [data-filter]")];
const productSearch = document.getElementById("product-search");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const productOverlay = document.getElementById("modal-overlay");
const purchaseOverlay = document.getElementById("purchase-overlay");
let products = [];
let variantsById = new Map();
const requestedCategory = new URLSearchParams(window.location.search).get("filter");
let activeCategory = categoryButtons.some((button) => button.dataset.filter === requestedCategory)
  ? requestedCategory
  : "todos";
let selectedProduct = null;
let selectedVariantId = null;
let quantity = 1;
let cart = readCart();

categoryButtons.forEach((button) => {
  button.classList.toggle("active", button.dataset.filter === activeCategory);
});

function node(tag, className, text) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text !== undefined) item.textContent = String(text);
  return item;
}

function money(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function setNotice(target, message, error = false) {
  target.textContent = message;
  target.dataset.kind = error ? "error" : "info";
  target.hidden = !message;
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => typeof item?.variante_id === "string" && Number.isInteger(item?.cantidad) && item.cantidad > 0)
      .map((item) => ({ variante_id: item.variante_id, cantidad: item.cantidad }));
  } catch {
    return [];
  }
}

function saveCart() {
  cart = cart.map(({ variante_id, cantidad }) => ({ variante_id, cantidad }));
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function variants(product) {
  return product.variantes_producto || [];
}

function productImage(product) {
  const image = node("img", "product-image");
  const fallback = "../assets/camiseta_oficial.png";
  const value = product.imagen_url || fallback;
  image.src = value.startsWith("/") || value.startsWith("../") || value.startsWith("./") || /^https:\/\//i.test(value)
    ? value
    : fallback;
  image.alt = product.nombre || "Producto D10S Cup";
  image.loading = "lazy";
  image.addEventListener("error", () => { image.src = fallback; }, { once: true });
  return image;
}

function stockText(variant) {
  return variant.stock > 0 ? `Stock: ${variant.stock}` : "Agotado";
}

function productCard(product) {
  const card = node("article", "card store-card");
  const picture = node("div", "store-card-image");
  picture.append(productImage(product));
  const body = node("div", "store-card-body");
  body.append(node("span", "store-category", product.categorias_producto?.nombre || "Producto"));
  body.append(node("h3", "product-title", product.nombre));
  body.append(node("p", "store-description", product.descripcion || "Producto oficial D10S Cup."));
  body.append(node("strong", "product-price", money(product.precio)));
  const variantLabel = node("label", "store-variant-label", product.categorias_producto?.nombre === "entradas" ? "Ubicación" : "Variante");
  const selector = document.createElement("select");
  selector.className = "store-variant-select";
  selector.setAttribute("aria-label", `Variante de ${product.nombre}`);
  const available = variants(product).filter((variant) => variant.stock > 0);
  const options = variants(product).map((variant) => {
    const option = node("option", "", `${variant.etiqueta} · ${stockText(variant)}`);
    option.value = variant.id;
    option.disabled = variant.stock <= 0;
    return option;
  });
  selector.replaceChildren(...options);
  const selectedVariant = available[0]?.id || "";
  selector.value = selectedVariant;
  variantLabel.append(selector);
  const actions = node("div", "store-card-actions");
  const detail = node("button", "btn btn-outline", "Ver detalles");
  detail.type = "button";
  detail.addEventListener("click", () => openDetails(product, selector.value || selectedVariant));
  const add = node("button", "btn btn-solid", "Agregar al carrito");
  add.type = "button";
  add.disabled = !available.length;
  add.addEventListener("click", () => addToCart(selector.value, 1));
  actions.append(detail, add);
  body.append(variantLabel, actions);
  card.append(picture, body);
  return card;
}

function renderProducts() {
  const search = productSearch.value.trim().toLocaleLowerCase("es");
  const visible = products.filter((product) => {
    const category = product.categorias_producto?.nombre || "";
    const matchesCategory = activeCategory === "todos" || category === activeCategory;
    const matchesSearch = `${product.nombre} ${product.descripcion || ""} ${category}`.toLocaleLowerCase("es").includes(search);
    return matchesCategory && matchesSearch;
  });
  grid.replaceChildren(...visible.map(productCard));
  setNotice(catalogStatus, visible.length ? "" : products.length ? "No hay productos que coincidan con el filtro." : "No hay productos publicados por el momento.");
}

async function loadProducts() {
  setNotice(catalogStatus, "Cargando productos desde Supabase…");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id,nombre,descripcion,precio,imagen_url,categoria_id,partido_id,categorias_producto(nombre),variantes_producto(id,etiqueta,stock)")
      .eq("activo", true)
      .order("nombre", { ascending: true })
      .abortSignal(controller.signal);
    if (error) throw error;
    products = data || [];
    variantsById = new Map();
    for (const product of products) for (const variant of variants(product)) variantsById.set(variant.id, { variant, product });
    cart = cart.filter((item) => variantsById.has(item.variante_id));
    saveCart();
    renderProducts();
    renderCart();
  } catch {
    setNotice(catalogStatus, "No se pudo cargar el catálogo. Revisá tu conexión e intentá nuevamente.", true);
  } finally {
    window.clearTimeout(timeout);
  }
}

function openDetails(product, defaultVariantId) {
  selectedProduct = product;
  selectedVariantId = defaultVariantId || variants(product).find((item) => item.stock > 0)?.id || null;
  quantity = 1;
  document.getElementById("modal-product-tag").textContent = product.categorias_producto?.nombre || "D10S Cup";
  document.getElementById("modal-product-title").textContent = product.nombre;
  document.getElementById("modal-product-price").textContent = money(product.precio);
  document.getElementById("modal-product-description").textContent = product.descripcion || "Producto oficial D10S Cup.";
  document.getElementById("modal-stock-text").textContent = variants(product).some((item) => item.stock > 0) ? "Disponible" : "Agotado";
  document.getElementById("modal-product-img").replaceWith(productImageForModal(product));
  document.getElementById("modal-qty-val").textContent = String(quantity);
  const selector = document.getElementById("modal-size-selector");
  selector.replaceChildren(...variants(product).map((variant) => {
    const button = node("button", `size-pill${variant.id === selectedVariantId ? " active" : ""}`, `${variant.etiqueta} · ${stockText(variant)}`);
    button.type = "button";
    button.disabled = variant.stock <= 0;
    button.addEventListener("click", () => {
      selectedVariantId = variant.id;
      selector.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      quantity = Math.min(quantity, variant.stock);
      document.getElementById("modal-qty-val").textContent = String(quantity);
    });
    return button;
  }));
  document.getElementById("modal-add-cart-btn").disabled = !selectedVariantId;
  document.getElementById("modal-buy-now-btn").disabled = !selectedVariantId;
  productOverlay.classList.add("active");
}

function productImageForModal(product) {
  const image = productImage(product);
  image.id = "modal-product-img";
  image.className = "modal-img";
  return image;
}

function closeDetails() {
  productOverlay.classList.remove("active");
}

function addToCart(variantId, amount) {
  const entry = variantsById.get(variantId);
  if (!entry || entry.variant.stock <= 0) {
    setNotice(cartStatus, "Esa variante está agotada.", true);
    return;
  }
  const existing = cart.find((item) => item.variante_id === variantId);
  const requested = (existing?.cantidad || 0) + amount;
  if (requested > entry.variant.stock) {
    setNotice(cartStatus, `Solo quedan ${entry.variant.stock} unidades de esa variante.`, true);
    return;
  }
  if (existing) existing.cantidad = requested;
  else cart.push({ variante_id: variantId, cantidad: amount });
  setNotice(cartStatus, "");
  saveCart();
  renderCart();
}

function renderCart() {
  const badge = document.getElementById("cart-count-badge");
  const count = cart.reduce((total, item) => total + item.cantidad, 0);
  badge.textContent = String(count);
  badge.hidden = count === 0;
  if (!cart.length) {
    cartItemsNode.replaceChildren(node("div", "cart-empty", "Tu carrito está vacío."));
    return;
  }
  cartItemsNode.replaceChildren(...cart.map((item, index) => {
    const entry = variantsById.get(item.variante_id);
    if (!entry) return node("div", "cart-item", "Producto no disponible");
    const row = node("div", "cart-item");
    const details = node("div", "cart-item-details");
    details.append(node("strong", "cart-item-name", entry.product.nombre));
    details.append(node("span", "cart-item-meta", `Variante: ${entry.variant.etiqueta}`));
    details.append(node("span", "cart-item-meta", `${money(entry.product.precio)} · cantidad ${item.cantidad}`));
    const controls = node("div", "qty-control");
    const decrease = node("button", "qty-btn", "−");
    decrease.type = "button";
    decrease.setAttribute("aria-label", "Restar una unidad");
    decrease.addEventListener("click", () => updateQuantity(index, -1));
    const number = node("span", "qty-val", item.cantidad);
    const increase = node("button", "qty-btn", "+");
    increase.type = "button";
    increase.setAttribute("aria-label", "Sumar una unidad");
    increase.addEventListener("click", () => updateQuantity(index, 1));
    controls.append(decrease, number, increase);
    const remove = node("button", "remove-item", "Quitar");
    remove.type = "button";
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });
    row.append(details, controls, remove);
    return row;
  }));
}

function updateQuantity(index, change) {
  const item = cart[index];
  if (!item) return;
  const available = variantsById.get(item.variante_id)?.variant.stock || 0;
  const next = item.cantidad + change;
  if (next <= 0) cart.splice(index, 1);
  else if (next > available) setNotice(cartStatus, `Solo quedan ${available} unidades de esa variante.`, true);
  else item.cantidad = next;
  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
}

function renderReceipt(total, tickets) {
  document.getElementById("purchase-total").textContent = `Total confirmado: ${money(total)}`;
  const container = document.getElementById("purchase-tickets");
  container.replaceChildren();
  if (!tickets.length) container.append(node("p", "data-status", "Compra confirmada. Este pedido no incluye entradas."));
  for (const ticket of tickets) {
    const card = node("article", "purchase-ticket");
    card.append(node("h3", "", "Entrada D10S Cup"));
    card.append(node("p", "ticket-code", `Código: ${ticket.codigo}`));
    const qr = node("div", "ticket-qr");
    qr.setAttribute("aria-label", `Código QR del ticket ${ticket.codigo}`);
    card.append(qr);
    container.append(card);
    if (window.QRCode) new window.QRCode(qr, { text: ticket.codigo, width: 144, height: 144, correctLevel: window.QRCode.CorrectLevel.M });
    else qr.textContent = "No se pudo cargar el generador de QR; conservá el código de entrada.";
  }
  purchaseOverlay.hidden = false;
}

async function checkout() {
  if (!cart.length) {
    setNotice(cartStatus, "Agregá productos antes de finalizar la compra.", true);
    return;
  }
  const button = document.getElementById("checkout-btn");
  button.disabled = true;
  button.textContent = "Procesando compra…";
  setNotice(cartStatus, "Verificando sesión y reservando stock…");
  let orderId = null;
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      window.location.assign("incioSesion.html");
      return;
    }
    const { data: order, error: createError } = await supabase.rpc("crear_pedido", {
      p_items: cart.map(({ variante_id, cantidad }) => ({ variante_id, cantidad })),
    });
    if (createError) throw createError;
    orderId = order?.pedido_id;
    if (!orderId) throw new Error("No se recibió el identificador del pedido.");
    const { data: confirmation, error: paymentError } = await supabase.rpc("confirmar_pago_simulado", { p_pedido_id: orderId });
    if (paymentError) throw paymentError;
    cart = [];
    saveCart();
    renderCart();
    closeCart();
    await loadProducts();
    renderReceipt(order.total, Array.isArray(confirmation?.tickets) ? confirmation.tickets : []);
    setNotice(cartStatus, "");
  } catch {
    if (orderId) {
      let cancelError = null;
      try {
        ({ error: cancelError } = await supabase.rpc("cancelar_pedido", { p_pedido_id: orderId }));
      } catch (error) {
        cancelError = error;
      }
      if (cancelError) {
        setNotice(cartStatus, `No se pudo confirmar ni liberar el pedido ${orderId}. Contactá al administrador con ese código.`, true);
      } else {
        setNotice(cartStatus, "La compra no se completó; se liberó el stock reservado. Intentá nuevamente.", true);
      }
    } else {
      setNotice(cartStatus, "No se pudo procesar la compra. Revisá stock y conexión e intentá nuevamente.", true);
    }
  } finally {
    button.disabled = false;
    button.textContent = "Finalizar compra";
  }
}

categoryButtons.forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  categoryButtons.forEach((filter) => filter.classList.toggle("active", filter === button));
  renderProducts();
}));
productSearch.addEventListener("input", renderProducts);
document.getElementById("cart-toggle-btn").addEventListener("click", openCart);
document.getElementById("close-cart-btn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("close-modal-btn").addEventListener("click", closeDetails);
productOverlay.addEventListener("click", (event) => { if (event.target === productOverlay) closeDetails(); });
document.getElementById("modal-qty-minus").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  document.getElementById("modal-qty-val").textContent = String(quantity);
});
document.getElementById("modal-qty-plus").addEventListener("click", () => {
  const stock = variantsById.get(selectedVariantId)?.variant.stock || 0;
  quantity = Math.min(stock, quantity + 1);
  document.getElementById("modal-qty-val").textContent = String(quantity);
});
document.getElementById("modal-add-cart-btn").addEventListener("click", () => {
  if (selectedVariantId) addToCart(selectedVariantId, quantity);
  closeDetails();
});
document.getElementById("modal-buy-now-btn").addEventListener("click", () => {
  if (selectedVariantId) addToCart(selectedVariantId, quantity);
  closeDetails();
  openCart();
});
document.getElementById("checkout-btn").addEventListener("click", checkout);
document.getElementById("close-purchase-btn").addEventListener("click", () => { purchaseOverlay.hidden = true; });
document.getElementById("mobile-menu-toggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("sidebar-overlay").classList.toggle("active");
});
document.getElementById("sidebar-overlay").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("sidebar-overlay").classList.remove("active");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { closeCart(); closeDetails(); purchaseOverlay.hidden = true; }
});

loadProducts();
