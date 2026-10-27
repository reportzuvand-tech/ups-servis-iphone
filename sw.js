/* UPS Servis — offline: the app files are kept on the phone; the server (Google) is always asked over the network */
const V="ups-64df259d01",SHELL=["./","index.html","config.js","manifest.webmanifest","lib/html2pdf.bundle.min.js","lib/xlsx.full.min.js","lib/exceljs.min.js","icons/apple-touch-icon.png","icons/icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.hostname.endsWith("google.com")||u.hostname.endsWith("googleusercontent.com")&&!u.hostname.startsWith("fonts"))return;
  if(u.origin===location.origin&&(r.mode==="navigate"||u.pathname.endsWith("/index.html")||u.pathname.endsWith("/config.js"))){
    /* the page itself: fresh from the network when online, the saved copy offline */
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==="navigate"?"index.html":r,cp));return res}).catch(()=>caches.match(r.mode==="navigate"?"index.html":r).then(m=>m||caches.match("./"))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
