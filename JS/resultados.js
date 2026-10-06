import { supabase } from "./supabaseClient.js";

const groupsGrid = document.getElementById("groupsGrid");
const bracketContainer = document.getElementById("bracketContainer");
const phases = ["cuartos", "semifinal", "final"];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
}

function setEmpty(container, message, error = false) {
  const notice = element("p", "data-status", message);
  notice.dataset.kind = error ? "error" : "info";
  container.replaceChildren(notice);
}

function createGroupTable(groupName, entries, teamNames) {
  const card = element("section", "group-card");
  const heading = element("div", "group-header");
  heading.append(element("h3", "", groupName), element("span", "tag", `${entries.length} equipos`));
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const title of ["Equipo", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "Pts"]) headerRow.append(element("th", "", title));
  thead.append(headerRow);
  const tbody = document.createElement("tbody");
  const ordered = [...entries].sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf);
  ordered.forEach((row, index) => {
    const tr = document.createElement("tr");
    const team = element("td", "col-team");
    const cell = element("div", "team-cell");
    cell.append(element("span", "pos", index + 1), element("span", "team-label", teamNames.get(row.equipo_id) || "Equipo"));
    team.append(cell);
    tr.append(team);
    for (const value of [row.pj, row.g, row.e, row.p, row.gf, row.gc, row.dif]) tr.append(element("td", "", value));
    tr.append(element("td", "pts", row.pts));
    tbody.append(tr);
  });
  table.append(thead, tbody);
  card.append(heading, table);
  return card;
}

function renderGroups(positions, groups, teams) {
  if (!positions.length) return setEmpty(groupsGrid, "Todavía no hay posiciones disponibles.");
  const groupNames = new Map(groups.map((group) => [group.id, group.nombre]));
  const teamNames = new Map(teams.map((team) => [team.id, team.nombre]));
  const byGroup = new Map();
  for (const row of positions) byGroup.set(row.grupo_id, [...(byGroup.get(row.grupo_id) || []), row]);
  const sections = [...byGroup.entries()]
    .sort((a, b) => (groupNames.get(a[0]) || "").localeCompare(groupNames.get(b[0]) || "", "es"))
    .map(([id, rows]) => createGroupTable(groupNames.get(id) || "Grupo", rows, teamNames));
  groupsGrid.replaceChildren(...sections);
}

function teamInitials(name) {
  const words = (name || "Por confirmar").replace(/[^\p{L}\p{N}\s]/gu, "").trim().split(/\s+/);
  return words.slice(0, 2).map((word) => word[0] || "").join("").toLocaleUpperCase("es") || "??";
}

function createTeamBox(name) {
  const team = element("div", "team-box");
  team.append(element("span", "crest", teamInitials(name)), element("span", "team-name", name || "Por confirmar"));
  return team;
}

function bracketMatch(match, number, id, extraClass = "") {
  const pair = element("article", `match-pair ${extraClass}`.trim());
  pair.id = id;
  if (number) pair.append(element("span", "match-badge", number));
  pair.append(createTeamBox(match?.equipo_local?.nombre), element("div", "vs", match?.estado === "jugado"
    ? `${match.goles_local ?? 0} – ${match.goles_visitante ?? 0}`
    : "VS"), createTeamBox(match?.equipo_visitante?.nombre));

  if (match) {
    const date = match.fecha_hora
      ? new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(match.fecha_hora))
      : "Fecha a confirmar";
    const detail = element("div", extraClass ? "meta" : "match-meta", [date, match.cancha, match.estadio].filter(Boolean).join(" · "));
    pair.append(detail);
  }
  return pair;
}

function roundLabel(text, semi = false) {
  const label = element("div", `round-label${semi ? " round-label--semi" : ""}`);
  label.append(element("span", "round-dot"), document.createTextNode(text));
  return label;
}

function bracketRound(title, games, ids, numbers, semi = false) {
  const round = element("div", `round ${semi ? "round-semi" : "round-cuartos"}`);
  const list = element("div", "round-matches");
  round.append(roundLabel(title, semi));
  games.forEach((match, index) => list.append(bracketMatch(match, numbers[index], ids[index])));
  round.append(list);
  return round;
}

