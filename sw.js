/* Service Worker self-destruct
   El sitio dejó de ser PWA. Este SW reemplaza cualquier SW viejo de Workbox
   que haya quedado instalado en browsers de visitantes antiguos. Al activarse:
   1. Borra TODAS las caches.
   2. Se desregistra a sí mismo.
   3. Recarga los clients abiertos para que pidan los assets frescos.
   Una vez aplicado, los próximos visitantes ya no tendrán SW activo. */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) { /* ignore */ }
    try { await self.registration.unregister(); } catch (e) { /* ignore */ }
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (e) {} });
    } catch (e) { /* ignore */ }
  })());
});

/* No interceptamos fetch — los browsers van directo a la red. */
