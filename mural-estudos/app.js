const STORAGE_KEY = "apiex-foco-na-semana-v1";

const state = {
  tasks: [],
  calendarDate: startOfMonth(new Date()),
  selectedDate: null,
};

const priorityLabels = { high: "Alta", medium: "Média", low: "Baixa" };
const els = {};

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(els, {
    taskList: document.querySelector("#task-list"),
    taskModal: document.querySelector("#task-modal"),
    taskForm: document.querySelector("#task-form"),
    subjectFilter: document.querySelector("#subject-filter"),
    statusFilter: document.querySelector("#status-filter"),
    searchInput: document.querySelector("#search-input"),
    calendarGrid: document.querySelector("#calendar-grid"),
    calendarTitle: document.querySelector("#calendar-title"),
    activeDateFilter: document.querySelector("#active-date-filter"),
    activeDateText: document.querySelector("#active-date-text"),
    toast: document.querySelector("#toast"),
  });

  loadTasks();
  bindEvents();
  document.querySelector("#today-label").textContent = capitalize(new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
  render();
});

function bindEvents() {
  document.querySelector("#open-task-modal").addEventListener("click", openModal);
  document.querySelector("#close-task-modal").addEventListener("click", closeModal);
  document.querySelector("#cancel-task").addEventListener("click", closeModal);
  document.querySelector("#previous-month").addEventListener("click", () => changeMonth(-1));
  document.querySelector("#next-month").addEventListener("click", () => changeMonth(1));
  document.querySelector("#current-month").addEventListener("click", () => { state.calendarDate = startOfMonth(new Date()); renderCalendar(); });
  document.querySelector("#clear-date-filter").addEventListener("click", () => { state.selectedDate = null; render(); });
  document.querySelector("#reset-demo").addEventListener("click", resetDemo);
  els.taskForm.addEventListener("submit", addTask);
  [els.subjectFilter, els.statusFilter].forEach((element) => element.addEventListener("change", renderTasks));
  els.searchInput.addEventListener("input", renderTasks);
  els.taskModal.addEventListener("click", (event) => { if (event.target === els.taskModal) closeModal(); });
}

function defaultTasks() {
  return [
    { id: crypto.randomUUID(), title: "Lista de Matemática", subject: "Matemática", dueDate: isoDate(addDays(new Date(), 1)), priority: "high", status: "pending", notes: "Exercícios 12 a 20." },
    { id: crypto.randomUUID(), title: "Resumo da Revolução Industrial", subject: "História", dueDate: isoDate(addDays(new Date(), 3)), priority: "medium", status: "pending", notes: "Revisar causas e consequências." },
    { id: crypto.randomUUID(), title: "Experimento sobre densidade", subject: "Ciências", dueDate: isoDate(addDays(new Date(), 7)), priority: "medium", status: "pending", notes: "Combinar materiais com o grupo." },
    { id: crypto.randomUUID(), title: "Leitura do conto", subject: "Português", dueDate: isoDate(addDays(new Date(), -1)), priority: "low", status: "done", notes: "Capítulos 1 a 3." },
  ];
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    state.tasks = Array.isArray(saved) ? saved : defaultTasks();
  } catch {
    state.tasks = defaultTasks();
  }
  saveTasks();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function render() {
  renderStats();
  renderCalendar();
  renderSubjectOptions();
  renderTasks();
}

function renderStats() {
  const done = state.tasks.filter((task) => task.status === "done").length;
  const pending = state.tasks.length - done;
  const urgent = state.tasks.filter((task) => task.status === "pending" && daysUntil(task.dueDate) <= 2).length;
  const percent = state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0;

  document.querySelector("#stat-pending").textContent = pending;
  document.querySelector("#stat-urgent").textContent = urgent;
  document.querySelector("#stat-done").textContent = done;
  document.querySelector("#progress-value").textContent = `${percent}%`;
  document.querySelector("#progress-ring").style.background = `conic-gradient(var(--teal) ${percent}%, #e9ecf3 ${percent}%)`;
  document.querySelector("#progress-ring").setAttribute("aria-label", `${percent} por cento concluído`);
  document.querySelector("#progress-message").textContent = percent === 100 ? "Tudo em dia. Muito bem!" : percent >= 50 ? "Você já passou da metade." : "Comece por uma tarefa pequena.";
}

