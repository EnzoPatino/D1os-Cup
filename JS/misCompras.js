import { supabase } from "./supabaseClient.js";

const status = document.getElementById("purchases-status");
const list = document.getElementById("purchases-list");
const money = (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(value) || 0);

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
}

function empty(message, error = false) {
  status.textContent = message;
  status.dataset.kind = error ? "error" : "info";
  status.hidden = false;
  list.replaceChildren();
}

function renderOrder(order) {
  const card = make("article", "purchase-order");
  const heading = make("header", "purchase-order-heading");
  const createdAt = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.created_at));
  heading.append(make("h2", "", `Pedido del ${createdAt}`), make("span", `order-state order-state--${order.estado}`, order.estado.replaceAll("_", " ")));
  card.append(heading, make("p", "purchase-order-total", `Total: ${money(order.total)}`));
  const items = make("ul", "purchase-order-items");
  for (const item of order.pedido_items || []) {
    const variant = item.variantes_producto;
    const product = variant?.productos;
    const description = [product?.nombre || "Producto", variant?.etiqueta ? `Variante ${variant.etiqueta}` : "", `Cantidad ${item.cantidad}`, `${money(item.precio_unitario)} c/u`].filter(Boolean).join(" · ");
    items.append(make("li", "", description));
  }
  card.append(items);
  const tickets = (order.pedido_items || []).flatMap((item) => item.tickets || []);
  if (tickets.length) {
    const ticketSection = make("section", "history-tickets");
    ticketSection.append(make("h3", "", "Entradas"));
    const ticketList = make("div", "purchase-tickets");
    for (const ticket of tickets) {
      const ticketNode = make("article", "purchase-ticket");
      ticketNode.append(make("p", "", `Estado: ${ticket.estado}`), make("p", "ticket-code", `Código: ${ticket.codigo}`));
      const qr = make("div", "ticket-qr");
      ticketNode.append(qr);
      ticketList.append(ticketNode);
      if (window.QRCode) new window.QRCode(qr, { text: ticket.codigo, width: 128, height: 128, correctLevel: window.QRCode.CorrectLevel.M });
      else qr.textContent = "No se pudo cargar el QR. Conservá el código de entrada.";
    }
    ticketSection.append(ticketList);
    card.append(ticketSection);
  }
  return card;
}

async function loadPurchases() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      window.location.replace("incioSesion.html");
      return;
    }
    const { data, error } = await supabase
      .from("pedidos")
      .select("id,total,estado,created_at,pedido_items(id,cantidad,precio_unitario,variantes_producto(etiqueta,productos(nombre)),tickets(codigo,estado))")
      .eq("usuario_id", sessionData.session.user.id)
      .order("created_at", { ascending: false })
      .abortSignal(controller.signal);
    if (error) throw error;
    if (!data?.length) return empty("Todavía no tenés compras registradas.");
    status.hidden = true;
    list.replaceChildren(...data.map(renderOrder));
  } catch {
    empty("No se pudieron cargar tus compras. Revisá tu conexión e intentá nuevamente.", true);
  } finally {
    window.clearTimeout(timeout);
  }
}

loadPurchases();
