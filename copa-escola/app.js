const STORAGE_KEY = "apiex-copa-integracao-v1";

const initialChampionship = () => ({
  quarter: [
    match("Aurora", "Horizonte", 2, 1, "Q1", "Qua · 15h30"),
    match("Vértice", "Norte", 3, 0, "Q2", "Qua · 16h15"),
    match("Impulso", "Pioneiros", null, null, "Q3", "Qui · 15h30"),
    match("Guardiões", "Conexão", null, null, "Q4", "Qui · 16h15"),
  ],
  semi: [match(null, null, null, null, "S1", "Sex · 15h30"), match(null, null, null, null, "S2", "Sex · 16h15")],
  final: [match(null, null, null, null, "F1", "Sáb · 10h00")],
});

let championship = loadChampionship();
let activeStage = "quarter";

const stageLabels = { quarter: "quartas de final", semi: "semifinais", final: "final" };
const stageOrder = ["quarter", "semi", "final"];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#save-current-stage").addEventListener("click", saveStage);
  document.querySelector("#reset-championship").addEventListener("click", resetChampionship);
  normalizeBracket();
  render();
});

function match(home, away, homeScore, awayScore, id, date) {
  return { id, home, away, homeScore, awayScore, date, warning: "" };
}

function loadChampionship() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.quarter && saved.semi && saved.final ? saved : initialChampionship();
  } catch {
    return initialChampionship();
  }
}

function saveChampionship() { localStorage.setItem(STORAGE_KEY, JSON.stringify(championship)); }

function normalizeBracket() {
  const qWinners = championship.quarter.map(winnerOf);
  setParticipants("semi", 0, qWinners[0], qWinners[1]);
  setParticipants("semi", 1, qWinners[2], qWinners[3]);
  const sWinners = championship.semi.map(winnerOf);
  setParticipants("final", 0, sWinners[0], sWinners[1]);

  if (championship.quarter.every(hasWinner)) activeStage = championship.semi.every(hasWinner) ? "final" : "semi";
  else activeStage = "quarter";
}

function setParticipants(stage, index, home, away) {
  const target = championship[stage][index];
  if (target.home !== home || target.away !== away) {
    target.home = home;
    target.away = away;
    target.homeScore = null;
    target.awayScore = null;
    target.warning = "";
    if (stage === "semi") {
      championship.final[0].homeScore = null;
      championship.final[0].awayScore = null;
    }
  }
}

function render() {
  renderSchedule();
  renderBracket();
  renderControls();
  renderChampion();
  saveChampionship();
}

function renderSchedule() {
  const upcoming = [...championship.quarter, ...championship.semi, ...championship.final].slice(0, 6);
  document.querySelector("#schedule-grid").innerHTML = upcoming.map((game) => `
    <article class="game-card">
      <div class="game-date"><span>${game.date}</span><span>QUADRA PRINCIPAL</span></div>
      ${scheduleTeam(game.home, game.homeScore)}
      ${scheduleTeam(game.away, game.awayScore)}
    </article>`).join("");
}

function scheduleTeam(team, score) {
  const name = team || "A definir";
  return `<div class="game-team"><span class="game-team-name"><i class="team-badge">${initials(name)}</i>${escapeHtml(name)}</span><strong class="game-score ${score === null ? "pending" : ""}">${score === null ? "—" : score}</strong></div>`;
}

function renderBracket() {
  document.querySelector("#bracket").innerHTML = `
    ${renderStage("quarter", "Quartas de final")}
    <div class="stage-connector" aria-hidden="true"></div>
    ${renderStage("semi", "Semifinais")}
    <div class="stage-connector" aria-hidden="true"></div>
    ${renderStage("final", "Grande final")}`;

  document.querySelectorAll(".score-input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const { stage, matchIndex, side } = event.currentTarget.dataset;
      const value = event.currentTarget.value;
      championship[stage][Number(matchIndex)][`${side}Score`] = value === "" ? null : Number(value);
      championship[stage][Number(matchIndex)].warning = "";
    });
  });
}

