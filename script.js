/* =========================================================
   CONTATOS: edite aqui. Deixe "" para esconder o botão.
   ========================================================= */
const CONTATOS = {
  email:     "victorfernandes018@gmail.com",            // e-mail público do seu GitHub
  linkedin:  "https://www.linkedin.com/in/v%C3%ADctor-silva-fernandes-459a3020a",
  github:    "victorfernandes018-ui",
  whatsapp:  "5519981683831",   // só números com DDI e DDD
  instagram: "",   // só o usuário, sem @
};
const MSG_WHATS = "Olá, Victor! Vi seu portfólio e quero conversar sobre um site.";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Contatos ---------- */
(function contatos() {
  const urls = {
    whatsapp:  n => `https://wa.me/${n}?text=${encodeURIComponent(MSG_WHATS)}`,
    instagram: u => `https://instagram.com/${u.replace(/^@/, "")}`,
    linkedin:  l => l,
    github:    u => `https://github.com/${u}`,
  };
  document.querySelectorAll("[data-contact]").forEach(a => {
    const v = (CONTATOS[a.dataset.contact] || "").trim();
    if (!v) return a.remove();
    a.href = urls[a.dataset.contact](v);
  });

  const row = document.getElementById("mailRow");
  if (!CONTATOS.email) return row.remove();
  const link = document.getElementById("mailLink");
  link.textContent = CONTATOS.email;
  link.href = `mailto:${CONTATOS.email}?subject=${encodeURIComponent("Projeto de site")}`;
  const btn = document.getElementById("copyBtn");
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(CONTATOS.email); btn.querySelector("span").textContent = "Copiado!"; }
    catch (e) { btn.querySelector("span").textContent = "Selecione e copie"; }
    setTimeout(() => (btn.querySelector("span").textContent = "Copiar"), 2000);
  });
})();

/* ---------- Menu e nav ---------- */
(function nav() {
  const nav = document.getElementById("nav");
  const btn = document.getElementById("menuBtn");
  const set = open => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => set(false)));
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();

/* ---------- Holofote no rosto ---------- */
(function spotlight() {
  const hero = document.querySelector(".hero");
  const photo = document.querySelector(".hero-photo");
  const hint = document.getElementById("hint");
  // posição do rosto na foto (fração da imagem)
  const FACE = { x: 0.5, y: 0.42 };
  let tx, ty, x, y, moved = false, idle = 0;

  function facePoint() {
    const h = hero.getBoundingClientRect(), p = photo.getBoundingClientRect();
    return { x: p.left - h.left + p.width * FACE.x, y: p.top - h.top + p.height * FACE.y };
  }
  function reset() { const f = facePoint(); tx = f.x; ty = f.y; if (x == null) { x = tx; y = ty; } }
  reset(); addEventListener("resize", reset);

  function point(cx, cy) {
    const h = hero.getBoundingClientRect();
    tx = cx - h.left; ty = cy - h.top; idle = 0;
    if (!moved) { moved = true; hint.classList.add("gone"); }
  }
  hero.addEventListener("pointermove", e => point(e.clientX, e.clientY));
  hero.addEventListener("pointerdown", e => point(e.clientX, e.clientY));

  let t0 = performance.now();
  function frame(now) {
    const dt = Math.min(64, now - t0); t0 = now;
    idle += dt;
    if (!moved || idle > 3500) {            // sem interação: volta ao rosto e "respira"
      const f = facePoint();
      const k = now / 1000;
      tx = f.x + Math.sin(k * 0.9) * 26; ty = f.y + Math.cos(k * 0.7) * 16;
    }
    const ease = reduce ? 1 : 0.12;
    x += (tx - x) * ease; y += (ty - y) * ease;
    hero.style.setProperty("--mx", x + "px");
    hero.style.setProperty("--my", y + "px");
    if (hero.getBoundingClientRect().bottom > 0) requestAnimationFrame(frame);
    else setTimeout(() => requestAnimationFrame(frame), 300);
  }
  requestAnimationFrame(frame);
})();

/* ---------- Cursor personalizado ---------- */
(function cursor() {
  if (!finePointer) return;
  const c = document.querySelector(".cursor");
  let x = -100, y = -100, cx = x, cy = y;
  addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; c.classList.add("on"); });
  document.addEventListener("pointerleave", () => c.classList.remove("on"));
  document.querySelectorAll("a, button, .tag-chip, .shot").forEach(el => {
    el.addEventListener("pointerenter", () => c.classList.add("big"));
    el.addEventListener("pointerleave", () => c.classList.remove("big"));
  });
  (function loop() {
    cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();
})();