function renderCalendar() {
  els.calendarTitle.textContent = capitalize(new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(state.calendarDate));
  els.calendarGrid.innerHTML = "";

  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  const first = new Date(year, month, 1);
  const gridStart = addDays(first, -first.getDay());

  for (let index = 0; index < 42; index += 1) {
    const date = addDays(gridStart, index);
    const dateIso = isoDate(date);
    const dayTasks = state.tasks.filter((task) => task.dueDate === dateIso);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    if (date.getMonth() !== month) button.classList.add("other-month");
    if (dateIso === isoDate(new Date())) button.classList.add("today");
    if (dateIso === state.selectedDate) button.classList.add("selected");
    button.setAttribute("aria-label", `${formatDate(dateIso)}${dayTasks.length ? `, ${dayTasks.length} atividade(s)` : ""}`);
    button.innerHTML = `<span>${date.getDate()}</span>${dayTasks.length ? `<span class="calendar-dots">${dayTasks.slice(0, 3).map(() => "<i></i>").join("")}</span>` : ""}`;
    button.addEventListener("click", () => {
      state.selectedDate = state.selectedDate === dateIso ? null : dateIso;
      state.calendarDate = startOfMonth(date);
      render();
      document.querySelector("#atividades").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    els.calendarGrid.appendChild(button);
  }

  if (state.selectedDate) {
    els.activeDateFilter.classList.remove("hidden");
    els.activeDateText.textContent = `Mostrando atividades de ${formatDate(state.selectedDate)}`;
  } else {
    els.activeDateFilter.classList.add("hidden");
  }
}

function renderSubjectOptions() {
  const current = els.subjectFilter.value;
  const subjects = [...new Set(state.tasks.map((task) => task.subject))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  els.subjectFilter.innerHTML = '<option value="all">Todas as disciplinas</option>' + subjects.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join("");
  els.subjectFilter.value = subjects.includes(current) ? current : "all";
}

function renderTasks() {
  const search = els.searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = state.tasks
    .filter((task) => els.subjectFilter.value === "all" || task.subject === els.subjectFilter.value)
    .filter((task) => els.statusFilter.value === "all" || task.status === els.statusFilter.value)
    .filter((task) => !state.selectedDate || task.dueDate === state.selectedDate)
    .filter((task) => !search || `${task.title} ${task.subject} ${task.notes}`.toLocaleLowerCase("pt-BR").includes(search))
    .sort((a, b) => Number(a.status === "done") - Number(b.status === "done") || a.dueDate.localeCompare(b.dueDate));

  if (!filtered.length) {
    els.taskList.innerHTML = '<div class="empty-state"><strong>Nenhuma atividade encontrada.</strong><br>Ajuste os filtros ou cadastre uma nova atividade.</div>';
    return;
  }

  els.taskList.innerHTML = filtered.map((task) => {
    const urgent = task.status === "pending" && daysUntil(task.dueDate) <= 2;
    const dueText = task.status === "done" ? "Concluída" : relativeDue(task.dueDate);
    return `<article class="task-item ${urgent ? "urgent" : ""} ${task.status === "done" ? "done" : ""}" data-task-id="${task.id}">
      <input class="task-check" type="checkbox" ${task.status === "done" ? "checked" : ""} aria-label="Marcar ${escapeHtml(task.title)} como ${task.status === "done" ? "pendente" : "concluída"}">
      <div class="task-main">
        <h3>${escapeHtml(task.title)}</h3>
        <div class="task-meta"><span class="tag">${escapeHtml(task.subject)}</span><span class="tag ${task.priority}">${priorityLabels[task.priority]}</span><span>${formatDate(task.dueDate)} · ${dueText}</span></div>
        ${task.notes ? `<p class="task-notes">${escapeHtml(task.notes)}</p>` : ""}
      </div>
      <button class="delete-task" type="button" aria-label="Excluir ${escapeHtml(task.title)}">×</button>
    </article>`;
  }).join("");

  els.taskList.querySelectorAll(".task-item").forEach((item) => {
    const id = item.dataset.taskId;
    item.querySelector(".task-check").addEventListener("change", () => toggleTask(id));
    item.querySelector(".delete-task").addEventListener("click", () => deleteTask(id));
  });
}

function openModal() {
  els.taskForm.reset();
  els.taskForm.elements.dueDate.value = isoDate(addDays(new Date(), 2));
  els.taskModal.showModal();
  els.taskForm.elements.title.focus();
}

function closeModal() { els.taskModal.close(); }

function addTask(event) {
  event.preventDefault();
  const data = new FormData(els.taskForm);
  state.tasks.push({
    id: crypto.randomUUID(),
    title: data.get("title").trim(),
    subject: data.get("subject").trim(),
    dueDate: data.get("dueDate"),
    priority: data.get("priority"),
    status: data.get("status"),
    notes: data.get("notes").trim(),
  });
  saveTasks();
  closeModal();
  render();
  showToast("Atividade adicionada ao mural.");
}

function toggleTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  task.status = task.status === "done" ? "pending" : "done";
  saveTasks();
  render();
  showToast(task.status === "done" ? "Atividade concluída!" : "Atividade reaberta.");
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
  showToast("Atividade removida.");
}

function resetDemo() {
  if (!window.confirm("Restaurar as atividades de exemplo?")) return;
  state.tasks = defaultTasks();
  state.selectedDate = null;
  state.calendarDate = startOfMonth(new Date());
  saveTasks();
  render();
  showToast("Exemplo restaurado.");
}

function changeMonth(offset) {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + offset, 1);
  renderCalendar();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function addDays(date, amount) { const copy = new Date(date); copy.setDate(copy.getDate() + amount); return copy; }
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function isoDate(date) { const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); }
function parseLocalDate(value) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function daysUntil(value) { const today = new Date(); today.setHours(0,0,0,0); return Math.ceil((parseLocalDate(value) - today) / 86400000); }
function formatDate(value) { return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(parseLocalDate(value)).replace(".", ""); }
function relativeDue(value) { const days = daysUntil(value); if (days < 0) return `${Math.abs(days)} dia(s) atrasada`; if (days === 0) return "vence hoje"; if (days === 1) return "vence amanhã"; return `vence em ${days} dias`; }
function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
