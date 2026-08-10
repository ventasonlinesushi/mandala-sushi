const CACHE = "mandala-admin-v1";
const ASSETS = [
  "/admin/",
  "/admin/index.html",
  "/admin/admin.css",
  "/admin/admin.js",
  "/admin/cocina.html",
  "/admin/cocina.css",
  "/admin/cocina.js",
  "/admin/manifest.json",
  "../js/config/brand-config.js",
  "../js/data/menu-data.js",
  "../logo.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