/* ---------- Manifesto: palavras acendem ao rolar ---------- */
(function manifesto() {
  const el = document.getElementById("manifesto");
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.append(part);
          else { const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.append(s); }
        });
        n.replaceWith(frag);
      } else walk(n);
    });
  };
  walk(el);
  const words = el.querySelectorAll(".w");
  if (reduce) return words.forEach(w => w.classList.add("lit"));
  const update = () => {
    const r = el.getBoundingClientRect();
    const p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35);
    const n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < n));
  };
  addEventListener("scroll", update, { passive: true }); update();
})();

/* ---------- Linha da trajetória ---------- */
(function timeline() {
  const tl = document.getElementById("timeline");
  const update = () => {
    const r = tl.getBoundingClientRect();
    const p = (innerHeight * 0.6 - r.top) / r.height;
    tl.style.setProperty("--fill", Math.max(0, Math.min(1, p)).toFixed(3));
  };
  addEventListener("scroll", update, { passive: true }); update();
})();

/* ---------- Aparecer ao rolar ---------- */
(function reveal() {
  const els = document.querySelectorAll(".project, .about-meta div, .timeline li, .services-head > *, .contact-title, .work-head");
  if (reduce || !("IntersectionObserver" in window)) return;
  els.forEach(el => el.classList.add("rv"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
})();

/* ---------- Peças de serviços com física ---------- */
(function pit() {
  const box = document.getElementById("pit");
  const chips = [...box.querySelectorAll(".tag-chip")];
  const hint = box.querySelector(".pit-hint");
  const goStatic = () => { box.classList.add("static"); hint && hint.remove(); };
  if (reduce) return goStatic();

  const start = () => {
    const M = window.Matter;
    if (!M) return goStatic();
    const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body } = M;
    const engine = Engine.create({ gravity: { y: 1 } });
    const W = () => box.clientWidth, H = () => box.clientHeight;
    const wallOpts = { isStatic: true };
    let walls = [];
    const buildWalls = () => {
      Composite.remove(engine.world, walls);
      const w = W(), h = H(), t = 200;
      walls = [
        Bodies.rectangle(w / 2, h + t / 2, w * 3, t, wallOpts),
        Bodies.rectangle(-t / 2, h / 2, t, h * 4, wallOpts),
        Bodies.rectangle(w + t / 2, h / 2, t, h * 4, wallOpts),
      ];
      Composite.add(engine.world, walls);
    };
    buildWalls();

    const bodies = chips.map((el, i) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const x = 60 + Math.random() * Math.max(10, W() - 120);
      const y = -80 - i * 70;
      const b = Bodies.rectangle(x, y, w, h, { chamfer: { radius: h / 2 }, restitution: 0.35, friction: 0.2, density: 0.002 });
      Body.setAngle(b, (Math.random() - 0.5) * 0.6);
      b.el = el; b.w = w; b.h = h;
      return b;
    });
    Composite.add(engine.world, bodies);

    if (finePointer) {
      const mouse = Mouse.create(box);
      mouse.element.removeEventListener("wheel", mouse.mousewheel);
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } }));
    } else {
      hint && (hint.textContent = "toque nas peças ↓");
      box.addEventListener("pointerdown", e => {
        const r = box.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        bodies.forEach(b => {
          const dx = b.position.x - px, dy = b.position.y - py, d = Math.hypot(dx, dy);
          if (d < 160) Body.setVelocity(b, { x: dx / d * 9, y: -12 });
        });
      });
    }

    addEventListener("resize", () => {
      buildWalls();
      bodies.forEach(b => { if (b.position.x > W()) Body.setPosition(b, { x: W() - 80, y: 0 }); });
    });

    let last = performance.now();
    (function tick(now) {
      Engine.update(engine, Math.min(1000 / 30, now - last)); last = now;
      bodies.forEach(b => {
        b.el.style.transform = `translate3d(${b.position.x - b.w / 2}px, ${b.position.y - b.h / 2}px, 0) rotate(${b.angle}rad)`;
      });
      requestAnimationFrame(tick);
    })(last);
  };

  chips.forEach(c => (c.style.transform = "translate3d(-999px,-999px,0)"));
  const io = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { io.disconnect(); document.fonts.ready.then(start); }
  }, { threshold: 0.3 });
  io.observe(box);
})();

document.getElementById("year").textContent = new Date().getFullYear();
