import { supabase } from "./supabaseClient.js";
import { showAuthMessage } from "./auth.js";

const form = document.getElementById("resetRequestForm");
const message = document.getElementById("auth-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const email = document.getElementById("email").value.trim();
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  const originalLabel = submit.textContent;
  submit.textContent = "Enviando…";
  showAuthMessage(message, "");

  try {
    const redirectTo = new URL("restablecer.html", window.location.href).toString();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      showAuthMessage(message, "No se pudo enviar el correo de recuperación. Intentá nuevamente.", "error");
      return;
    }
    showAuthMessage(
      message,
      "Si existe una cuenta con ese correo, recibirá un enlace para restablecer la contraseña.",
      "success"
    );
    form.reset();
  } catch {
    showAuthMessage(message, "No se pudo conectar. Revisá tu conexión e intentá nuevamente.", "error");
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
});

