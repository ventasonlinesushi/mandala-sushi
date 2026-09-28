/* ============================================================
   Service Worker de Mandala Sushi: caché offline de la app.
   Al actualizar archivos, incrementa CACHE (ej. mandala-v2).
   ============================================================ */
const CACHE = "mandala-v13-horario-semanal";
const ASSETS = [
  "./",
  "index.html",
  "style.css?v=extras-1",
  "logo.png",
  "manifest.json",
  "mandala-card.png",
  "js/core/container.js",
  "js/core/observable.js",
  "js/config/brand-config.js?v=horario-1",
  "js/models/cart-item.js",
  "js/data/menu-data.js?v=promos-semanales-1",
  "js/repositories/storage-repository.js",
  "js/repositories/cart-repository.js",
  "js/repositories/loyalty-repository.js",
  "js/repositories/order-repository.js",
  "js/services/currency-service.js",
  "js/services/gradient-service.js",
  "js/services/catalog-service.js?v=promos-semanales-1",
  "js/services/menu-options-service.js?v=2",
  "js/services/cart-service.js?v=promos-semanales-1",
  "js/services/loyalty-service.js",
  "js/services/hours-service.js?v=horario-1",
  "js/services/order-service.js?v=alga-1",
  "js/services/checkout-service.js?v=alga-1",
  "js/viewmodels/catalog-vm.js",
  "js/viewmodels/cart-vm.js?v=extras-1",
  "js/viewmodels/loyalty-vm.js",
  "js/viewmodels/checkout-vm.js?v=alga-1",
  "js/viewmodels/package-vm.js",
  "js/views/menu-view.js?v=promos-semanales-1",
  "js/views/drawer-view.js?v=extras-1",
  "js/views/checkout-view.js?v=alga-1",
  "js/views/sheet-view.js?v=promos-semanales-1",
  "js/views/app-view.js?v=extras-1",
  "js/main.js?v=promos-semanales-1"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === "basic") {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
