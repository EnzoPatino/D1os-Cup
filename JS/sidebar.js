/**
 * D10S Cup - sidebar.js
 * Interacción unificada para barra lateral y responsive en todas las secciones.
 */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

function initSidebar() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!sidebar) return;

  const toggle = (force) => {
    const shouldOpen = force !== undefined ? force : !sidebar.classList.contains('active');
    sidebar.classList.toggle('active', shouldOpen);
    if (overlay) overlay.classList.toggle('active', shouldOpen);
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => toggle(false));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
}
