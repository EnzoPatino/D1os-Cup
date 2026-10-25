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
      const authCode = error.code || error.message;
      const detail = authCode === "invalid_credentials" || authCode === "Invalid login credentials"
        ? "El correo o la contraseña no son correctos. Si acabás de registrarte, confirmá tu correo antes de ingresar."
        : "No se pudo iniciar sesión por un problema de conexión o configuración. Intentá nuevamente más tarde.";
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
