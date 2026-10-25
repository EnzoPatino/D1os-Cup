import { supabase } from "./supabaseClient.js";

const isHtmlPage = window.location.pathname.toLowerCase().includes("/html/");
const homeHref = isHtmlPage ? "../index.html" : "index.html";
const loginHref = isHtmlPage ? "incioSesion.html" : "HTML/incioSesion.html";
const registerHref = isHtmlPage ? "Registrarse.html" : "HTML/Registrarse.html";
const purchasesHref = isHtmlPage ? "misCompras.html" : "HTML/misCompras.html";
const route = document.body.dataset.authRoute || "";
const redirectIfSignedIn = route === "login" || route === "register";

export function showAuthMessage(element, message, kind = "info") {
  if (!element) return;
  element.textContent = message;
  element.dataset.kind = kind;
  element.hidden = !message;
}

function makeLink(href, label, className) {
  const link = document.createElement("a");
  link.href = href;
  link.className = className;
  link.textContent = label;
  return link;
}

function paintSignedOut(container) {
  container.replaceChildren(
    makeLink(loginHref, "Iniciar Sesión", "auth-nav-link auth-nav-login"),
    makeLink(registerHref, "Registrarse", "auth-nav-link auth-nav-register")
  );
}

function paintSignedIn(container, user) {
  const profileName = user.user_metadata?.nombre_usuario || user.email || "Usuario";
  const profile = document.createElement("div");
  profile.className = "auth-profile";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "auth-profile-trigger";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", `Abrir perfil de ${profileName}`);

  const avatar = document.createElement("span");
  avatar.className = "auth-profile-avatar";
  avatar.dataset.profileAvatar = "";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = initialsFor(profileName);

  const triggerCopy = document.createElement("span");
  triggerCopy.className = "auth-profile-trigger-copy";
  const triggerName = document.createElement("span");
  triggerName.className = "auth-user-name";
  triggerName.dataset.profileName = "";
  triggerName.textContent = profileName;
  const triggerCaption = document.createElement("span");
  triggerCaption.className = "auth-profile-caption";
  triggerCaption.textContent = "Mi cuenta";
  triggerCopy.append(triggerName, triggerCaption);

  const chevron = document.createElement("span");
  chevron.className = "auth-profile-chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "⌄";
  trigger.append(avatar, triggerCopy, chevron);

  const menu = document.createElement("div");
  menu.className = "auth-profile-menu";
  menu.setAttribute("role", "region");
  menu.setAttribute("aria-label", "Opciones de cuenta");
  menu.hidden = true;
  trigger.setAttribute("aria-controls", `auth-profile-menu-${document.querySelectorAll(".auth-profile-menu").length + 1}`);
  menu.id = trigger.getAttribute("aria-controls");
  const summary = document.createElement("div");
  summary.className = "auth-profile-summary";
  const summaryAvatar = avatar.cloneNode(true);
  summaryAvatar.classList.add("auth-profile-avatar--large");
  const summaryCopy = document.createElement("span");
  summaryCopy.className = "auth-profile-summary-copy";
  const summaryName = triggerName.cloneNode(true);
  const summaryEmail = document.createElement("span");
  summaryEmail.className = "auth-profile-email";
  summaryEmail.dataset.profileEmail = "";
  summaryEmail.textContent = user.email || "";
  summaryCopy.append(summaryName, summaryEmail);
  summary.append(summaryAvatar, summaryCopy);

  const purchasesLink = makeLink(purchasesHref, "Mis compras / entradas", "auth-profile-menu-link");
  const logout = document.createElement("button");
  logout.type = "button";
  logout.className = "auth-profile-menu-link auth-profile-signout";
  logout.textContent = "Cerrar sesión";
  logout.addEventListener("click", async () => {
    logout.disabled = true;
    logout.textContent = "Cerrando sesión…";
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      logout.disabled = false;
      logout.textContent = "Cerrar sesión";
      let notice = menu.querySelector(".auth-profile-error");
      if (!notice) {
        notice = document.createElement("span");
        notice.className = "auth-profile-error";
        menu.append(notice);
      }
      notice.textContent = "No se pudo cerrar la sesión. Intentá nuevamente.";
    }
  });
  menu.append(summary, purchasesLink, logout);
  profile.append(trigger, menu);

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.hidden;
    closeProfileMenus();
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (event) => event.stopPropagation());

  container.replaceChildren(profile);
  loadProfileName(user, container);
}

function initialsFor(value) {
  const parts = String(value || "Usuario").trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return (parts.length > 1 ? parts.slice(0, 2).map((part) => part[0]) : [parts[0]?.slice(0, 2) || "U"])
    .join("").toLocaleUpperCase("es");
}

function closeProfileMenus() {
  document.querySelectorAll(".auth-profile-menu:not([hidden])").forEach((menu) => {
    menu.hidden = true;
    menu.parentElement?.querySelector(".auth-profile-trigger")?.setAttribute("aria-expanded", "false");
  });
}

async function loadProfileName(user, container) {
  const { data, error } = await supabase
    .from("perfiles")
    .select("nombre_usuario")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && data?.nombre_usuario && container.isConnected) {
    container.querySelectorAll("[data-profile-name]").forEach((label) => { label.textContent = data.nombre_usuario; });
    container.querySelectorAll("[data-profile-avatar]").forEach((avatar) => { avatar.textContent = initialsFor(data.nombre_usuario); });
    const trigger = container.querySelector(".auth-profile-trigger");
    if (trigger) trigger.setAttribute("aria-label", `Abrir perfil de ${data.nombre_usuario}`);
  }
}

document.addEventListener("click", closeProfileMenus);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProfileMenus();
});

function paintSession(session) {
  if (redirectIfSignedIn && session) {
    window.location.replace(homeHref);
    return;
  }

  document.querySelectorAll("[data-auth-nav]").forEach((container) => {
    if (session?.user) paintSignedIn(container, session.user);
    else paintSignedOut(container);
  });
  document.querySelectorAll(".logout-link").forEach((link) => {
    const item = link.closest(".menu-item");
    if (item) item.hidden = !session?.user;
  });
}

document.querySelectorAll(".logout-link").forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        link.textContent = "No se pudo cerrar sesión";
        return;
      }
      window.location.assign(homeHref);
    } catch {
      link.textContent = "No se pudo cerrar sesión";
    }
  });
});

const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
  // Evita invocar otras llamadas a Supabase dentro del callback de Auth.
  window.setTimeout(() => paintSession(session), 0);
});

const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
if (sessionError) {
  document.querySelectorAll("[data-auth-nav]").forEach((container) => {
    paintSignedOut(container);
    const notice = document.createElement("span");
    notice.className = "auth-nav-error";
    notice.textContent = "No se pudo comprobar la sesión.";
    container.append(notice);
  });
} else {
  paintSession(sessionData.session);
}

export { authListener };
