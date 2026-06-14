/* Homepage orchestration: nav, smooth scroll, hero timeline, card drops,
   dashboard tilt, 3D capability gate. Depends on GSAP, ScrollTrigger, Lenis
   (loaded as globals before this file). Respects prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document;

  /* ---------- nav ---------- */
  var nav = doc.getElementById("nav");
  var navToggle = doc.getElementById("nav-toggle");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (navToggle) {
    navToggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll(".nav-links a, .nav-links .btn-pill").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---------- footer year ---------- */
  var yr = doc.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll (deterministic — never leaves content hidden) ---------- */
  var reveals = [].slice.call(doc.querySelectorAll(".reveal"));
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revTicking = false;
    var vh = function () { return window.innerHeight || doc.documentElement.clientHeight; };
    var checkReveal = function () {
      for (var i = reveals.length - 1; i >= 0; i--) {
        if (reveals[i].getBoundingClientRect().top < vh() - 20) { reveals[i].classList.add("in"); reveals.splice(i, 1); }
      }
    };
    window.addEventListener("scroll", function () { if (!revTicking) { revTicking = true; requestAnimationFrame(function () { checkReveal(); revTicking = false; }); } }, { passive: true });
    window.addEventListener("resize", checkReveal, { passive: true });
    checkReveal();
  }

  /* ---------- floating terrain cards drop in (bulletproof, GSAP-independent) ---------- */
  var drops = [].slice.call(doc.querySelectorAll(".drop-card"));
  if (drops.length) {
    if (reduce) {
      drops.forEach(function (d) { d.classList.add("dropped"); });
    } else {
      var dTick = false;
      var checkDrop = function () {
        var dvh = window.innerHeight || 800;
        for (var i = drops.length - 1; i >= 0; i--) {
          if (drops[i].getBoundingClientRect().top < dvh - 20) { drops[i].classList.add("dropped"); drops.splice(i, 1); }
        }
      };
      window.addEventListener("scroll", function () { if (!dTick) { dTick = true; requestAnimationFrame(function () { checkDrop(); dTick = false; }); } }, { passive: true });
      checkDrop();
    }
  }

  /* ---------- motion (GSAP) ---------- */
  var hasGSAP = window.gsap;
  if (!reduce && hasGSAP) {
    var gsap = window.gsap;

    /* smooth scroll via Lenis (driven by the gsap ticker) */
    if (window.Lenis) {
      var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      /* anchor links go through Lenis */
      doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var id = a.getAttribute("href");
          if (id.length > 1 && doc.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
        });
      });
    }

    /* hero intro timeline — line mask-reveal + staggered fade-up */
    var lines = gsap.utils.toArray(".hero h1 .line > span");
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(lines, { yPercent: 110 });
    gsap.set([".hero-eyebrow", ".hero-sub", ".hero-cta", ".trust"], { opacity: 0, y: 24 });
    tl.to(lines, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.15)
      .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0.1)
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.6 }, 0.6)
      .to(".hero-cta", { opacity: 1, y: 0, duration: 0.6 }, 0.75)
      .to(".trust", { opacity: 1, y: 0, duration: 0.6 }, 0.9);

  }

  /* ---------- dashboard mouse-tilt ---------- */
  var dash = doc.getElementById("dashboard");
  if (dash && !reduce && window.matchMedia("(pointer:fine)").matches) {
    var frame;
    dash.addEventListener("pointermove", function (e) {
      var r = dash.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        dash.style.transform = "rotateY(" + px * 7 + "deg) rotateX(" + -py * 6 + "deg)";
      });
    });
    dash.addEventListener("pointerleave", function () {
      cancelAnimationFrame(frame);
      dash.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }
})();