function bracketSide(quarterMatches, semiMatch, side) {
  const isLeft = side === "left";
  const wrapper = element("div", `bracket-side ${side}`);
  const quarterIds = isLeft ? ["m1", "m2"] : ["m3", "m4"];
  const quarterNumbers = isLeft ? [1, 2] : [3, 4];
  wrapper.append(
    bracketRound("Cuartos de Final", quarterMatches, quarterIds, quarterNumbers),
    bracketRound("Semifinal", [semiMatch], [isLeft ? "m5" : "m6"], [isLeft ? 5 : 6], true)
  );
  return wrapper;
}

function trophyIcon() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "trophy-icon");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("aria-hidden", "true");
  const defs = document.createElementNS(ns, "defs");
  const gradient = document.createElementNS(ns, "linearGradient");
  gradient.setAttribute("id", "trophyGrad");
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", "0");
  gradient.setAttribute("x2", "0");
  gradient.setAttribute("y2", "1");
  for (const [offset, color] of [["0%", "#ffd36e"], ["100%", "#d4a843"]]) {
    const stop = document.createElementNS(ns, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    gradient.append(stop);
  }
  defs.append(gradient);
  svg.append(defs);
  const paths = [
    ["path", "M14 6h20v6a10 10 0 0 1-10 10 10 10 0 0 1-10-10V6z", "url(#trophyGrad)", null],
    ["path", "M14 8H7a1 1 0 0 0-1 1v2a7 7 0 0 0 7 7", "none", "url(#trophyGrad)"],
    ["path", "M34 8h7a1 1 0 0 1 1 1v2a7 7 0 0 1-7 7", "none", "url(#trophyGrad)"],
    ["rect", null, "url(#trophyGrad)", null, { x: "22", y: "22", width: "4", height: "8" }],
    ["path", "M15 34h18l-2 6H17l-2-6z", "url(#trophyGrad)", null],
    ["rect", null, "url(#trophyGrad)", null, { x: "12", y: "40", width: "24", height: "4", rx: "1.5" }],
  ];
  for (const [tag, d, fill, stroke, attributes = {}] of paths) {
    const shape = document.createElementNS(ns, tag);
    if (d) shape.setAttribute("d", d);
    if (fill) shape.setAttribute("fill", fill);
    if (stroke) {
      shape.setAttribute("stroke", stroke);
      shape.setAttribute("stroke-width", "2.4");
      shape.setAttribute("stroke-linecap", "round");
    }
    for (const [name, value] of Object.entries(attributes)) shape.setAttribute(name, value);
    svg.append(shape);
  }
  return svg;
}

