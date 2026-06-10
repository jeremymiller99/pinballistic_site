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
   3. Animated DMD score ticker (pure flavour)
   --------------------------------------------------------- */
(function dmdTicker() {
  const scoreEl = document.getElementById("dmd-score");
  const multEl = document.getElementById("dmd-mult");
  if (!scoreEl) return;

  let score = 0;
  let mult = 1;

  function pad(n, len) {
    return String(n).padStart(len, "0");
  }

  setInterval(() => {
    // bump the score by a mult-scaled chunk
    score += Math.floor((1500 + Math.floor(Math.sqrt(score + 1) * 30)) * mult);
    if (score > 999999999) score = 0; // roll over the display
    scoreEl.textContent = pad(score, 9);

    // occasionally bump the multiplier for that "combo" feel
    if (Math.floor(score / 50000) % 7 === 0) {
      mult = Math.min(mult + 1, 9);
    } else if (mult > 1 && Math.floor(score / 90000) % 5 === 0) {
      mult = 1;
    }
    multEl.textContent = "x" + mult;
  }, 120);
})();

/* ---------------------------------------------------------
   3b. Shooting stars — random angle / position every time
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
   4. Footer year
   --------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
