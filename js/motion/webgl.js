import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { pointerState, reduceMotion } from "./core.js";

export function initWebGL() {
  const host = document.querySelector(".hero .tx");
  if (!host || reduceMotion.matches || !window.WebGLRenderingContext) return () => {};

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" }); }
  catch { return () => {}; }

  const canvas = renderer.domElement;
  canvas.className = "hero-atmosphere";
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(.5, .5) },
    uSize: { value: new THREE.Vector2(1, 1) }, uScroll: { value: 0 },
    uVelocity: { value: 0 }, uAcceleration: { value: 0 }
  };
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms,
    vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
    fragmentShader: `
      precision highp float;
      uniform float uTime, uScroll, uVelocity, uAcceleration;
      uniform vec2 uPointer, uSize;
      float glow(vec2 p, vec2 center, float radius){float d=length((p-center)*vec2(uSize.x/uSize.y,1.0));return exp(-d*d/radius);}
      void main(){
        vec2 uv=gl_FragCoord.xy/uSize;
        float energy=clamp(abs(uVelocity)*.018+abs(uAcceleration)*.02,0.,.07);
        vec2 drift=uPointer*.06+vec2(sin(uTime*.18+uScroll*3.),cos(uTime*.14-uScroll*2.))* (.025+energy);
        float light=glow(uv,vec2(.78,.68)+drift,.16)*(.34+energy)+glow(uv,vec2(.28,.30)-drift,.24)*(.18+energy*.5);
        float grain=sin(dot(uv+uTime*.006+uScroll*.02,vec2(91.7,113.1)))*(.012+energy*.18);
        vec3 color=vec3(.16,.62,.74)*(light+grain);
        gl_FragColor=vec4(color,max(0.,light+grain)*.52);
      }`
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  const lowPower = innerWidth < 900 || (navigator.hardwareConcurrency || 8) < 4;
  renderer.setPixelRatio(lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));

  let active = true, visible = true, frame = 0, last = performance.now();
  const root = document.documentElement;
  const resize = () => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    uniforms.uSize.value.set(rect.width * renderer.getPixelRatio(), rect.height * renderer.getPixelRatio());
  };
  const render = (now) => {
    frame = 0;
    if (!active || !visible || document.hidden) return;
    uniforms.uTime.value += Math.min((now - last) / 1000, .05);
    last = now;
    const progressValue = parseFloat(getComputedStyle(root).getPropertyValue("--scroll-progress")) || 0;
    uniforms.uScroll.value += (progressValue - uniforms.uScroll.value) * .025;
    uniforms.uPointer.value.x += ((pointerState.normalizedX * .5 + .5) - uniforms.uPointer.value.x) * .12;
    uniforms.uPointer.value.y += ((pointerState.normalizedY * .5 + .5) - uniforms.uPointer.value.y) * .12;
    uniforms.uVelocity.value += ((parseFloat(getComputedStyle(root).getPropertyValue("--scroll-velocity")) || 0) - uniforms.uVelocity.value) * .14;
    uniforms.uAcceleration.value += ((parseFloat(getComputedStyle(root).getPropertyValue("--scroll-acceleration")) || 0) - uniforms.uAcceleration.value) * .14;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  const start = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(render); } };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }, { threshold: 0 });
  observer.observe(host);
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", start, { passive: true });
  resize(); start();

  return () => {
    active = false;
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", start);
    material.dispose(); scene.children[0]?.geometry.dispose(); renderer.dispose(); canvas.remove();
  };
}
