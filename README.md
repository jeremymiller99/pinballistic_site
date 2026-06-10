# PINBALLISTIC — Marketing Site

A single-page, zero-dependency marketing site for a retro pinball roguelike.
Pure HTML/CSS/JS, built to be hosted free on **GitHub Pages** with a custom
domain, a **beehiiv** newsletter signup, and a **wishlist** button.

```
pinballistic_site/
├─ index.html        ← page content
├─ styles.css        ← retro pinball theme
├─ script.js         ← wishlist wiring, DMD ticker, newsletter
├─ CNAME             ← your custom domain
├─ .nojekyll         ← tells GitHub Pages to serve files as-is
├─ README.md         ← this file
└─ assets/
   └─ favicon.svg    ← (drop screenshots + og-image.png here too)
```

---

## 1. Set your wishlist link

Open `script.js` and edit the top:

```js
const CONFIG = {
  WISHLIST_URL: "https://store.steampowered.com/app/000000/Pinballistic/",
  BEEHIIV_CONNECTED: false,
};
```

Every "Wishlist" button on the page points here automatically.

## 2. Connect the beehiiv newsletter

1. In beehiiv: **Settings → Publication → Embed** (a.k.a. Subscribe Forms).
2. Copy the embed link — it looks like
   `https://embeds.beehiiv.com/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`.
3. In `index.html`, find the `<form id="newsletter-form">` and replace
   `YOUR_PUBLICATION_ID` in the `action="..."` with your id.
4. In `script.js`, set `BEEHIIV_CONNECTED: true` to hide the setup warning.

> Prefer beehiiv's own styled box? Just paste their full `<iframe …>` embed
> over the `<form>` block — the dark frame around it will still fit the theme.

## 3. Add your art

- Replace the three `shot--placeholder` divs in `index.html` with
  `<img src="assets/shot-1.png" alt="Gameplay">`.
- Add `assets/og-image.png` (1200×630) for nice social link previews.
- Want a trailer? Uncomment the `.trailer` block in `index.html` and paste
  your YouTube embed id.

---

## 4. Host it on GitHub Pages

1. Create a new GitHub repo and push this folder's contents to it:
   ```bash
   git init
   git add .
   git commit -m "Pinballistic marketing site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick branch `main` and folder `/ (root)`, then **Save**.
5. Your site goes live at `https://YOUR_USER.github.io/YOUR_REPO/` in ~1 min.

## 5. Use your custom domain

1. Edit the `CNAME` file so it contains **only** your domain, e.g.
   `www.pinballistic.com` (already pre-filled — change it to yours).
2. At your domain registrar, add DNS records:
   - **www subdomain** (recommended): a `CNAME` record for `www` →
     `YOUR_USER.github.io`.
   - **apex/root domain** (`pinballistic.com`): four `A` records →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and optionally `AAAA` records for IPv6).
3. Back in **Settings → Pages → Custom domain**, enter your domain and
   tick **Enforce HTTPS** (available once DNS verifies, usually < 1 hr).

That's it — neon's on, machine's warm. Go break some high scores. ★