function drawConnectors() {
  const container = document.getElementById("bracketContainer");
  const svg = document.getElementById("bracketLines");
  if (!container || !svg || !document.getElementById("eliminatoria")?.classList.contains("active")) return;

  const width = container.scrollWidth;
  const height = container.scrollHeight;
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren();
  const ns = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(ns, "defs");
  const gradient = document.createElementNS(ns, "linearGradient");
  gradient.setAttribute("id", "lineGrad");
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", "0");
  gradient.setAttribute("x2", "1");
  gradient.setAttribute("y2", "0");
  for (const [offset, color] of [["0%", "#d4a843"], ["100%", "#ffd36e"]]) {
    const stop = document.createElementNS(ns, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    gradient.append(stop);
  }
  defs.append(gradient);
  svg.append(defs);

  const containerRect = container.getBoundingClientRect();
  const point = (match, edge) => {
    const rect = match.getBoundingClientRect();
    return {
      x: (edge === "right" ? rect.right : rect.left) - containerRect.left + container.scrollLeft,
      y: rect.top - containerRect.top + container.scrollTop + rect.height / 2,
    };
  };
  const connect = (childId, parentId, side) => {
    const child = document.getElementById(childId);
    const parent = document.getElementById(parentId);
    if (!child || !parent) return;
    const start = point(child, side === "left" ? "right" : "left");
    const end = point(parent, side === "left" ? "left" : "right");
    const midX = (start.x + end.x) / 2;
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`);
    path.setAttribute("class", "bracket-line");
    svg.append(path);
    for (const pointValue of [start, end]) {
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", pointValue.x);
      circle.setAttribute("cy", pointValue.y);
      circle.setAttribute("r", "3.5");
      circle.setAttribute("class", "bracket-node");
      svg.append(circle);
    }
  };

  connect("m1", "m5", "left");
  connect("m2", "m5", "left");
  connect("m5", "mFinal", "left");
  connect("m3", "m6", "right");
  connect("m4", "m6", "right");
  connect("m6", "mFinal", "right");
}

function renderBracket(matches) {
  if (!matches.length) return setEmpty(bracketContainer, "Todavía no hay partidos de fase eliminatoria.");
  const quarterMatches = matches.filter((match) => match.fase === "cuartos");
  const semiMatches = matches.filter((match) => match.fase === "semifinal");
  const finalMatch = matches.find((match) => match.fase === "final") || null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "bracket-lines");
  svg.id = "bracketLines";
  svg.setAttribute("aria-hidden", "true");
  const tracks = element("div", "bracket-tracks");
  tracks.append(
    bracketSide([quarterMatches[0] || null, quarterMatches[1] || null], semiMatches[0] || null, "left")
  );

  const center = element("div", "bracket-center");
  center.append(element("div", "final-badge", "GRAN FINAL"));
  const trophy = element("div", "trophy-wrap");
  trophy.append(trophyIcon());
  center.append(trophy, bracketMatch(finalMatch, null, "mFinal", "final-pair"));
  tracks.append(center);
  tracks.append(bracketSide([quarterMatches[2] || null, quarterMatches[3] || null], semiMatches[1] || null, "right"));
  bracketContainer.replaceChildren(svg, tracks);
  window.requestAnimationFrame(drawConnectors);
}

async function loadResults() {
  setEmpty(groupsGrid, "Cargando posiciones…");
  setEmpty(bracketContainer, "Cargando llave eliminatoria…");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const [positionResult, groupResult, teamResult, matchResult] = await Promise.all([
      supabase.from("tabla_posiciones").select("grupo_id,equipo_id,pj,g,e,p,gf,gc,dif,pts").order("pts", { ascending: false }).order("dif", { ascending: false }).order("gf", { ascending: false }).abortSignal(controller.signal),
      supabase.from("grupos").select("id,nombre").abortSignal(controller.signal),
      supabase.from("equipos").select("id,nombre").abortSignal(controller.signal),
      supabase.from("partidos").select("id,fase,estado,fecha_hora,cancha,estadio,goles_local,goles_visitante,equipo_local:equipos!partidos_equipo_local_id_fkey(nombre),equipo_visitante:equipos!partidos_equipo_visitante_id_fkey(nombre)").in("fase", phases).order("fecha_hora", { ascending: true }).order("id", { ascending: true }).abortSignal(controller.signal),
    ]);
    const failure = [positionResult, groupResult, teamResult, matchResult].find((result) => result.error);
    if (failure) throw failure.error;
    renderGroups(positionResult.data || [], groupResult.data || [], teamResult.data || []);
    renderBracket(matchResult.data || []);
  } catch {
    setEmpty(groupsGrid, "No se pudieron cargar las posiciones. Revisá tu conexión e intentá nuevamente.", true);
    setEmpty(bracketContainer, "No se pudo cargar la llave eliminatoria.", true);
  } finally {
    window.clearTimeout(timeout);
  }
}

document.querySelectorAll(".tab-btn").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".tab-btn").forEach((tab) => tab.classList.toggle("active", tab === button));
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === button.dataset.view));
  if (button.dataset.view === "eliminatoria") window.requestAnimationFrame(drawConnectors);
}));
let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => window.requestAnimationFrame(drawConnectors), 150);
});
document.getElementById("volverAGrupos")?.addEventListener("click", () => document.querySelector('.tab-btn[data-view="grupos"]').click());
loadResults();
