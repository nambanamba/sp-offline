/* スペシャル計算（機内用）の service worker
   画面の部品だけを手元に置き、ネットより手元を先に使う。問題の画像はここに無い（IndexedDB に入る）
   ★同じ nambanamba.github.io のほかのアプリの cache は消さない（消すのは sp-offline- で始まる古いものだけ） */
const C = "sp-offline-3e4e7293c0";
const PRE = ["./", "index.html", "app.js", "off.js", "manifest.json", "icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(PRE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("sp-offline-") && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || !e.request.url.startsWith(self.registration.scope)) return;
  e.respondWith(caches.open(C).then(c => c.match(e.request, {ignoreSearch: true}).then(hit => {
    if (hit) return hit;
    return fetch(e.request).catch(() => e.request.mode === "navigate" ? c.match("index.html") : Response.error());
  })));
});
