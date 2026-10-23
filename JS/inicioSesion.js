import { supabase } from "./supabaseClient.js";
import { showAuthMessage } from "./auth.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("auth-message");

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
      const response = await fetch("/api/username-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identity, password }),
      });
      if (!response.ok && response.status !== 401) {
        throw new Error("Username login service unavailable");
      }
      const session = response.ok ? await response.json() : null;
      if (!session?.access_token || !session?.refresh_token) {
        error = new Error("Invalid login credentials");
      } else {
        ({ error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        }));
      }
    }
    if (error) {
      const detail = error.message === "Invalid login credentials"
        ? "El correo, nombre de usuario o la contraseña no son correctos."
        : "No se pudo iniciar sesión. Revisá tus datos e intentá nuevamente.";
      showAuthMessage(message, detail, "error");
      return;
    }
    window.location.replace("../index.html");
  } catch {
    showAuthMessage(message, "No se pudo conectar. Revisá tu conexión e intentá nuevamente.", "error");
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
});
