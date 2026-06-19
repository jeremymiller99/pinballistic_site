/* =========================================================
   PINBALLISTIC — site behaviour
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIG — edit these two lines and you're done.
   --------------------------------------------------------- */
const CONFIG = {
  // Your Steam wishlist / store page URL (or itch.io, etc.)
  WISHLIST_URL: "https://store.steampowered.com/app/4494280/Pinballistic/",
};

/* ---------------------------------------------------------
   2. Wire up every wishlist button
   --------------------------------------------------------- */
document.querySelectorAll("[data-wishlist]").forEach((el) => {
  el.setAttribute("href", CONFIG.WISHLIST_URL);
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});

/* ---------------------------------------------------------
   3. Shooting stars — random angle / position every time
   --------------------------------------------------------- */
(function shootingStars() {
  const field = document.querySelector(".starfield");
  if (!field) return;

  // Honour reduced-motion: skip the streaks entirely.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;

  const TINTS = ["#21e6ff", "#ff2e88", "#ffb627", "#ffffff", "#8cff5c"];
  const rand = (min, max) => min + Math.random() * (max - min);

  function spawn() {
    const star = document.createElement("span");
    star.className = "shooting-star";

    // Random diagonal angle, biased away from near-horizontal/vertical.
    // Half go down-right, half go down-left, for variety.
    const base = rand(20, 70);
    const goLeft = Math.random() < 0.5;
    const angle = goLeft ? 180 - base : base;
    const rad = (angle * Math.PI) / 180;

    const dist = rand(45, 80); // travel distance, in vmax
    const tx = (Math.cos(rad) * dist).toFixed(1) + "vmax";
    const ty = (Math.sin(rad) * dist).toFixed(1) + "vmax";

    // Spawn within the currently visible area so it's seen while scrolling.
    const top = window.scrollY + rand(0.02, 0.6) * window.innerHeight;
    const left = rand(0.05, 0.9) * window.innerWidth;

    star.style.setProperty("--angle", angle + "deg");
    star.style.setProperty("--tx", tx);
    star.style.setProperty("--ty", ty);
    star.style.setProperty("--tint", TINTS[Math.floor(rand(0, TINTS.length))]);
    star.style.setProperty("--max", rand(0.25, 0.5).toFixed(2));
    star.style.top = top + "px";
    star.style.left = left + "px";
    star.style.animation = `shoot ${rand(1.6, 3.2).toFixed(2)}s ease-in forwards`;

    star.addEventListener("animationend", () => star.remove());
    field.appendChild(star);
  }

  // Occasional, staggered streaks — subtle, not a meteor shower.
  function loop() {
    spawn();
    setTimeout(loop, rand(2600, 6500));
  }
  setTimeout(loop, 1200);
})();

/* ---------------------------------------------------------
   3b. Screenshot carousel — arrows, dots, swipe/scroll sync
   --------------------------------------------------------- */
(function carousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-carousel-track]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  const dotsWrap = root.querySelector("[data-carousel-dots]");

  // --- where the screenshots live (edit these if you rename things) ---
  const FOLDER = "assets/screenshots/"; // subfolder holding the pics
  const PREFIX = "shot-";               // file name prefix -> shot-1, shot-2, ...
  const EXTS = ["png", "jpg", "jpeg", "webp", "gif"]; // formats to try

  // Try to load a single URL; resolve true if it exists, false if 404.
  function exists(src) {
    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(true);
      probe.onerror = () => resolve(false);
      probe.src = src;
    });
  }

  // For index n, return the first matching URL across EXTS (or null).
  async function findShot(n) {
    for (const ext of EXTS) {
      const src = `${FOLDER}${PREFIX}${n}.${ext}`;
      if (await exists(src)) return src;
    }
    return null;
  }

  // Walk shot-1, shot-2, ... until a number is missing, building slides.
  async function buildSlides() {
    let n = 1;
    let src;
    while ((src = await findShot(n))) {
      const slide = document.createElement("div");
      slide.className = "shot";
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Pinballistic screenshot " + n;
      img.loading = "lazy";
      slide.appendChild(img);
      track.appendChild(slide);
      n++;
    }
    return Array.from(track.children);
  }

  buildSlides().then((slides) => {
    if (!slides.length) {
      // No screenshots found — leave the carousel hidden.
      return;
    }
    root.hidden = false;
    initControls(slides);
  });

  function initControls(slides) {
  // Build one dot per slide.
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", "Go to screenshot " + (i + 1));
    dot.addEventListener("click", () => scrollToSlide(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function step() {
    // Distance from one slide's start to the next (width + gap).
    return slides.length > 1
      ? slides[1].offsetLeft - slides[0].offsetLeft
      : slides[0].offsetWidth;
  }

  function scrollToSlide(i) {
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    track.scrollTo({ left: slides[clamped].offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  function activeIndex() {
    return Math.round(track.scrollLeft / step());
  }

  function update() {
    const i = activeIndex();
    dots.forEach((d, n) => d.classList.toggle("carousel__dot--active", n === i));
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
  }

  prevBtn.addEventListener("click", () => scrollToSlide(activeIndex() - 1));
  nextBtn.addEventListener("click", () => scrollToSlide(activeIndex() + 1));

  let raf = null;
  track.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      update();
    });
  });
  window.addEventListener("resize", update);
  update();
  }
})();

/* ---------------------------------------------------------
   4. Footer year
   --------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
