import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { pointerState, reduceMotion } from "./core.js";
import { sensoryState } from "./sensor.js";

export function initWebGL() {
  const host = document.querySelector(".hero .tx");
  if (!host || reduceMotion.matches || !window.WebGLRenderingContext) return () => {};
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" }); } catch { return () => {}; }
  const canvas = renderer.domElement;
  canvas.className = "hero-atmosphere";
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(.5, .5) }, uSize: { value: new THREE.Vector2(1, 1) },
    uScroll: { value: 0 }, uVelocity: { value: 0 }, uDirection: { value: 1 }, uProximity: { value: 0 }, uEnergy: { value: 0 }
  };
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms,
    vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
    fragmentShader: `
      precision highp float;
      uniform float uTime, uScroll, uVelocity, uDirection, uProximity, uEnergy;
      uniform vec2 uPointer, uSize;
      float field(vec2 p, vec2 center, float radius){ vec2 q=(p-center)*vec2(uSize.x/uSize.y,1.0); return exp(-dot(q,q)/radius); }
      float noise(vec2 p){ return sin(p.x*8.31+sin(p.y*5.17+uTime*.13))*sin(p.y*6.73+uTime*.09)*.5+.5; }
      void main(){
        vec2 uv=gl_FragCoord.xy/uSize;
        float energy=clamp(uEnergy+abs(uVelocity)*.12+uProximity*.18,0.,1.);
        vec2 pointer=(uPointer-.5)*vec2(.8,-.65);
        float phase=uTime*.16+uScroll*5.0*uDirection;
        vec2 drift=pointer*.12+vec2(sin(phase),cos(phase*.73))*(.025+energy*.06);
        vec2 warp=uv+vec2(sin(uv.y*8.0+phase),cos(uv.x*7.0-phase))*(.012+energy*.025);
        float primary=field(warp,vec2(.78,.7)+drift,.13)*(0.32+energy*.75);
        float secondary=field(warp,vec2(.21,.25)-drift,.23)*(0.16+energy*.35);
        float wake=field(warp,vec2(.5,.48)+pointer*.32,.36)*uProximity*.24;
        float grain=(noise(warp*1.7)-.5)*(.012+energy*.025);
        vec3 color=vec3(.10,.56,.70)*(primary+secondary+wake+grain);
        float alpha=clamp(primary+secondary+wake+grain,0.,.85);
        gl_FragColor=vec4(color,alpha*.6);
      }`
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);
  const lowPower = innerWidth < 900 || (navigator.hardwareConcurrency || 8) < 4;
  renderer.setPixelRatio(lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
  let active = true, visible = true, frame = 0, last = performance.now();
  const root = document.documentElement;
  const resize = () => { const rect = host.getBoundingClientRect(); if (!rect.width || !rect.height) return; renderer.setSize(rect.width, rect.height, false); uniforms.uSize.value.set(rect.width * renderer.getPixelRatio(), rect.height * renderer.getPixelRatio()); };
  const render = (now) => {
    frame = 0;
    if (!active || !visible || document.hidden) return;
    uniforms.uTime.value += Math.min((now - last) / 1000, .05); last = now;
    uniforms.uScroll.value += (sensoryState.viewportProgress - uniforms.uScroll.value) * .04;
    uniforms.uPointer.value.x += ((pointerState.normalizedX * .5 + .5) - uniforms.uPointer.value.x) * .14;
    uniforms.uPointer.value.y += ((pointerState.normalizedY * .5 + .5) - uniforms.uPointer.value.y) * .14;
    uniforms.uVelocity.value += (sensoryState.scrollVelocity - uniforms.uVelocity.value) * .16;
    uniforms.uDirection.value += (sensoryState.scrollDirection - uniforms.uDirection.value) * .12;
    uniforms.uProximity.value += (sensoryState.proximity - uniforms.uProximity.value) * .15;
    uniforms.uEnergy.value += (sensoryState.interactionIntensity - uniforms.uEnergy.value) * .12;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  const start = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(render); } };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }, { threshold: 0 });
  observer.observe(host);
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", start, { passive: true });
  resize(); start();
  return () => { active = false; if (frame) cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", start); mesh.geometry.dispose(); material.dispose(); renderer.dispose(); canvas.remove(); };
}
