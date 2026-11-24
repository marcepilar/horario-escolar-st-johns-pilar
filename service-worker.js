/* St. John's School — DEMO NO OFICIAL. No comparte caché con otros colegios. */
const CACHE_NAME = 'marktech-horario-stjohns-pilar-demo-v1.0.1';
const SHELL = [ './', './index.html','./manifest.webmanifest','./version.json',
  './icon-192.png','./icon-512.png','./apple-touch-icon.png','./banner-st-johns-pilar.png','./icon-maskable-512.png','./favicon-48.png', './qr-horario.png' ];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)));
});
self.addEventListener('activate', event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys
    .filter(k=>k.startsWith('marktech-horario-stjohns-pilar-demo-') && k!==CACHE_NAME)
    .map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{ if(event.data?.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const u=new URL(req.url);
  if(u.origin!==self.location.origin) return;
  if(!u.pathname.startsWith(new URL('./',self.location.href).pathname)) return;
  if(u.pathname.endsWith('/version.json')) {event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('./version.json')));return;}
  if(req.mode==='navigate') {
    event.respondWith(fetch(req).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
