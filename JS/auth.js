import { supabase } from "./supabaseClient.js";

const isHtmlPage = window.location.pathname.toLowerCase().includes("/html/");
const homeHref = isHtmlPage ? "../index.html" : "index.html";
const loginHref = isHtmlPage ? "incioSesion.html" : "HTML/incioSesion.html";
const registerHref = isHtmlPage ? "Registrarse.html" : "HTML/Registrarse.html";
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
  const name = document.createElement("span");
  name.className = "auth-user-name";
  name.textContent = user.user_metadata?.nombre_usuario || user.email || "Usuario";
  name.setAttribute("aria-label", "Sesión iniciada");

  const logout = document.createElement("button");
  logout.type = "button";
  logout.className = "auth-nav-link auth-nav-logout";
  logout.textContent = "Cerrar sesión";
  logout.addEventListener("click", async () => {
    logout.disabled = true;
    logout.textContent = "Cerrando sesión…";
    const { error } = await supabase.auth.signOut();
    if (error) {
      logout.disabled = false;
      logout.textContent = "Cerrar sesión";
      const notice = document.createElement("span");
      notice.className = "auth-nav-error";
      notice.textContent = "No se pudo cerrar la sesión. Intentá nuevamente.";
      container.append(notice);
    }
  });

  container.replaceChildren(name, logout);
  loadProfileName(user, container);
}

async function loadProfileName(user, container) {
  const { data, error } = await supabase
    .from("perfiles")
    .select("nombre_usuario")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && data?.nombre_usuario && container.isConnected) {
    const label = container.querySelector(".auth-user-name");
    if (label) label.textContent = data.nombre_usuario;
  }
}

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
