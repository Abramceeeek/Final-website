/* Shared inner-page behaviour: nav, Lenis smooth scroll, reveals,
   skill bars, FAQ, contact form. Depends on Lenis (optional). */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document;

  /* nav */
  var nav = doc.getElementById("nav");
  var toggle = doc.getElementById("nav-toggle");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }
  var yr = doc.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* smooth scroll */
  if (!reduce && window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1 && doc.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -80 }); }
      });
    });
  }

  /* reveal on scroll (deterministic — never leaves content hidden) */
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

  /* skill bars */
  var fills = doc.querySelectorAll(".skill-fill[data-pct]");
  if (fills.length) {
    var setFill = function (el) { el.style.width = (el.getAttribute("data-pct") || "0") + "%"; };
    if (reduce || !("IntersectionObserver" in window)) {
      fills.forEach(setFill);
    } else {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { setFill(e.target); sio.unobserve(e.target); } });
      }, { threshold: 0.4 });
      fills.forEach(function (el) { sio.observe(el); });
    }
  }

  /* faq accordion */
  doc.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      doc.querySelectorAll(".faq-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!open) item.classList.add("open");
    });
  });

  /* contact form (FormSubmit AJAX) */
  var form = doc.getElementById("contact-form");
  if (form) {
    var btn = form.querySelector(".btn-submit");
    var bText = btn && btn.querySelector(".btn-text");
    var bLoad = btn && btn.querySelector(".btn-loading");
    var modal = doc.getElementById("success-modal");

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function showErr(field, msg) {
      field.classList.add("error");
      var e = doc.getElementById(field.id + "-error");
      if (e) { e.textContent = msg; e.style.display = "block"; }
    }
    function clearErrs() {
      form.querySelectorAll(".field-error").forEach(function (e) { e.style.display = "none"; e.textContent = ""; });
      form.querySelectorAll(".input.error").forEach(function (f) { f.classList.remove("error"); });
    }
    function validate() {
      clearErrs();
      var ok = true;
      ["name", "email", "subject", "message"].forEach(function (id) {
        var f = doc.getElementById(id);
        if (f && !f.value.trim()) { showErr(f, "This field is required"); ok = false; }
      });
      var em = doc.getElementById("email");
      if (em && em.value.trim() && !emailRe.test(em.value.trim())) { showErr(em, "Enter a valid email address"); ok = false; }
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      if (btn) btn.disabled = true;
      if (bText) bText.style.display = "none";
      if (bLoad) bLoad.style.display = "inline-flex";
      fetch("https://formsubmit.co/ajax/abdurakhmonbekfayzullaev@gmail.com", {
        method: "POST", headers: { Accept: "application/json" }, body: new FormData(form),
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && (res.success === "true" || res.success === true)) {
            if (modal) modal.classList.add("show");
            form.reset();
          } else { alert("Failed to send. Please email me directly."); }
        })
        .catch(function () { alert("Failed to send. Please email me directly."); })
        .finally(function () {
          if (btn) btn.disabled = false;
          if (bText) bText.style.display = "inline";
          if (bLoad) bLoad.style.display = "none";
        });
    });

    if (modal) {
      var close = function () { modal.classList.remove("show"); };
      modal.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", close); });
      modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
      doc.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
  }
})();
