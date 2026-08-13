document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que se recargue la página

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Ingresa un correo electrónico válido.");
      return;
    }

    // Simulación de login exitoso
    alert("Inicio de sesión exitoso 🎉");
    window.location.href = "dashboard.html"; // Redirige a otra página
  });
});
