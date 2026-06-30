// ============ DATA ============
// Reemplazá estos arrays con los datos reales de tu torneo / backend.

const groups = [
  { name: "Grupo A", teams: [
    { team: "Los Halcones", pj:0, pg:2, pe:1, pp:0, gf:6, gc:2, pts:7 },
    { team: "La 10 FC",     pj:3, pg:2, pe:0, pp:1, gf:5, gc:3, pts:6 },
    { team: "Talento FC",   pj:3, pg:1, pe:0, pp:2, gf:3, gc:5, pts:3 },
    { team: "Los Cracks",   pj:3, pg:0, pe:1, pp:2, gf:2, gc:6, pts:1 },
  ]},
  { name: "Grupo B", teams: [
    { team: "Equipo B1", pj:3, pg:3, pe:0, pp:0, gf:8, gc:1, pts:9 },
    { team: "Equipo B2", pj:3, pg:1, pe:1, pp:1, gf:4, gc:4, pts:4 },
    { team: "Equipo B3", pj:3, pg:1, pe:0, pp:2, gf:3, gc:5, pts:3 },
    { team: "Equipo B4", pj:3, pg:0, pe:1, pp:2, gf:1, gc:6, pts:1 },
  ]},
  { name: "Grupo C", teams: [
    { team: "Equipo C1", pj:3, pg:2, pe:0, pp:1, gf:5, gc:4, pts:6 },
    { team: "Equipo C2", pj:3, pg:2, pe:0, pp:1, gf:4, gc:3, pts:6 },
    { team: "Equipo C3", pj:3, pg:1, pe:1, pp:1, gf:3, gc:3, pts:4 },
    { team: "Equipo C4", pj:3, pg:0, pe:1, pp:2, gf:2, gc:4, pts:1 },
  ]},
  { name: "Grupo D", teams: [
    { team: "Equipo D1", pj:3, pg:2, pe:1, pp:0, gf:7, gc:2, pts:7 },
    { team: "Equipo D2", pj:3, pg:1, pe:2, pp:0, gf:5, gc:3, pts:5 },
    { team: "Equipo D3", pj:3, pg:1, pe:0, pp:2, gf:3, gc:5, pts:3 },
    { team: "Equipo D4", pj:3, pg:0, pe:1, pp:2, gf:1, gc:6, pts:1 },
  ]},
  { name: "Grupo E", teams: [
    { team: "Equipo E1", pj:3, pg:2, pe:1, pp:0, gf:6, gc:3, pts:7 },
    { team: "Equipo E2", pj:3, pg:1, pe:1, pp:1, gf:4, gc:4, pts:4 },
    { team: "Equipo E3", pj:3, pg:1, pe:1, pp:1, gf:3, gc:3, pts:4 },
    { team: "Equipo E4", pj:3, pg:0, pe:1, pp:2, gf:2, gc:5, pts:1 },
  ]},
  { name: "Grupo F", teams: [
    { team: "Equipo F1", pj:3, pg:3, pe:0, pp:0, gf:9, gc:1, pts:9 },
    { team: "Equipo F2", pj:3, pg:2, pe:0, pp:1, gf:5, gc:4, pts:6 },
    { team: "Equipo F3", pj:3, pg:1, pe:0, pp:2, gf:3, gc:5, pts:3 },
    { team: "Equipo F4", pj:3, pg:0, pe:0, pp:3, gf:1, gc:8, pts:0 },
  ]},
  { name: "Grupo G", teams: [
    { team: "Equipo G1", pj:3, pg:2, pe:0, pp:1, gf:6, gc:5, pts:6 },
    { team: "Equipo G2", pj:3, pg:2, pe:0, pp:1, gf:5, gc:4, pts:6 },
    { team: "Equipo G3", pj:3, pg:1, pe:0, pp:2, gf:4, gc:5, pts:3 },
    { team: "Equipo G4", pj:3, pg:1, pe:0, pp:2, gf:3, gc:4, pts:3 },
  ]},
  { name: "Grupo H", teams: [
    { team: "Equipo H1", pj:3, pg:2, pe:1, pp:0, gf:5, gc:2, pts:7 },
    { team: "Equipo H2", pj:3, pg:1, pe:2, pp:0, gf:4, gc:3, pts:5 },
    { team: "Equipo H3", pj:3, pg:1, pe:0, pp:2, gf:3, gc:4, pts:3 },
    { team: "Equipo H4", pj:3, pg:0, pe:1, pp:2, gf:2, gc:5, pts:1 },
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
function teamBoxHTML(name){
  return `
    <div class="team-box">
      <span class="flag"></span>
      <span>${name}</span>
    </div>`;
}

function matchPairHTML(match){
  return `
    <div class="match-pair">
      ${teamBoxHTML(match.teamA)}
      ${teamBoxHTML(match.teamB)}
    </div>`;
}

function renderBracketSide(sideData, sideClass){
  return `
    <div class="bracket-side ${sideClass}">
      <div class="round round-cuartos">
        <div class="connector-group">
          ${matchPairHTML(sideData.cuartos[0])}
          ${matchPairHTML(sideData.cuartos[1])}
        </div>
      </div>
      <div class="round round-semi">
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
      ${matchPairHTML(bracketData.final)}
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

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderGroups();
  renderBracket();
  setupTabs();
});