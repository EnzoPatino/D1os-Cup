import { supabase } from "./supabaseClient.js";
import { showAuthMessage } from "./auth.js";

const form = document.getElementById("registerForm");
const message = document.getElementById("auth-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const nombre_usuario = document.getElementById("username").value.trim().toLowerCase();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmation = document.getElementById("confirmPassword").value;

  if (!nombre_usuario) {
    showAuthMessage(message, "Ingresá tu nombre de usuario.", "error");
    return;
  }
  if (!/^[a-z0-9._-]{3,30}$/.test(nombre_usuario)) {
    showAuthMessage(message, "El nombre debe tener de 3 a 30 caracteres: letras sin acento, números, punto, guion o guion bajo.", "error");
    return;
  }
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
  submit.textContent = "Creando cuenta…";
  showAuthMessage(message, "");

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre_usuario } },
    });

    if (error) {
      showAuthMessage(message, "No se pudo crear la cuenta. Verificá el correo y probá con otra contraseña.", "error");
      return;
    }
    if (data.session) {
      window.location.replace("../index.html");
      return;
    }
    showAuthMessage(
      message,
      "Cuenta creada. Revisá tu correo para confirmar el registro y luego iniciá sesión.",
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
