import { supabase } from "./supabaseClient.js";
import { showAuthMessage } from "./auth.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("auth-message");

async function signInWithUsername(username, password) {
  // Resolve the username from the public profile metadata carried by Auth.
  // The full profile is intentionally not publicly readable under RLS, so the
  // email lookup uses a narrowly scoped RPC rather than a service-role key.
  const { data, error } = await supabase.rpc("email_para_nombre_usuario", {
    nombre_usuario_buscado: username.toLowerCase(),
  });
  if (error) throw error;
  const email = typeof data === "string" ? data : data?.email;
  if (!email) return { error: { code: "invalid_credentials" } };
  return supabase.auth.signInWithPassword({ email, password });
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  const originalLabel = submit.textContent;
  submit.textContent = "Ingresando…";
  showAuthMessage(message, "");

  const identity = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    let error;
    if (identity.includes("@")) {
      ({ error } = await supabase.auth.signInWithPassword({ email: identity, password }));
    } else {
      ({ error } = await signInWithUsername(identity, password));
    }
    if (error) {
      const authCode = (error.code || "").toLowerCase();
      const authMessage = (error.message || "").toLowerCase();
      let detail;

      if (authCode === "invalid_credentials" || authMessage.includes("invalid login credentials")) {
        detail = "El correo o la contraseña no son correctos. Si acabás de registrarte, confirmá tu correo antes de ingresar.";
      } else if (authCode === "email_not_confirmed") {
        detail = "Tu correo todavía no está confirmado. Revisá tu bandeja de entrada y abrí el enlace de confirmación.";
      } else if (authCode === "user_banned") {
        detail = "Esta cuenta está temporalmente bloqueada. Contactá al administrador.";
      } else if (error.status === 429) {
        detail = "Hubo demasiados intentos de inicio de sesión. Esperá un momento y probá de nuevo.";
      } else if (error.status >= 500) {
        detail = "El servicio de inicio de sesión está temporalmente fuera de servicio. Intentá nuevamente más tarde.";
      } else {
        detail = "No se pudo iniciar sesión. Revisá que el correo esté registrado y confirmado; si el problema sigue, contactá al administrador.";
      }
      showAuthMessage(message, detail, "error");
      return;
    }
    window.location.replace("../index.html");
  } catch (cause) {
    const detail = cause.code === "PGRST202" || cause.code === "42883"
      ? "El acceso con nombre de usuario todavía no está configurado. Ingresá con tu correo o contactá al administrador."
      : "No se pudo conectar con el servicio de inicio de sesión. Revisá tu conexión e intentá nuevamente.";
    showAuthMessage(message, detail, "error");
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
});
