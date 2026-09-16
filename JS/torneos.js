/* ─── Filtros de categoría ─── */
document.querySelector('.filter-group').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  /* resalta el filtro activo */
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

/* ─── Buscador (filtro en tiempo real) ─── */
document.querySelector('.search-box input').addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('.card-torneo').forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(q) ? '' : 'none';
  });
});
