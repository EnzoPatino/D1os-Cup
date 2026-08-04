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
    { team: "Deportivo Grasa", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Panchos FC", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Fiorito FC", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Atletico Zarpado", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
  ]},
  { name: "Grupo C", teams: [
    { team: "Camioneros Club", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Team Balanza", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "La Crema", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Lobitos Crew", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
  ]},
  { name: "Grupo D", teams: [
    { team: "Ciclon", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Fuerte Apache", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "Ranita FC", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
    { team: "La Bocha", pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 },
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
            <th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((t,i)=>`
            <tr>
              <td><span class="pos">${i+1}</span>${t.team}</td>
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

// ============ RENDER BRACKET (estilo Mundial) ============
function teamBoxHTML(name, extraClass=''){
  return `
    <div class="team-box ${extraClass}">
      <span class="flag"></span>
      <span>${name}</span>
    </div>`;
}

function matchPairHTML(match, extraClass=''){
  return `
    <div class="match-pair ${extraClass}">
      ${teamBoxHTML(match.teamA)}
      <div class="vs">VS</div>
      ${teamBoxHTML(match.teamB)}
    </div>`;
}

function renderBracketSide(sideData, sideClass){
  return `
    <div class="bracket-side ${sideClass}">
      <div class="round round-cuartos">
        <div class="round-label">Cuartos de Final</div>
        <div class="connector-group">
          <div class="joint"></div>
          ${matchPairHTML(sideData.cuartos[0])}
          ${matchPairHTML(sideData.cuartos[1])}
        </div>
      </div>
      <div class="round round-semi">
        <div class="round-label">Semifinal</div>
        <div class="connector-single">
          ${matchPairHTML(sideData.semi)}
        </div>
      </div>
    </div>`;
}

function renderBracket(){
  const container = document.getElementById('bracketContainer');
  container.innerHTML = `
    ${renderBracketSide(bracketData.left, 'left')}
    <div class="bracket-center">
      <div class="trophy">🏆</div>
      <div class="label">FINAL</div>
      ${matchPairHTML(bracketData.final, 'final-pair')}
      <div class="meta">${bracketData.final.date}<br>${bracketData.final.venue}</div>
    </div>
    ${renderBracketSide(bracketData.right, 'right')}
  `;
}

// ============ TABS ============
function setupTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.view).classList.add('active');
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

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderGroups();
  renderBracket();
  setupTabs();
  setupInlineBack();
});