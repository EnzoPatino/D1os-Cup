/* Interactividad: menú responsive, scroll suave, validación de formulario. */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. Menú hamburguesa */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  /* 2. Scroll suave y enlace activo */
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      /* Solo interceptar anclas internas (#inicio, #contactos) */
      if (!targetId?.startsWith('#')) return;

      e.preventDefault();

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      /* Cerrar menú mobile si está abierto */
      if (navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle?.classList.remove('active');
      }

      /* Marcar enlace activo */
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* 3. Validación del formulario de contacto */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nombreInput  = document.getElementById('nombre');
    const emailInput   = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const errorNombre  = document.getElementById('error-nombre');
    const errorEmail   = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');

    const mostrarError = (errorEl, inputEl) => {
      errorEl.style.display = 'block';
      inputEl.classList.add('input-error');
    };

    const limpiarError = (errorEl, inputEl) => {
      errorEl.style.display = 'none';
      inputEl.classList.remove('input-error');
    };

    /* Validación en tiempo real */
    const validacionEnVivo = [
      { input: nombreInput,  error: errorNombre,  valido: (val) => val.trim() !== '' },
      { input: emailInput,   error: errorEmail,   valido: (val) => val.includes('@') && val.includes('.') },
      { input: mensajeInput, error: errorMensaje, valido: (val) => val.trim().length >= 10 }
    ];

    validacionEnVivo.forEach(({ input, error, valido }) => {
      input.addEventListener('input', function () {
        if (valido(this.value)) limpiarError(error, this);
      });
    });

    /* Validación completa al enviar */
    const validarFormulario = () => {
      let esValido = true;

      if (!nombreInput.value.trim()) {
        mostrarError(errorNombre, nombreInput); esValido = false;
      } else {
        limpiarError(errorNombre, nombreInput);
      }

      const emailVal = emailInput.value.trim();
      if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
        mostrarError(errorEmail, emailInput); esValido = false;
      } else {
        limpiarError(errorEmail, emailInput);
      }

      if (!mensajeInput.value.trim() || mensajeInput.value.trim().length < 10) {
        mostrarError(errorMensaje, mensajeInput); esValido = false;
      } else {
        limpiarError(errorMensaje, mensajeInput);
      }

      return esValido;
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validarFormulario()) {
        alert('¡Mensaje enviado con éxito!');
        contactForm.reset();
      }
    });
  }

});
