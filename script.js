/* =========================================================
   PINBALLISTIC — site behaviour
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIG — edit these two lines and you're done.
   --------------------------------------------------------- */
const CONFIG = {
  // Your Steam wishlist / store page URL (or itch.io, etc.)
  WISHLIST_URL: "https://store.steampowered.com/app/000000/Pinballistic/",

  // If you pasted your beehiiv embed id into index.html's form action,
  // set this to true to hide the setup warning note.
  BEEHIIV_CONNECTED: false,
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
   4. Newsletter form (beehiiv)
   --------------------------------------------------------- */
(function newsletter() {
  const form = document.getElementById("newsletter-form");
  const note = document.getElementById("news-note");
  if (!form) return;

  const connected =
    CONFIG.BEEHIIV_CONNECTED &&
    !form.action.includes("YOUR_PUBLICATION_ID");

  if (connected) {
    note.textContent = "✓ You're one coin away. We'll only email the good stuff.";
    note.classList.add("news-form__note--ok");
  }

  form.addEventListener("submit", (e) => {
    // If the embed isn't wired up yet, don't fire a broken request.
    if (form.action.includes("YOUR_PUBLICATION_ID")) {
      e.preventDefault();
      note.textContent =
        "⚠ Newsletter not connected yet — add your beehiiv embed id in index.html.";
      note.classList.remove("news-form__note--ok");
      return;
    }
    // Otherwise let the form post to beehiiv (opens in a new tab).
    note.textContent = "✓ Inserting coin… check the new tab to confirm.";
    note.classList.add("news-form__note--ok");
  });
})();

/* ---------------------------------------------------------
   5. Footer year
   --------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
