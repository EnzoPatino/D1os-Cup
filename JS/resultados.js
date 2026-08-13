// ============ DATA ============
// Reemplazá estos arrays con los datos reales de tu torneo / backend.

const groups = [
  { name: "Grupo A", teams: [
    { team: "Los Halcones", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "La 10 FC",     pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Talento FC",   pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Los Cracks",   pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
  ]},
  { name: "Grupo B", teams: [
    { team: "Deportivo Grasa",  pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Panchos FC",       pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Fiorito FC",       pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Atletico Zarpado", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
  ]},
  { name: "Grupo C", teams: [
    { team: "Camioneros Club", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Team Balanza",    pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "La Crema",        pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Lobitos Crew",    pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
  ]},
  { name: "Grupo D", teams: [
    { team: "Ciclon",        pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Fuerte Apache", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Ranita FC",     pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "La Bocha",      pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
  ]},
];

// Bracket: cada lado (izq/der) tiene 2 cuartos de final que convergen
// en 1 semifinal. Ambas semis convergen en la final, mostrada al centro.
const bracketData = {
  left: {
    cuartos: [
      { teamA:"Por Confirmar", teamB:"Por Confirmar" },
      { teamA:"Por Confirmar", teamB:"Por Confirmar" },
    ],
    semi: { teamA:"Por Confirmar", teamB:"Por Confirmar" },
  },
  right: {
    cuartos: [
      { teamA:"Por Confirmar", teamB:"Por Confirmar" },
      { teamA:"Por Confirmar", teamB:"Por Confirmar" },
    ],
    semi: { teamA:"Por Confirmar", teamB:"Por Confirmar" },
  },
  final: { teamA:"Por Confirmar", teamB:"Por Confirmar", date:"Dom, 7 Jun - 17:00 hs", venue:"Cancha Principal" }
};

// ============ RENDER GRUPOS ============
function renderGroups(){
  const groupsGrid = document.getElementById('groupsGrid');
  groups.forEach(g => {
    const sorted = [...g.teams].sort((a,b) => b.pts - a.pts || (b.gf-b.gc) - (a.gf-a.gc));
    const card = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `
      <div class="group-header">
        <h3>${g.name}</h3>
        <span class="tag">4 EQUIPOS</span>
      </div>
      <table>
        <thead>
          <tr>
            <th class="col-team">Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((t,i)=>`
            <tr>
              <td class="col-team">
                <div class="team-cell">
                  <span class="pos">${i+1}</span>
                  <span class="team-label" title="${t.team}">${t.team}</span>
                </div>
              </td>
              <td>${t.pj}</td>
              <td>${t.pg}</td>
              <td>${t.pe}</td>
              <td>${t.pp}</td>
              <td>${t.gf}</td>
              <td>${t.gc}</td>
              <td>${t.gf-t.gc}</td>
              <td class="pts">${t.pts}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    `;
    groupsGrid.appendChild(card);
  });
}

// Ícono de copa en SVG propio (no depende de la fuente emoji del sistema)
function trophySVG(){
  return `
    <svg class="trophy-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffd36e"/>
          <stop offset="100%" stop-color="#d4a843"/>
        </linearGradient>
      </defs>
      <path d="M14 6h20v6a10 10 0 0 1-10 10 10 10 0 0 1-10-10V6z" fill="url(#trophyGrad)"/>
      <path d="M14 8H7a1 1 0 0 0-1 1v2a7 7 0 0 0 7 7" fill="none" stroke="url(#trophyGrad)" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M34 8h7a1 1 0 0 1 1 1v2a7 7 0 0 1-7 7" fill="none" stroke="url(#trophyGrad)" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="22" y="22" width="4" height="8" fill="url(#trophyGrad)"/>
      <path d="M15 34h18l-2 6H17l-2-6z" fill="url(#trophyGrad)"/>
      <rect x="12" y="40" width="24" height="4" rx="1.5" fill="url(#trophyGrad)"/>
    </svg>`;
}

// ============ RENDER BRACKET (rediseño estilo transmisión deportiva) ============

// Genera iniciales para el "escudo" del equipo (sin necesidad de imágenes reales)
function crestInitials(name){
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/);
  const letters = words.slice(0, 2).map(w => w[0] || '').join('');
  return (letters || name.slice(0,2)).toUpperCase();
}

function teamBoxHTML(name){
  return `
    <div class="team-box">
      <span class="crest">${crestInitials(name)}</span>
      <span class="team-name">${name}</span>
    </div>`;
}

function matchPairHTML(match, matchNumber, id, extraClass=''){
  return `
    <div class="match-pair ${extraClass}" id="${id}">
      ${matchNumber ? `<span class="match-badge">${matchNumber}</span>` : ''}
      ${teamBoxHTML(match.teamA)}
      <div class="vs">VS</div>
      ${teamBoxHTML(match.teamB)}
    </div>`;
}

function renderBracketSide(sideData, sideClass, ids, nums){
  return `
    <div class="bracket-side ${sideClass}">
      <div class="round round-cuartos">
        <div class="round-label"><span class="round-dot"></span>Cuartos de Final</div>
        <div class="round-matches">
          ${matchPairHTML(sideData.cuartos[0], nums.q1, ids.q1)}
          ${matchPairHTML(sideData.cuartos[1], nums.q2, ids.q2)}
        </div>
      </div>
      <div class="round round-semi">
        <div class="round-label round-label--semi"><span class="round-dot"></span>Semifinal</div>
        <div class="round-matches">
          ${matchPairHTML(sideData.semi, nums.semi, ids.semi)}
        </div>
      </div>
    </div>`;
}

function renderBracket(){
  const container = document.getElementById('bracketContainer');
  container.innerHTML = `
    <svg class="bracket-lines" id="bracketLines"></svg>
    <div class="bracket-tracks">
      ${renderBracketSide(bracketData.left, 'left', {q1:'m1', q2:'m2', semi:'m5'}, {q1:1, q2:2, semi:5})}
      <div class="bracket-center">
        <div class="final-badge">GRAN FINAL</div>
        <div class="trophy-wrap">${trophySVG()}</div>
        ${matchPairHTML(bracketData.final, null, 'mFinal', 'final-pair')}
        <div class="meta">${bracketData.final.date}<br>${bracketData.final.venue}</div>
      </div>
      ${renderBracketSide(bracketData.right, 'right', {q1:'m3', q2:'m4', semi:'m6'}, {q1:3, q2:4, semi:6})}
    </div>
  `;
  drawConnectors();
}

// ============ LÍNEAS DE CONEXIÓN (SVG dinámico) ============
const SVG_NS = 'http://www.w3.org/2000/svg';

function drawConnectors(){
  const container = document.getElementById('bracketContainer');
  const svg = document.getElementById('bracketLines');
  if(!container || !svg) return;
  if(container.offsetParent === null) return; // vista oculta, no medir

  svg.innerHTML = '';
  const cRect = container.getBoundingClientRect();
  const w = container.scrollWidth;
  const h = container.scrollHeight;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  svg.innerHTML = `
    <defs>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#d4a843"/>
        <stop offset="100%" stop-color="#ffd36e"/>
      </linearGradient>
    </defs>`;

  const scrollX = container.scrollLeft;
  const scrollY = container.scrollTop;

  function point(el, edge){
    const r = el.getBoundingClientRect();
    const x = edge === 'right' ? (r.right - cRect.left + scrollX) : (r.left - cRect.left + scrollX);
    const y = (r.top - cRect.top + scrollY) + r.height / 2;
    return { x, y };
  }

  function addCurve(p1, p2){
    const midX = (p1.x + p2.x) / 2;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`);
    path.setAttribute('class', 'bracket-line');
    svg.appendChild(path);
    [p1, p2].forEach(p => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', p.x);
      c.setAttribute('cy', p.y);
      c.setAttribute('r', 3.5);
      c.setAttribute('class', 'bracket-node');
      svg.appendChild(c);
    });
  }

  function connect(childId, parentId, side){
    const child = document.getElementById(childId);
    const parent = document.getElementById(parentId);
    if(!child || !parent) return;
    const exit = point(child, side === 'left' ? 'right' : 'left');
    const entry = point(parent, side === 'left' ? 'left' : 'right');
    addCurve(exit, entry);
  }

  connect('m1', 'm5', 'left');
  connect('m2', 'm5', 'left');
  connect('m5', 'mFinal', 'left');

  connect('m3', 'm6', 'right');
  connect('m4', 'm6', 'right');
  connect('m6', 'mFinal', 'right');
}

// ============ TABS ============
function setupTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.view).classList.add('active');
      if(btn.dataset.view === 'eliminatoria'){
        requestAnimationFrame(drawConnectors);
      }
    });
  });
}

// ============ BOTÓN VOLVER A GRUPOS (dentro de eliminatoria) ============
function setupInlineBack(){
  const volverBtn = document.getElementById('volverAGrupos');
  if(volverBtn){
    volverBtn.addEventListener('click', () => {
      document.querySelector('.tab-btn[data-view="grupos"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============ RESPONSIVE: redibujar líneas al cambiar tamaño ============
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const eliminatoria = document.getElementById('eliminatoria');
    if(eliminatoria && eliminatoria.classList.contains('active')){
      drawConnectors();
    }
  }, 150);
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderGroups();
  renderBracket();
  setupTabs();
  setupInlineBack();
});