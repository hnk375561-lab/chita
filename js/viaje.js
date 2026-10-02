import { gsap } from "./motion/vendor.js";
import { reduceMotion } from "./motion/core.js";

const CONFIG = {
  contact: { whatsapp: "5493442647442" },
  scenes: [
    { id: "city", title: "CIUDAD", range: [0, .33] },
    { id: "road", title: "RUTA", range: [.33, .67] },
    { id: "destination", title: "DESTINO", range: [.67, 1] }
  ],
  units: [
    ["Renault Clio Dynamique 1.2N", 2016, "123.000 km", "city", "compacto"], ["Chevrolet Tracker Premier 1.8N", 2018, "98.000 km", "road", "SUV"], ["Fiat Palio Attractive 1.4N", 2017, "128.000 km", "city", "compacto"], ["Kia K3 EX Cross 1.6N", 2025, "11.400 km", "road", "crossover"], ["Renault Kangoo Comfort 1.6N", 2022, "87.000 km", "destination", "utilitario"], ["Renault Kangoo Authentique 1.6N", 2018, "108.000 km", "destination", "utilitario"], ["Peugeot 301 Allure 1.6 HDI", 2018, "119.000 km", "road", "sedán"], ["Peugeot Partner Patagónica 1.4N", 2014, "112.000 km", "destination", "utilitario"]
  ].map(([name, year, km, scene, criterion]) => ({ name, year, km, scene, criterion }))
};

const $ = (selector) => document.querySelector(selector);
const route = $("#route");
if (route) {
  const token = $("#token"), bar = $("#route-progress"), odometer = $("#odometer"), sceneLabel = $("#scene-label"), progressLabel = $("#progress-label"), unitLayer = $("#unit-layer"), arrival = $("#arrival");
  const sceneEls = [...document.querySelectorAll(".scene")];
  const state = { p: 0, target: 0, scene: 0, control: null, drag: false };
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const sceneIndex = (value) => value < .33 ? 0 : value < .67 ? 1 : 2;

  function renderUnits(progress) {
    const scene = CONFIG.scenes[state.scene], local = CONFIG.units.filter((unit) => unit.scene === scene.id);
    const within = (progress - scene.range[0]) / (scene.range[1] - scene.range[0]);
    unitLayer.textContent = "";
    local.forEach((unit, index) => {
      const element = document.createElement("article"); element.className = "unit";
      element.style.transform = `translate3d(0, ${Math.round(index * 20 - within * 40)}px, 0)`;
      element.style.opacity = String(Math.max(0, 1 - Math.abs(within - (index + 1) / (local.length + 1)) * 2));
      element.innerHTML = `<strong>${unit.name}</strong><small>${unit.year} · ${unit.km} · ${unit.criterion}</small><a target="_blank" rel="noopener" href="https://wa.me/${CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar por el ${unit.name} ${unit.year}.`)}">Consultar ↗</a>`;
      unitLayer.appendChild(element);
    });
  }

  function render() {
    const progress = state.p, index = sceneIndex(progress), scene = CONFIG.scenes[index]; state.scene = index;
    const percent = Math.round(progress * 100), max = route.clientWidth - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pad")) * 2 - 62;
    sceneLabel.textContent = scene.title; progressLabel.textContent = `${percent}%`; odometer.textContent = `${String(Math.round(progress * 999)).padStart(3, "0")} km`;
    token.style.transform = `translate3d(${Math.round(max * progress)}px,0,0)`; bar.style.width = `${percent}%`;
    token.setAttribute("aria-valuenow", String(percent)); token.setAttribute("aria-valuetext", `Escena: ${scene.title}, ${percent}%`);
    sceneEls.forEach((element, i) => { element.style.opacity = i === index ? "1" : String(Math.max(0, 1 - Math.abs(i - index) * 2)); element.setAttribute("aria-hidden", String(i !== index)); const photo = element.querySelector(".scene-photo"); if (photo) photo.style.setProperty("--scene-offset", `${Math.round((progress - i * .5) * -22)}px`); });
    renderUnits(progress);
    const atEnd = progress >= .995 && !reduceMotion.matches; arrival.hidden = !atEnd; route.setAttribute("aria-hidden", String(atEnd));
  }

  function setTarget(value) {
    state.target = clamp(value); state.control?.kill();
    if (reduceMotion.matches) { state.p = state.target; render(); return; }
    state.control = gsap.to(state, { p: state.target, duration: 0.95, ease: "power3.out", overwrite: true, onUpdate: render });
  }

  CONFIG.units.forEach((unit) => { const element = document.createElement("article"); element.className = "linear-item"; element.innerHTML = `<strong>${unit.name}</strong><small>${unit.year} · ${unit.km} · ${unit.criterion} · consultar por contacto</small>`; $("#linear-list")?.appendChild(element); });
  route.setAttribute("data-lenis-prevent-wheel", "");
  route.addEventListener("wheel", (event) => { event.preventDefault(); setTarget(state.target + event.deltaY * .0008); }, { passive: false });
  token.addEventListener("pointerdown", (event) => { state.drag = true; token.setPointerCapture(event.pointerId); });
  token.addEventListener("pointermove", (event) => { if (state.drag) setTarget(state.target + event.movementX / Math.max(1, route.clientWidth - 96)); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => token.addEventListener(type, () => { state.drag = false; }));
  token.addEventListener("keydown", (event) => { const step = event.shiftKey ? .25 : .04; if (event.key === "ArrowRight") setTarget(state.target + step); if (event.key === "ArrowLeft") setTarget(state.target - step); if (event.key === "Home") setTarget(0); if (event.key === "End") setTarget(1); });
  document.querySelectorAll(".milestone").forEach((milestone) => milestone.addEventListener("click", () => setTarget(+milestone.dataset.progress)));
  $("#back-route")?.addEventListener("click", () => { setTarget(.9); (window.chitaScroll ? window.chitaScroll.to(0) : window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" })); });
  render();
}
