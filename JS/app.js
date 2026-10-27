import { supabase } from "./supabaseClient.js";

const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");
const setMenuOpen = (open) => {
  if (!toggle || !menu) return;
  menu.classList.toggle("active", open);
  toggle.classList.toggle("active", open);
  toggle.setAttribute("aria-expanded", String(open));
};
toggle?.addEventListener("click", () => setMenuOpen(!menu.classList.contains("active")));
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
document.addEventListener("click", (event) => {
  if (menu?.classList.contains("active") && !menu.contains(event.target) && !toggle?.contains(event.target)) {
    setMenuOpen(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const navbar = document.querySelector(".navbar");
let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    navbar?.classList.toggle("page-scrolled", window.scrollY > 12);
    scrollFrame = 0;
  });
}, { passive: true });

const form = document.getElementById("contact-form");
const message = document.getElementById("contact-status");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = document.getElementById("nombre");
  const email = document.getElementById("email");
  const phone = document.getElementById("telefono");
  const body = document.getElementById("mensaje");
  const nombre = name.value.trim();
  const correo = email.value.trim();
  const telefono = phone.value.trim();
  const mensaje = body.value.trim();
  if (!nombre || nombre.length > 120 || !correo || correo.length > 254 || telefono.length > 40 || mensaje.length < 10 || mensaje.length > 5000) {
    message.textContent = "Revisá el nombre, correo, teléfono y mensaje. El mensaje debe tener entre 10 y 5000 caracteres.";
    message.dataset.kind = "error";
    message.hidden = false;
    return;
  }

  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  const originalLabel = submit.textContent;
  submit.textContent = "Enviando…";
  message.hidden = true;
  try {
    const { error } = await supabase.from("mensajes_contacto").insert({ nombre, email: correo, telefono: telefono || null, mensaje });
    if (error) throw error;
    message.textContent = "Recibimos tu mensaje. Gracias por contactarnos.";
    message.dataset.kind = "success";
    message.hidden = false;
    form.reset();
  } catch {
    message.textContent = "No se pudo enviar el mensaje. Revisá tu conexión e intentá nuevamente.";
    message.dataset.kind = "error";
    message.hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
});