function renderStage(stageKey, title) {
  return `<div class="stage"><div class="stage-title">${title}</div>${championship[stageKey].map((game, index) => renderMatch(stageKey, game, index)).join("")}</div>`;
}

function renderMatch(stage, game, index) {
  const winner = winnerOf(game);
  const enabled = stage === activeStage && game.home && game.away;
  return `<article class="match" aria-label="${escapeHtml(game.home || "A definir")} contra ${escapeHtml(game.away || "A definir")}">
    ${matchRow("home", game.home, game.homeScore, winner, enabled, stage, index)}
    ${matchRow("away", game.away, game.awayScore, winner, enabled, stage, index)}
    <div class="match-message">${escapeHtml(game.warning || game.date)}</div>
  </article>`;
}

function matchRow(side, team, score, winner, enabled, stage, index) {
  const name = team || "A definir";
  const winnerClass = winner && winner === team ? "winner" : team ? "" : "placeholder";
  return `<div class="match-row ${winnerClass}">
    <span class="mini-badge">${initials(name)}</span>
    <span>${escapeHtml(name)}</span>
    <input class="score-input" data-stage="${stage}" data-match-index="${index}" data-side="${side}" type="number" min="0" max="99" inputmode="numeric" aria-label="Placar de ${escapeHtml(name)}" value="${score ?? ""}" ${enabled ? "" : "disabled"}>
  </div>`;
}

function renderControls() {
  const button = document.querySelector("#save-current-stage");
  const status = document.querySelector("#bracket-status");
  const champion = winnerOf(championship.final[0]);

  if (champion) {
    button.disabled = true;
    button.textContent = "Campeonato concluído";
    status.textContent = "Todos os resultados foram salvos.";
    return;
  }

  button.disabled = false;
  button.textContent = `Salvar ${stageLabels[activeStage]}`;
  status.textContent = `Preencha os placares das ${stageLabels[activeStage]}. Em caso de empate, informe o resultado após os pênaltis.`;
}

function renderChampion() {
  const champion = winnerOf(championship.final[0]);
  const banner = document.querySelector("#champion-banner");
  banner.classList.toggle("hidden", !champion);
  if (champion) document.querySelector("#champion-name").textContent = champion;
}

function saveStage() {
  const games = championship[activeStage];
  let valid = true;

  games.forEach((game) => {
    game.warning = "";
    if (!game.home || !game.away || game.homeScore === null || game.awayScore === null) {
      game.warning = "Preencha os dois placares";
      valid = false;
    } else if (Number(game.homeScore) === Number(game.awayScore)) {
      game.warning = "Informe o placar após os pênaltis";
      valid = false;
    }
  });

  if (!valid) {
    render();
    showToast("Revise os placares destacados.", true);
    return;
  }

  const stageIndex = stageOrder.indexOf(activeStage);
  normalizeBracket();
  if (stageIndex < stageOrder.length - 1) activeStage = stageOrder[stageIndex + 1];
  render();
  showToast(stageIndex === stageOrder.length - 1 ? "Temos uma equipe campeã!" : "Resultados salvos. Próxima fase liberada!");
}

function winnerOf(game) {
  if (!game.home || !game.away || game.homeScore === null || game.awayScore === null) return null;
  const homeScore = Number(game.homeScore);
  const awayScore = Number(game.awayScore);
  if (homeScore === awayScore) return null;
  return homeScore > awayScore ? game.home : game.away;
}

function hasWinner(game) { return Boolean(winnerOf(game)); }

function resetChampionship() {
  if (!window.confirm("Restaurar os jogos e placares de exemplo?")) return;
  championship = initialChampionship();
  activeStage = "quarter";
  render();
  showToast("Demonstração restaurada.");
}

function initials(name) {
  if (!name || name === "A definir") return "?";
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function showToast(message, error = false) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.style.background = error ? "var(--orange)" : "var(--lime)";
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }

