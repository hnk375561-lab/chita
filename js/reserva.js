import { animate, reduceMotion, transition } from "./motion/core.js";

const CONFIG = { diasHabilitados: [1, 2, 3, 4, 5, 6], slots: ["10:00", "11:30", "16:00", "17:30"], slotsNote: "Horarios configurables: consultar disponibilidad." };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const state = { month: new Date(new Date().getFullYear(), new Date().getMonth(), 1), day: null, slot: null, step: "month", control: null };
const live = $("#live");
const announce = (text) => { if (live) live.textContent = text; };
const monthTitle = (date) => `${months[date.getMonth()]} ${date.getFullYear()}`;
const formatDate = (date) => date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const firstDay = (date) => (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;

function renderCalendar() {
  const calendar = $("#calendar"); if (!calendar) return; calendar.textContent = ""; $("#month-label").textContent = monthTitle(state.month); $("#month-status").textContent = CONFIG.slotsNote;
  for (let i = 0; i < firstDay(state.month); i += 1) { const empty = document.createElement("span"); empty.className = "day-cell day-cell--empty"; empty.setAttribute("aria-hidden", "true"); calendar.appendChild(empty); }
  for (let day = 1; day <= daysInMonth(state.month); day += 1) {
    const date = new Date(state.month.getFullYear(), state.month.getMonth(), day), enabled = CONFIG.diasHabilitados.includes(date.getDay()), button = document.createElement("button");
    button.className = "day-cell"; button.type = "button"; button.dataset.day = day; button.disabled = !enabled; button.setAttribute("role", "gridcell"); button.setAttribute("aria-disabled", String(!enabled)); button.setAttribute("aria-selected", String(state.day?.getTime() === date.getTime())); if (state.day?.getTime() === date.getTime()) button.setAttribute("aria-current", "true");
    button.innerHTML = `<span>${String(day).padStart(2, "0")}</span><small>${enabled ? "disponible" : "cerrado"}</small>`; calendar.appendChild(button);
  }
}

function animateScene(show) {
  const current = $(".scene:not([hidden])"), next = $(`.scene--${show}`); if (!next || current === next) return;
  state.step = show; $("#booking").dataset.step = show; $("#back").hidden = show === "month"; next.hidden = false;
  if (reduceMotion.matches) { if (current) current.hidden = true; return; }
  state.control?.stop();
  transition(() => {}, [`.scene--${show}`]);
  const controls = animate(next, { opacity: [0, 1], y: ["5%", "0%"] }, { duration: .5, ease: "easeOut" });
  state.control = controls; if (current) animate(current, { opacity: [1, 0], y: ["0%", "-3%"] }, { duration: .22, ease: "easeIn", onComplete: () => { current.hidden = true; } });
  if (show === "confirm") animate($(".diagonal-wipe"), { x: ["-100%", "100%"] }, { duration: .7, ease: "easeInOut" });
}
function selectDay(day) { const date = new Date(state.month.getFullYear(), state.month.getMonth(), day); if (!CONFIG.diasHabilitados.includes(date.getDay())) return; state.day = date; state.slot = null; $("#day-number").textContent = String(day).padStart(2, "0"); $("#day-month").textContent = months[date.getMonth()].slice(0, 3).toUpperCase(); $("#day-status").textContent = formatDate(date); $("#to-time").disabled = false; renderCalendar(); announce(`Día seleccionado: ${formatDate(date)}`); animateScene("day"); }
function renderSlots() { const box = $("#slots"); box.textContent = ""; CONFIG.slots.forEach((slot) => { const button = document.createElement("button"); button.type = "button"; button.className = "slot"; button.dataset.slot = slot; button.setAttribute("role", "option"); button.setAttribute("aria-selected", String(state.slot === slot)); button.innerHTML = `<b>${slot}</b><small>consultar disponibilidad</small>`; box.appendChild(button); }); }
function selectSlot(slot) { state.slot = slot; $$(".slot").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.slot === slot))); $("#time-status").textContent = slot; $("#to-confirm").disabled = false; announce(`Horario seleccionado: ${slot}`); }
function showConfirm() { if (!state.day || !state.slot) return; $("#summary-day").textContent = `${state.day.getDate()} ${months[state.day.getMonth()]}`; $("#summary-time").textContent = state.slot; announce(`Resumen listo: ${formatDate(state.day)} a las ${state.slot}`); animateScene("confirm"); }
function goBack() { if (state.step === "confirm") animateScene("time"); else if (state.step === "time") animateScene("day"); else if (state.step === "day") animateScene("month"); }
function reset() { state.day = null; state.slot = null; state.step = "month"; $("#to-time").disabled = true; $("#to-confirm").disabled = true; renderCalendar(); renderSlots(); $$(".scene").forEach((scene) => { scene.hidden = !scene.classList.contains("scene--month"); scene.style.removeProperty("opacity"); scene.style.removeProperty("transform"); }); $("#back").hidden = true; $("#booking").dataset.step = "month"; window.scrollTo({ top: 0, behavior: "auto" }); announce("Calendario reiniciado"); }

if ($("#booking")) {
  $("#calendar").addEventListener("click", (event) => { const button = event.target.closest("button[data-day]"); if (button && !button.disabled) selectDay(+button.dataset.day); });
  $("#slots").addEventListener("click", (event) => { const button = event.target.closest("button[data-slot]"); if (button) selectSlot(button.dataset.slot); });
  $("#prev-month").addEventListener("click", () => { state.month.setMonth(state.month.getMonth() - 1); renderCalendar(); announce(`Mes anterior: ${monthTitle(state.month)}`); });
  $("#next-month").addEventListener("click", () => { state.month.setMonth(state.month.getMonth() + 1); renderCalendar(); announce(`Mes siguiente: ${monthTitle(state.month)}`); });
  $("#to-time").addEventListener("click", () => { renderSlots(); animateScene("time"); }); $("#to-confirm").addEventListener("click", showConfirm); $("#back").addEventListener("click", goBack); $("#restart").addEventListener("click", reset);
  document.addEventListener("keydown", (event) => { const active = document.activeElement; if (state.step === "month" && active?.matches(".day-cell")) { const cells = $$("#calendar .day-cell:not(:disabled)"), index = cells.indexOf(active), offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "ArrowDown" ? 7 : event.key === "ArrowUp" ? -7 : 0; if (offset && cells[index + offset]) { event.preventDefault(); cells[index + offset].focus(); } } if (event.key === "Escape") goBack(); });
  renderCalendar(); renderSlots();
}
