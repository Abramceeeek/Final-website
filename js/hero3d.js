// Hero centerpiece — twisted gradient ribbon (green -> cyan -> violet).
// ES module; lazy-imported by home.js only when WebGL + motion are allowed.
import * as THREE from "./lib/three.module.min.js";

export function initHero(canvas) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  // lights: ambient + brand-colored points for the gloss + a white key for sheen
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const lGreen = new THREE.PointLight(0x00e68a, 7, 22);
  lGreen.position.set(-4, 2, 3);
  scene.add(lGreen);
  const lViolet = new THREE.PointLight(0x7c5cff, 7, 22);
  lViolet.position.set(4, -3, 2);
  scene.add(lViolet);

  // gradient helper
  const STOPS = [new THREE.Color("#00e68a"), new THREE.Color("#22d3ee"), new THREE.Color("#7c5cff")];
  const gradAt = (t) =>
    t < 0.5
      ? STOPS[0].clone().lerp(STOPS[1], t / 0.5)
      : STOPS[1].clone().lerp(STOPS[2], (t - 0.5) / 0.5);

  // build a twisted ribbon along a flowing centerline
  const SEG = 260, WIDTH = 0.66, TWISTS = 2.6, LOOPS = 1;
  const up = new THREE.Vector3(0, 1, 0);
  const pos = [], col = [], idx = [];
  const path = (a) =>
    new THREE.Vector3(
      Math.sin(a) * 1.75 + Math.sin(a * 2) * 0.42,
      Math.cos(a * 1.5) * 1.28,
      Math.cos(a) * 1.05 + Math.sin(a * 3) * 0.32
    );

  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    const a = t * Math.PI * 2 * LOOPS;
    const c = path(a);
    const tangent = path(a + 0.01).sub(c).normalize();
    let n = new THREE.Vector3().crossVectors(tangent, up);
    if (n.lengthSq() < 1e-4) n.set(1, 0, 0);
    n.normalize();
    const b = new THREE.Vector3().crossVectors(tangent, n).normalize();
    const tw = t * Math.PI * 2 * TWISTS;
    const side = n.multiplyScalar(Math.cos(tw)).add(b.multiplyScalar(Math.sin(tw))).multiplyScalar(WIDTH / 2);
    const L = c.clone().sub(side), R = c.clone().add(side);
    pos.push(L.x, L.y, L.z, R.x, R.y, R.z);
    const g = gradAt(t);
    col.push(g.r, g.g, g.b, g.r, g.g, g.b);
  }
  for (let i = 0; i < SEG; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
    idx.push(a, b, d, a, d, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.5,
    roughness: 0.28,
    side: THREE.DoubleSide,
    emissive: new THREE.Color("#0a2a1e"),
    emissiveIntensity: 0.45,
  });

  const ribbon = new THREE.Mesh(geo, mat);
  const group = new THREE.Group();
  group.add(ribbon);
  group.rotation.x = 0.35;
  scene.add(group);

  // sizing
  function resize() {
    const el = canvas.parentElement;
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  // pointer parallax
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener("pointermove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.4;
  }, { passive: true });

  // reduced motion: draw one frame and stop
  if (reduce) {
    group.scale.setScalar(1);
    renderer.render(scene, camera);
    return;
  }

  // animate, paused when offscreen
  const start = performance.now();
  let running = false, raf = 0;
  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const t = now * 0.0002;
    const intro = Math.min(1, (now - start) / 1300);
    const ease = 1 - Math.pow(1 - intro, 3);
    group.scale.setScalar(0.7 + ease * 0.3);
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    group.rotation.y = t + cx;
    group.rotation.x = 0.35 + Math.sin(t * 1.2) * 0.12 + cy;
    renderer.render(scene, camera);
  }
  function run() { if (!running) { running = true; frame(); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? run() : stop()), { threshold: 0 });
  io.observe(canvas);
  run();
}
