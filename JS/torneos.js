import { supabase } from "./supabaseClient.js";

const grid = document.getElementById("torneos-grid");
const status = document.getElementById("torneos-status");
const search = document.getElementById("torneo-search");
const filters = [...document.querySelectorAll(".filter-btn[data-modalidad]")];
const createButton = document.getElementById("new-tournament-button");
const dialog = document.getElementById("new-tournament-dialog");
const form = document.getElementById("new-tournament-form");
const formStatus = document.getElementById("new-tournament-status");
let tournaments = [];
let modality = "todos";

const labels = {
  futbol_11: "Fútbol 11",
  futbol_8: "Fútbol 8",
  futbol_5: "Fútbol 5",
};

function setStatus(message, kind = "info") {
  status.textContent = message;
  status.dataset.kind = kind;
  status.hidden = !message;
}

function dateLabel(value) {
  if (!value) return "A confirmar";
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function makeMeta(label, value) {
  const row = document.createElement("div");
  row.className = "meta-row";
  const name = document.createElement("strong");
  name.textContent = `${label}: `;
  row.append(name, document.createTextNode(value));
  return row;
}

function tournamentCard(tournament) {
  const card = document.createElement("article");
  card.className = "card card-torneo";
  const badge = document.createElement("span");
  badge.className = `badge ${tournament.estado === "inscripciones_abiertas" ? "badge--gold" : tournament.estado === "en_curso" ? "badge--blue" : "badge--green"}`;
  badge.textContent = tournament.estado === "inscripciones_abiertas" ? "Inscripción abierta" : tournament.estado === "en_curso" ? "En curso" : "Finalizado";

  const title = document.createElement("h3");
  title.textContent = `${labels[tournament.modalidad] || "Fútbol"} · ${tournament.nombre}`;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.append(makeMeta("Inicio", dateLabel(tournament.fecha_inicio)), makeMeta("Cupo", `${tournament.cupo_equipos} equipos`));
  if (tournament.premio) meta.append(makeMeta("Premio", tournament.premio));
  card.append(badge, title, meta);
  return card;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase("es");
  const filtered = tournaments.filter((item) =>
    (modality === "todos" || item.modalidad === modality) &&
    `${item.nombre} ${labels[item.modalidad] || ""}`.toLocaleLowerCase("es").includes(query)
  );
  grid.replaceChildren(...filtered.map(tournamentCard));
  setStatus(filtered.length ? "" : tournaments.length ? "No hay torneos que coincidan con la búsqueda." : "Todavía no hay torneos publicados.");
}

async function loadTournaments() {
  setStatus("Cargando torneos…");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const { data, error } = await supabase
      .from("torneos")
      .select("id,nombre,modalidad,estado,fecha_inicio,cupo_equipos,premio")
      .order("fecha_inicio", { ascending: true, nullsFirst: false })
      .abortSignal(controller.signal);
    if (error) throw error;
    tournaments = data || [];
    render();
  } catch {
    setStatus("No se pudieron cargar los torneos. Revisá tu conexión e intentá nuevamente.", "error");
  } finally {
    window.clearTimeout(timeout);
  }
}

async function checkAdmin(user) {
  if (!user) {
    createButton.hidden = true;
    return;
  }
  try {
    const { data, error } = await supabase.from("perfiles").select("rol").eq("id", user.id).maybeSingle();
    createButton.hidden = Boolean(error) || data?.rol !== "admin";
  } catch {
    createButton.hidden = true;
  }
}

filters.forEach((button) => button.addEventListener("click", () => {
  modality = button.dataset.modalidad;
  filters.forEach((filter) => filter.classList.toggle("active", filter === button));
  render();
}));
search.addEventListener("input", render);

createButton.addEventListener("click", () => {
  form.reset();
  formStatus.textContent = "";
  dialog.showModal();
});
document.getElementById("cancel-new-tournament").addEventListener("click", () => dialog.close());
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  formStatus.textContent = "Creando torneo…";
  const values = new FormData(form);
  const row = {
    nombre: String(values.get("nombre")).trim(),
    modalidad: values.get("modalidad"),
    estado: values.get("estado"),
    fecha_inicio: values.get("fecha_inicio") || null,
    cupo_equipos: Number(values.get("cupo_equipos")),
    premio: String(values.get("premio") || "").trim() || null,
  };
  try {
    const { error } = await supabase.from("torneos").insert(row);
    if (error) throw error;
    dialog.close();
    await loadTournaments();
  } catch {
    formStatus.textContent = "No se pudo crear el torneo. Revisá los datos y tus permisos de administrador.";
    formStatus.dataset.kind = "error";
  } finally {
    submit.disabled = false;
  }
});

supabase.auth.getSession().then(({ data }) => checkAdmin(data.session?.user));
supabase.auth.onAuthStateChange((_event, session) => {
  window.setTimeout(() => checkAdmin(session?.user), 0);
});
loadTournaments();
