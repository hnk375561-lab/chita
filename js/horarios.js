/* CHITA · Horarios — estado en vivo.
   Lee los horarios que ya están escritos en el HTML (data-d, data-a, data-c, data-ask, data-closed) de #horarios
   y pinta: la patente del día, el sello Abierto/Cerrado, el día actual y la línea de «ahora» sobre la regla.
   No tiene horarios propios: si cambian, se editan en el HTML (y en data/dealership.json). Sin JS, la regla queda completa.
   La hora se calcula en Argentina, sin importar dónde esté quien mira. Los feriados no se conocen: el pie lo aclara. */
(function () {
"use strict";
var sec = document.getElementById("horarios");
if (!sec) return;

var DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]; // 1..7
var AXIS_A = 8, AXIS_C = 18;                                                          // horas del eje de la regla

function mins(h) { var p = h.split(":"); return +p[0] * 60 + +p[1]; }
function pretty(h) { var p = h.split(":"); return +p[0] + ":" + p[1]; }

/* Semana leída del HTML de la sección grande */
var week = {};
[].forEach.call(sec.querySelectorAll(".hor-r[data-d]"), function (r) {
  var d = +r.getAttribute("data-d");
  week[d] = {
    el: r,
    ask: r.hasAttribute("data-ask"),
    closed: r.hasAttribute("data-closed"),
    a: r.getAttribute("data-a"), c: r.getAttribute("data-c")
  };
  if (week[d].a && week[d].c) {   // las barras salen de los mismos datos
    r.style.setProperty("--a", ((mins(week[d].a) / 60 - AXIS_A) / (AXIS_C - AXIS_A)).toFixed(4));
    r.style.setProperty("--c", ((mins(week[d].c) / 60 - AXIS_A) / (AXIS_C - AXIS_A)).toFixed(4));
  }
});

/* Hora actual en Argentina */
var fmt;
try {
  fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Buenos_Aires", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
} catch (e) { fmt = null; }
function nowAR() {
  var map = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  if (fmt) {
    var o = {}; fmt.formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { d: map[o.weekday], m: (+o.hour % 24) * 60 + +o.minute };
  }
  var n = new Date(), utc = n.getTime() + n.getTimezoneOffset() * 60000, ar = new Date(utc - 3 * 3600000);
  return { d: ar.getDay() || 7, m: ar.getHours() * 60 + ar.getMinutes() };
}

function status(n) {
  var t = week[n.d];
  if (!t) return null;
  if (t.ask) return { st: "ask", sello: "Consultá", sub: "Hoy atendemos por WhatsApp.", dia: DIAS[n.d - 1], big: "Consultá", small: "por WhatsApp" };
  if (t.closed || !t.a) return { st: "closed", sello: "Cerrado", sub: nextOpen(n, false), dia: DIAS[n.d - 1], big: "Cerrado", small: "" };
  var a = mins(t.a), c = mins(t.c), big = pretty(t.a) + " – " + pretty(t.c);
  if (n.m >= a && n.m < c) {
    var left = c - n.m;
    return { st: "open", sello: "Abierto", dia: DIAS[n.d - 1], big: big, small: "",
      sub: left <= 60 ? "Cerramos en " + left + " min, a las " + pretty(t.c) + "." : "Hoy hasta las " + pretty(t.c) + "." };
  }
  if (n.m < a) return { st: "closed", sello: "Cerrado", dia: DIAS[n.d - 1], big: big, small: "", sub: "Hoy abrimos a las " + pretty(t.a) + "." };
  return { st: "closed", sello: "Cerrado", dia: DIAS[n.d - 1], big: big, small: "", sub: nextOpen(n, true) };
}
function nextOpen(n) {
  for (var i = 1; i <= 7; i++) {
    var d = ((n.d - 1 + i) % 7) + 1, t = week[d];
    if (t && t.a && !t.closed && !t.ask) return "Abrimos " + (i === 1 ? "mañana" : "el " + DIAS[d - 1].toLowerCase()) + " a las " + pretty(t.a) + ".";
  }
  return "Escribinos por WhatsApp.";
}

function paint() {
  var n = nowAR(), s = status(n);
  if (!s) return;

  /* regla: día actual y línea de ahora */
  Object.keys(week).forEach(function (k) {
    var on = +k === n.d;
    week[k].el.classList.toggle("is-hoy", on);
    if (on) week[k].el.setAttribute("aria-current", "date"); else week[k].el.removeAttribute("aria-current");
  });
  var rg = sec.querySelector(".hor-rg"), h = n.m / 60;
  if (rg) {
    if (h >= AXIS_A && h <= AXIS_C) { rg.style.setProperty("--now", ((h - AXIS_A) / (AXIS_C - AXIS_A)).toFixed(4)); rg.style.setProperty("--line", "block"); }
    else rg.style.setProperty("--line", "none");
  }

  /* patente del día + sello */
  var plate = sec.querySelector("[data-plate]"), st = sec.querySelector(".hor-st");
  if (plate) {
    plate.hidden = false;
    plate.removeAttribute("data-ask"); plate.removeAttribute("data-closed");
    if (s.st === "ask") plate.setAttribute("data-ask", ""); if (s.st === "closed" && !/\d/.test(s.big)) plate.setAttribute("data-closed", "");
    plate.querySelector("[data-dia]").textContent = "Hoy · " + s.dia;
    plate.querySelector("[data-hs]").innerHTML = s.big + (s.small ? "<small>" + s.small + "</small>" : "");
  }
  if (st) {
    st.hidden = false; st.setAttribute("data-state", s.st);
    st.querySelector("[data-sello]").textContent = s.sello;
    st.querySelector("[data-sub]").textContent = s.sub;
  }

  /* bloque compacto del panel de «Dónde estamos» */
  var mini = document.getElementById("hrs");
  if (mini && mini.hasAttribute("data-hor-mini")) {
    mini.setAttribute("data-state", s.st);
    var now = mini.querySelector(".hrs-now");
    if (now) { now.hidden = false; now.querySelector("[data-sello]").textContent = s.sello; now.querySelector("[data-sub]").textContent = s.sub; }
    [].forEach.call(mini.querySelectorAll(".hrs-l li[data-d]"), function (li) {
      var on = li.getAttribute("data-d").split(",").indexOf(String(n.d)) > -1;
      li.classList.toggle("is-hoy", on);
      if (on) li.setAttribute("aria-current", "date"); else li.removeAttribute("aria-current");
    });
  }
}

paint();
setInterval(paint, 30000);
document.addEventListener("visibilitychange", function () { if (!document.hidden) paint(); });

/* SELLO: el sello entra una sola vez, cuando la sección se ve */
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { sec.classList.add("is-in"); io.disconnect(); }
  }, { threshold: .25 });
  io.observe(sec);
} else sec.classList.add("is-in");
})();
