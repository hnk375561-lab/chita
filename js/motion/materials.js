/* Imágenes como materia: planos Three.js con geometría real (cámara en perspectiva + relieve en el vertex shader)
   y GLSL propio. Los uniforms salen del Global Interaction Engine (Motion + resortes). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { animate, reduceMotion, clamp } from "./core.js";
import { world, subscribe, hold, wake } from "./engine.js";

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}`;

const VERT = `
uniform vec2 uPointer, uRes; uniform float uProx, uPress, uEnergy, uScrollVel;
varying vec2 vUv; varying float vH;
void main(){
  vUv=uv; vec3 p=position;
  vec2 pd=(uv-uPointer)*vec2(uRes.x/uRes.y,1.);
  float f=exp(-dot(pd,pd)*6.);
  /* relieve: el cursor empuja la lámina; el scroll la flexiona */
  float h=f*(.07*uProx+.16*uPress+.05*uEnergy)-uScrollVel*.07*sin(uv.x*3.14159)*(uv.y-.5);
  p.z+=h; vH=h;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex0,uTex1;
uniform vec2 uRes,uImg0,uImg1,uPointer,uVel,uFocus;
uniform float uTime,uProgress,uScrollVel,uEnergy,uProx,uPress,uDir,uView,uQ,uMode;
varying vec2 vUv; varying float vH;
${NOISE}
vec2 cover(vec2 uv,vec2 img){
  float ra=uRes.x/uRes.y, ri=img.x/img.y;
  vec2 s=ra>ri?vec2(1.,ri/ra):vec2(ra/ri,1.);
  return uv*s+uFocus*(1.-s);
}
vec3 fetch(sampler2D t,vec2 img,vec2 uv,vec2 cs,float chroma){
  vec2 c=cover(clamp(uv,0.,1.),img);
  if(chroma<.5) return texture2D(t,c).rgb;
  return vec3(texture2D(t,cover(clamp(uv+cs,0.,1.),img)).r,texture2D(t,c).g,texture2D(t,cover(clamp(uv-cs,0.,1.),img)).b);
}
void main(){
  float asp=uRes.x/uRes.y;
  float qMid=step(.25,uQ), qHi=step(.75,uQ);
  float sv=clamp(uScrollVel,-1.5,1.5);
  float tr=sin(clamp(uProgress,0.,1.)*3.14159);
  vec2 uv=(vUv-.5)/(1.05+uMode*.06)+.5;
  uv.y+=uMode*(uView-.5)*.06;
  /* campo del cursor: líquido + ondas por presión */
  vec2 pd=(vUv-uPointer)*vec2(asp,1.);
  float r=length(pd);
  float fall=exp(-r*r*7.)*(.3+.7*uProx);
  vec2 dir=pd/(r+1e-3);
  float ripple=sin(r*38.-uTime*4.)*exp(-r*5.)*(uPress*.9+uEnergy*.4)*qMid;
  vec2 disp=dir*fall*(.008+uEnergy*.026)+uVel*fall*.05+dir*ripple*.006;
  /* turbulencia (flow field); sube con la energía */
  vec2 q=vUv*vec2(asp,1.)*2.1;
  vec2 flow=vec2(snoise(q+vec2(0.,uTime*.06)),snoise(q+vec2(5.2,1.3)-uTime*.05));
  flow+=qMid*.5*vec2(snoise(q*2.4+uTime*.1),snoise(q*2.4+9.));
  disp+=flow*(.0025+abs(sv)*.014+uEnergy*.006);
  /* scroll: la imagen se flexiona con la velocidad y vuelve sola al frenar */
  disp.y+=sv*.028*sin(vUv.x*3.14159);
  /* paralaje de profundidad (seudo-profundidad por luminancia) */
  vec2 par=(uPointer-.5)*uProx;
  if(qHi>.5){ float lum=dot(texture2D(uTex0,cover(clamp(uv,0.,1.),uImg0)).rgb,vec3(.299,.587,.114)); disp+=par*(lum-.5)*.04; }
  else disp+=par*(vUv.y-.5)*.01;
  /* transición A→B por desplazamiento + disolución con ruido */
  float n=snoise(q*1.15+vec2(0.,uDir*uTime*.1))*.5+.5;
  float grad=uDir>=0.?vUv.x:1.-vUv.x;
  float t=n*.5+grad*.5;
  float k=smoothstep(t-.1,t+.1,uProgress*1.2-.1);
  float band=1.-abs(k*2.-1.);
  vec2 td=(vec2(n-.5,snoise(q*1.5+3.7)*.5)*.16+vec2(uDir*.05,0.))*tr;
  float ca=(length(uVel)*.012+abs(sv)*.009+uEnergy*.003+band*.012*tr)*qMid;
  vec2 cs=vec2(ca,ca*.35*(sv>=0.?1.:-1.));
  vec3 col;
  if(k<.001) col=fetch(uTex0,uImg0,uv+disp,cs,qMid);
  else if(k>.999) col=fetch(uTex1,uImg1,uv+disp,cs,qMid);
  else col=mix(fetch(uTex0,uImg0,uv+disp+td*k,cs,qMid),fetch(uTex1,uImg1,uv+disp-td*(1.-k),cs,qMid),k);
  /* viñeta, brillo de relieve (fresnel por derivadas) y luz en el frente de disolución */
  float vig=1.-smoothstep(.45,1.1,length((vUv-.5)*vec2(asp*.62,1.)));
  col*=mix(.9,1.,vig);
  vec2 g=vec2(dFdx(vH),dFdy(vH))*150.;
  float fres=pow(clamp(length(g),0.,1.),1.5);
  col+=fres*.12*vec3(.55,.85,1.)*(uProx+uPress)*qMid;
  col+=band*tr*.05+fall*uProx*.03*qMid;
  gl_FragColor=vec4(col,1.);
}`;

const texCache = new Map();
function loadTex(url, maxAniso) {
  if (texCache.has(url)) return texCache.get(url);
  const p = new Promise((res, rej) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => {
      const t = new THREE.Texture(im);
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true; t.anisotropy = maxAniso; t.needsUpdate = true;
      t.userData.size = new THREE.Vector2(im.naturalWidth, im.naturalHeight);
      res(t);
    };
    im.onerror = rej; im.src = url;
  });
  texCache.set(url, p);
  return p;
}
const urlOf = (img) => img && (img.dataset.src || img.getAttribute("src") || img.currentSrc);
function focusOf(img) {
  const m = (getComputedStyle(img).objectPosition || "50% 50%").match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  return m ? [parseFloat(m[1]) / 100, 1 - parseFloat(m[2]) / 100] : [.5, .5];
}

class Surface {
  constructor({ host, mount, imgs, event, still = false }) {
    this.host = host; this.mount = mount; this.imgs = imgs; this.still = still;
    this.visible = false; this.release = null; this.anim = null; this.cur = 0; this.skip = 0; this.alive = true;
    this.lx = { x: 0.5, y: 0.5, vx: 0, vy: 0 };
    const canvas = document.createElement("canvas");
    canvas.className = "gl-surface"; canvas.setAttribute("aria-hidden", "true");
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    this.maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(2 * Math.atan(1 / 3) * 180 / Math.PI, 1, .1, 20);
    this.camera.position.set(0, 0, 3);
    const blank = new THREE.Texture(); 
    this.u = {
      uTex0: { value: blank }, uTex1: { value: blank }, uRes: { value: new THREE.Vector2(1, 1) },
      uImg0: { value: new THREE.Vector2(1, 1) }, uImg1: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(.5, .5) }, uVel: { value: new THREE.Vector2() }, uFocus: { value: new THREE.Vector2(.5, .5) },
      uTime: { value: 0 }, uProgress: { value: 0 }, uScrollVel: { value: 0 }, uEnergy: { value: 0 }, uProx: { value: 0 },
      uPress: { value: 0 }, uDir: { value: 1 }, uView: { value: .5 }, uQ: { value: 1 }, uMode: { value: still ? 1 : 0 }
    };
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 40, 40), new THREE.ShaderMaterial({ uniforms: this.u, vertexShader: VERT, fragmentShader: FRAG }));
    this.scene.add(this.mesh);
    mount.appendChild(canvas);
    this.canvas = canvas;
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.destroy(); });
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(host);
    this.resize();
    this.unsub = subscribe(Object.assign((w, dt) => this.update(w, dt), { onTier: () => this.resize() }));
    this.io = new IntersectionObserver(([e]) => this.setVisible(e.isIntersecting), { rootMargin: "80px" });
    this.io.observe(host);
    if (event) { this.onEvent = (e) => this.go(e.detail.to, e.detail.dir); document.addEventListener(event, this.onEvent); this.event = event; }
  }
  async setSlide(i) {
    const img = this.imgs()[i]; if (!img) return null;
    const tex = await loadTex(urlOf(img), this.maxAniso);
    return { tex, focus: focusOf(img) };
  }
  async start(i) {
    const s = await this.setSlide(i); if (!s || !this.alive) return false;
    this.u.uTex0.value = this.u.uTex1.value = s.tex; this.u.uImg0.value.copy(s.tex.userData.size); this.u.uImg1.value.copy(s.tex.userData.size);
    this.u.uFocus.value.set(...s.focus); this.cur = i;
    this.host.classList.add("gl-on");
    return true;
  }
  async go(to, dir = 1) {
    if (to === this.cur || !this.alive) return;
    if (this.anim) { this.anim.stop(); this.settle(); }
    const s = await this.setSlide(to); if (!s || !this.alive) return;
    this.u.uTex1.value = s.tex; this.u.uImg1.value.copy(s.tex.userData.size);
    this.u.uDir.value = dir >= 0 ? 1 : -1; this.nextFocus = s.focus; this.cur = to;
    wake(2600);
    /* Motion lleva uProgress con un resorte sobreamortiguado; la velocidad del cursor/scroll se suma en el shader */
    this.anim = animate(0, 1, { type: "spring", stiffness: 46, damping: 17, restDelta: .0015, restSpeed: .002, onUpdate: (v) => { this.u.uProgress.value = clamp(v, 0, 1); }, onComplete: () => this.settle() });
  }
  settle() {
    this.u.uTex0.value = this.u.uTex1.value; this.u.uImg0.value.copy(this.u.uImg1.value);
    if (this.nextFocus) this.u.uFocus.value.set(...this.nextFocus);
    this.u.uProgress.value = 0; this.anim = null;
  }
  setVisible(v) {
    this.visible = v;
    if (v && !this.release) this.release = hold();
    else if (!v && this.release) { this.release(); this.release = null; }
  }
  resize() {
    const r = this.host.getBoundingClientRect(); if (!r.width || !r.height) return;
    this.renderer.setPixelRatio(world.dpr);
    this.renderer.setSize(r.width, r.height, false);
    this.u.uRes.value.set(r.width, r.height);
    this.camera.aspect = r.width / r.height; this.camera.updateProjectionMatrix();
    this.mesh.scale.set(this.camera.aspect * 1.06, 1.06, 1);
    this.u.uQ.value = world.tier === "high" ? 1 : world.tier === "medium" ? .5 : 0;
  }
  update(w) {
    if (!this.visible || !this.alive) return;
    if (w.tier === "low" && (this.skip ^= 1)) return;      // tier bajo: 30 fps
    const r = this.host.getBoundingClientRect(), u = this.u, S = w.s;
    const tx = (w.pointerX - r.left) / r.width, ty = 1 - (w.pointerY - r.top) / r.height;
    const dx = Math.max(r.left - w.pointerX, 0, w.pointerX - r.right), dy = Math.max(r.top - w.pointerY, 0, w.pointerY - r.bottom);
    const prox = w.reducedMotion ? 0 : clamp(1 - Math.hypot(dx, dy) / 260, 0, 1);
    const L = this.lx, dt = w.deltaTime;
    /* resorte local viscoso: la materia sigue al cursor con peso */
    const k = 55, c = 17;
    L.vx += (k * (tx - L.x) - c * L.vx) * dt; L.x += L.vx * dt;
    L.vy += (k * (ty - L.y) - c * L.vy) * dt; L.y += L.vy * dt;
    u.uPointer.value.set(L.x, L.y);
    u.uVel.value.x += ((w.pointerVelocity.x / 40) - u.uVel.value.x) * .15;
    u.uVel.value.y += ((-w.pointerVelocity.y / 40) - u.uVel.value.y) * .15;
    u.uProx.value += (prox - u.uProx.value) * .12;
    u.uTime.value = w.time; u.uScrollVel.value = S.scroll.x; u.uEnergy.value = w.interactionEnergy; u.uPress.value = S.press.x;
    u.uView.value = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
    /* cámara real: paralaje espacial según la cercanía del cursor */
    this.camera.position.x += ((L.x - .5) * .22 * u.uProx.value - this.camera.position.x) * .08;
    this.camera.position.y += ((L.y - .5) * .14 * u.uProx.value - this.camera.position.y) * .08;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }
  destroy() {
    this.alive = false; this.host.classList.remove("gl-on");
    this.unsub?.(); this.io?.disconnect(); this.ro?.disconnect(); this.anim?.stop();
    if (this.release) this.release();
    if (this.event) document.removeEventListener(this.event, this.onEvent);
    this.mesh.geometry.dispose(); this.mesh.material.dispose(); this.renderer.dispose(); this.canvas.remove();
  }
}

export function initMaterials() {
  if (reduceMotion.matches || !window.WebGL2RenderingContext) return () => {};
  const made = [];
  const add = async (cfg) => {
    try {
      const s = new Surface(cfg);
      made.push(s);
      const idx = cfg.initial ? cfg.initial() : 0;
      if (!(await s.start(idx))) s.destroy();
    } catch (e) { console.warn("[materials] fallback DOM", e); }
  };
  const hv = document.querySelector(".hero .hv");
  if (hv) add({ host: hv, mount: hv, imgs: () => [...hv.querySelectorAll(".hz img")], event: "chita:hero", initial: () => Math.max(0, [...hv.querySelectorAll(".hz")].findIndex((z) => z.classList.contains("on"))) });
  const vr = document.querySelector(".vr .vrs")?.parentElement;
  if (vr) add({ host: vr, mount: vr, imgs: () => [...vr.querySelectorAll(".vrz img")], event: "chita:vr", initial: () => Math.max(0, [...vr.querySelectorAll(".vrz")].findIndex((z) => z.classList.contains("on"))) });
  const nph = document.getElementById("nph");
  if (nph) add({ host: nph, mount: nph, imgs: () => [nph.querySelector("img")], still: true });
  return () => made.forEach((s) => s.destroy());
}
