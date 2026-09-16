/* ─── Datos de ejemplo ─── */
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

let currentDate = new Date(2026, 6); /* Julio 2026 */

/* ─── Renderiza el calendario ─── */
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  /* Actualiza título */
  document.getElementById('cal-month').textContent = `${MONTHS[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay(); /* 0=Dom */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  /* Ajuste: lunes como primer día (lun=0, dom=6) */
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const grid = document.getElementById('cal-grid');
  /* Conserva los encabezados (primeros 7 hijos) */
  while (grid.children.length > 7) grid.removeChild(grid.lastChild);

  const today = new Date();

  /* Días del mes anterior */
  for (let i = offset - 1; i >= 0; i--) {
    grid.append(createDayCell(daysInPrev - i, true, false));
  }

  /* Días del mes actual */
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
    grid.append(createDayCell(d, false, isToday));
  }

  /* Días del mes siguiente para completar la última semana */
  const total = grid.children.length - 7;
  const remainder = 7 - (total % 7);
  if (remainder < 7) {
    for (let d = 1; d <= remainder; d++) {
      grid.append(createDayCell(d, true, false));
    }
  }
}

/* ─── Crea una celda de día ─── */
function createDayCell(day, other, isToday) {
  const div = document.createElement('div');
  div.className = `cal-day${other ? ' cal-day--other' : ''}${isToday ? ' cal-day--today' : ''}`;

  const num = document.createElement('div');
  num.className = 'day-num';
  num.textContent = day;
  div.append(num);

  /* Eventos demo (solo días del mes actual con datos de ejemplo) */
  if (!other && (day === 5 || day === 12)) {
    const ev = document.createElement('div');
    ev.className = 'cal-event';
    ev.textContent = day === 5 ? 'LR vs FC 20:30' : 'AD vs RB 18:00';
    div.append(ev);
  }
  if (!other && day === 15) {
    const ev = document.createElement('div');
    ev.className = 'cal-event';
    ev.textContent = 'LR vs FC 20:30';
    div.append(ev);
  }
  if (!other && day === 19) {
    const ev = document.createElement('div');
    ev.className = 'cal-event';
    ev.textContent = 'AD vs UN 18:00';
    div.append(ev);
  }
  if (!other && day === 26) {
    const ev = document.createElement('div');
    ev.className = 'cal-event';
    ev.textContent = 'FC vs DC 20:30';
    div.append(ev);
  }

  return div;
}

/* ─── Nav del calendario ─── */
document.getElementById('cal-prev').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});
document.getElementById('cal-next').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

/* ─── Nav de carrusel (desplaza scroll) ─── */
document.getElementById('carousel-prev').addEventListener('click', () => {
  document.querySelector('.carousel').scrollBy({ left: -320, behavior: 'smooth' });
});
document.getElementById('carousel-next').addEventListener('click', () => {
  document.querySelector('.carousel').scrollBy({ left: 320, behavior: 'smooth' });
});

/* ─── Init ─── */
renderCalendar(currentDate);
