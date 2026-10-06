import { supabase } from "./supabaseClient.js";

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const matchList = document.getElementById("scheduled-matches");
const status = document.getElementById("partidos-status");
const calendar = document.getElementById("cal-grid");
const monthLabel = document.getElementById("cal-month");
let matches = [];
let currentDate = new Date();

function setStatus(message, kind = "info") {
  status.textContent = message;
  status.dataset.kind = kind;
  status.hidden = !message;
}

function initials(value) {
  return (value || "?").trim().split(/\s+/).slice(0, 2).map((part) => part.slice(0, 1)).join("").toLocaleUpperCase("es");
}

function dateValue(match) {
  return match.fecha_hora ? new Date(match.fecha_hora) : null;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function matchDateKey(match) {
  const date = dateValue(match);
  return date ? dateKey(date) : "";
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat("es-AR", options).format(date);
}

function createTeam(name) {
  const wrapper = document.createElement("div");
  wrapper.className = "match-team";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = initials(name);
  const label = document.createElement("span");
  label.className = "name";
  label.textContent = name || "Por confirmar";
  wrapper.append(avatar, label);
  return wrapper;
}

function matchCard(match) {
  const card = document.createElement("article");
  card.className = "match-card";
  const teams = document.createElement("div");
  teams.className = "match-teams";
  const vs = document.createElement("span");
  vs.className = "match-vs";
  vs.textContent = "VS";
  teams.append(createTeam(match.equipo_local?.nombre), vs, createTeam(match.equipo_visitante?.nombre));

  const info = document.createElement("div");
  info.className = "match-info";
  const kickoff = document.createElement("div");
  kickoff.className = "meta-row";
  const date = dateValue(match);
  kickoff.textContent = date ? formatDate(date, { dateStyle: "medium", timeStyle: "short" }) : "Fecha a confirmar";
  const venue = document.createElement("div");
  venue.className = "meta-row";
  venue.textContent = [match.cancha, match.estadio].filter(Boolean).join(" · ") || "Cancha a confirmar";
  info.append(kickoff, venue);

  const actions = document.createElement("div");
  actions.className = "match-actions";
  const buy = document.createElement("a");
  buy.href = "productos.html?filter=entradas";
  buy.className = "btn-primary match-btn";
  buy.textContent = "Ver entradas";
  actions.append(buy);
  card.append(teams, info, actions);
  return card;
}

function renderMatches() {
  matchList.replaceChildren(...matches.map(matchCard));
  setStatus(matches.length ? "" : "No hay partidos programados por el momento.");
}

function createDayCell(day, otherMonth = false, isToday = false, dayMatches = []) {
  const cell = document.createElement("div");
  cell.className = `cal-day${otherMonth ? " cal-day--other" : ""}${isToday ? " cal-day--today" : ""}`;
  const number = document.createElement("div");
  number.className = "day-num";
  number.textContent = day;
  cell.append(number);
  for (const match of dayMatches.slice(0, 2)) {
    const event = document.createElement("div");
    event.className = "cal-event";
    const date = dateValue(match);
    const time = date ? formatDate(date, { hour: "2-digit", minute: "2-digit" }) : "";
    event.textContent = `${match.equipo_local?.nombre || "Por confirmar"} vs ${match.equipo_visitante?.nombre || "Por confirmar"}${time ? ` ${time}` : ""}`;
    cell.append(event);
  }
  if (dayMatches.length > 2) {
    const more = document.createElement("div");
    more.className = "cal-event cal-event--more";
    more.textContent = `+${dayMatches.length - 2} partidos`;
    cell.append(more);
  }
  return cell;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthLabel.textContent = `${monthNames[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const headers = [...calendar.children].slice(0, 7);
  calendar.replaceChildren(...headers);
  const matchesByDay = new Map();
  for (const match of matches) {
    const key = matchDateKey(match);
    if (key) matchesByDay.set(key, [...(matchesByDay.get(key) || []), match]);
  }
  const today = new Date();
  for (let i = offset - 1; i >= 0; i--) calendar.append(createDayCell(daysInPrev - i, true));
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(date);
    const isToday = key === dateKey(today);
    calendar.append(createDayCell(day, false, isToday, matchesByDay.get(key) || []));
  }
  const cells = calendar.children.length - headers.length;
  const remainder = (7 - (cells % 7)) % 7;
  for (let day = 1; day <= remainder; day++) calendar.append(createDayCell(day, true));
}

async function loadMatches() {
  setStatus("Cargando partidos…");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const { data, error } = await supabase
      .from("partidos")
      .select("id,fecha_hora,cancha,estadio,fase,equipo_local:equipos!partidos_equipo_local_id_fkey(nombre),equipo_visitante:equipos!partidos_equipo_visitante_id_fkey(nombre)")
      .eq("estado", "programado")
      .order("fecha_hora", { ascending: true })
      .abortSignal(controller.signal);
    if (error) throw error;
    matches = data || [];
    const first = matches.find((match) => dateValue(match));
    if (first) {
      const date = dateValue(first);
      currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    renderMatches();
    renderCalendar();
  } catch {
    matches = [];
    renderCalendar();
    setStatus("No se pudieron cargar los partidos. Revisá tu conexión e intentá nuevamente.", "error");
  } finally {
    window.clearTimeout(timeout);
  }
}

document.getElementById("cal-prev").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById("cal-next").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
document.getElementById("carousel-prev").addEventListener("click", () => matchList.scrollBy({ left: -320, behavior: "smooth" }));
document.getElementById("carousel-next").addEventListener("click", () => matchList.scrollBy({ left: 320, behavior: "smooth" }));

loadMatches();
