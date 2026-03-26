const storageKey = "playlist-tracker-state-v1";
let state = { total: 0, completed: 0, deadline: null, startDate: null };

// Round to keep a friendly pace value
function roundToOne(num) {
  return Math.round(num * 10) / 10;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.total > 0 && parsed.deadline) {
      state = { ...state, ...parsed };
      if (!state.startDate) state.startDate = new Date().toISOString().slice(0, 10);
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

function daysBetween(start, end) {
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil((end - start) / msInDay));
}

function computeStats() {
  const today = new Date();
  const deadlineDate = new Date(state.deadline);
  const startDate = new Date(state.startDate || today.toISOString().slice(0, 10));
  const daysLeft = daysBetween(today, deadlineDate);
  const remaining = Math.max(0, state.total - state.completed);
  const completionPct = state.total === 0 ? 0 : Math.min(100, Math.round((state.completed / state.total) * 100));

  const requiredPerDay = daysLeft === 0 ? remaining : remaining / daysLeft;
  const daysSinceStart = Math.max(1, daysBetween(startDate, today) + 1);
  const pace = state.completed / daysSinceStart;

  const onTrack = pace >= requiredPerDay || remaining === 0;

  return {
    daysLeft,
    remaining,
    completionPct,
    requiredPerDay: roundToOne(requiredPerDay || 0),
    pace: roundToOne(pace || 0),
    onTrack
  };
}

function updateUI() {
  const { daysLeft, remaining, completionPct, requiredPerDay, pace, onTrack } = computeStats();
  const dashboard = document.getElementById("dashboard");
  dashboard.classList.remove("hidden");

  document.getElementById("progress-fill").style.width = `${completionPct}%`;
  document.getElementById("progress-text").textContent = `${completionPct}% complete`;
  document.getElementById("stat-total").textContent = state.total;
  document.getElementById("stat-done").textContent = state.completed;
  document.getElementById("stat-remaining").textContent = remaining;
  document.getElementById("stat-days").textContent = daysLeft;
  document.getElementById("daily-target").textContent = `${requiredPerDay} / day`;
  document.getElementById("current-pace").textContent = `${pace} / day`;

  const statusPill = document.getElementById("status-pill");
  if (onTrack) {
    statusPill.textContent = "On Track";
    statusPill.style.background = "rgba(102,196,160,0.18)";
    statusPill.style.color = "#2c8b65";
    document.getElementById("motivation").textContent = "You're doing great!";
  } else {
    statusPill.textContent = "Behind Schedule";
    statusPill.style.background = "rgba(239,107,120,0.14)";
    statusPill.style.color = "#d24c5b";
    document.getElementById("motivation").textContent = "Small steps add up—keep going!";
  }
}

function handleSetupSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const total = Number(form.total.value);
  const deadline = form.deadline.value;
  if (!total || !deadline) return;
  state.total = total;
  state.completed = 0;
  state.deadline = deadline;
   state.startDate = new Date().toISOString().slice(0, 10);
  saveState();
  document.getElementById("setup-section").classList.add("hidden");
  updateUI();
}

function addCompleted(delta) {
  const next = state.completed + delta;
  state.completed = Math.min(state.total, Math.max(0, next));
  saveState();
  updateUI();
}

function resetAll() {
  localStorage.removeItem(storageKey);
  state = { total: 0, completed: 0, deadline: null, startDate: null };
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("setup-section").classList.remove("hidden");
}

function init() {
  const hasSaved = loadState();
  if (hasSaved) {
    document.getElementById("setup-section").classList.add("hidden");
    updateUI();
  }

  document.getElementById("setup-form").addEventListener("submit", handleSetupSubmit);
  document.getElementById("btn-complete").addEventListener("click", () => addCompleted(1));
  document.getElementById("btn-undo").addEventListener("click", () => addCompleted(-1));
  document.getElementById("btn-reset").addEventListener("click", resetAll);
}

init();
