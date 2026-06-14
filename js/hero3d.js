// Hero centerpiece — a clean, premium twisted ribbon.
// ES module; lazy-imported by home.js only when WebGL + screen size allow.
// Palette can be overridden before init via window.RIBBON = { stops:[...], envTop, envMid }.
import * as THREE from "./lib/three.module.min.js";

export function initHero(canvas) {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cfg = window.RIBBON || {};
  var STOPS = (cfg.stops || ["#e7eef5", "#34d399", "#0ea5e9"]).map(function (c) { return new THREE.Color(c); });
  var ENV_TOP = cfg.envTop || "#eef5ff";
  var ENV_MID = cfg.envMid || "#16263c";

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 6.6);

  // soft studio environment (procedural gradient -> PMREM) for premium reflections
  (function buildEnv() {
    var c = document.createElement("canvas");
    c.width = 16; c.height = 512;
    var ctx = c.getContext("2d");
    var g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, ENV_TOP);
    g.addColorStop(0.55, ENV_MID);
    g.addColorStop(1, "#05070b");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 16, 512);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    tex.dispose(); pmrem.dispose();
  })();

  // gentle fill lights (env does most of the work)
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  var key = new THREE.DirectionalLight(0xffffff, 0.8);
  key.position.set(4, 5, 6);
  scene.add(key);

  // smooth triangle gradient (palindrome) so the closed loop has no colour seam
  function gradAt(t) {
    var tt = 1 - Math.abs(1 - 2 * t); // 0..1..0
    return tt < 0.5 ? STOPS[0].clone().lerp(STOPS[1], tt / 0.5) : STOPS[1].clone().lerp(STOPS[2], (tt - 0.5) / 0.5);
  }

  // closed, gently-tilted loop with a clean double twist
  var SEG = 440, WIDTH = 0.52, TWISTS = 2;
  var up = new THREE.Vector3(0, 1, 0);
  var path = function (a) {
    return new THREE.Vector3(1.72 * Math.cos(a), 1.12 * Math.sin(a) + 0.34 * Math.sin(2 * a), 0.62 * Math.sin(a));
  };
  var pos = [], col = [], idx = [];
  for (var i = 0; i <= SEG; i++) {
    var t = i / SEG;
    var a = t * Math.PI * 2;
    var c0 = path(a);
    var tan = path(a + 0.008).sub(c0).normalize();
    var n = new THREE.Vector3().crossVectors(tan, up);
    if (n.lengthSq() < 1e-4) n.set(1, 0, 0);
    n.normalize();
    var b = new THREE.Vector3().crossVectors(tan, n).normalize();
    var tw = t * Math.PI * 2 * TWISTS;
    var side = n.multiplyScalar(Math.cos(tw)).add(b.multiplyScalar(Math.sin(tw))).multiplyScalar(WIDTH / 2);
    var L = c0.clone().sub(side), R = c0.clone().add(side);
    pos.push(L.x, L.y, L.z, R.x, R.y, R.z);
    var g = gradAt(t);
    col.push(g.r, g.g, g.b, g.r, g.g, g.b);
  }
  for (var j = 0; j < SEG; j++) {
    var p = j * 2, q = j * 2 + 1, r = (j + 1) * 2, s = (j + 1) * 2 + 1;
    idx.push(p, q, s, p, s, r);
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  var mat = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    metalness: cfg.metalness != null ? cfg.metalness : 0.62,
    roughness: cfg.roughness != null ? cfg.roughness : 0.12,
    clearcoat: 0.85,
    clearcoatRoughness: 0.22,
    envMapIntensity: cfg.envMapIntensity != null ? cfg.envMapIntensity : 1.35,
    side: THREE.DoubleSide,
  });

  var ribbon = new THREE.Mesh(geo, mat);
  var group = new THREE.Group();
  group.add(ribbon);
  group.rotation.set(0.42, 0.3, 0);
  scene.add(group);

  function resize() {
    var el = canvas.parentElement, w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  var tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener("pointermove", function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.35;
  }, { passive: true });

  if (reduce) { group.scale.setScalar(1); renderer.render(scene, camera); return; }

  var start = performance.now(), running = false, raf = 0;
  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var now = performance.now();
    var tnow = now * 0.00016;
    var intro = Math.min(1, (now - start) / 1400);
    var ease = 1 - Math.pow(1 - intro, 3);
    group.scale.setScalar(0.78 + ease * 0.22);
    cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
    group.rotation.y = 0.3 + tnow + cx;
    group.rotation.x = 0.42 + Math.sin(tnow * 1.1) * 0.1 + cy;
    renderer.render(scene, camera);
  }
  function run() { if (!running) { running = true; frame(); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  new IntersectionObserver(function (e) { e[0].isIntersecting ? run() : stop(); }, { threshold: 0 }).observe(canvas);
  run();
}
