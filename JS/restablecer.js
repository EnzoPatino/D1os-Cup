import { supabase } from "./supabaseClient.js";
import { showAuthMessage } from "./auth.js";

const form = document.getElementById("passwordResetForm");
const message = document.getElementById("auth-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const password = document.getElementById("password").value;
  const confirmation = document.getElementById("confirmPassword").value;
  if (password.length < 8) {
    showAuthMessage(message, "La contraseña debe tener al menos 8 caracteres.", "error");
    return;
  }
  if (password !== confirmation) {
    showAuthMessage(message, "Las contraseñas no coinciden.", "error");
    return;
  }

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  const originalLabel = submit.textContent;
  submit.textContent = "Guardando…";
  showAuthMessage(message, "");

  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      showAuthMessage(
        message,
        "El enlace venció o ya fue usado. Solicitá uno nuevo para cambiar la contraseña.",
        "error"
      );
      return;
    }
    showAuthMessage(message, "Contraseña actualizada. Te llevamos al inicio…", "success");
    window.setTimeout(() => window.location.replace("../index.html"), 1200);
  } catch {
    showAuthMessage(message, "No se pudo conectar. Revisá tu conexión e intentá nuevamente.", "error");
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
});

