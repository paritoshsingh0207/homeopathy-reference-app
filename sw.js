const CACHE='homeopathy-ref-runtime-v3-pages-20260815';
const BASE=new URL(self.registration.scope).pathname;
const path=(value='')=>`${BASE}${value.replace(/^\/+/, '')}`;
const SHELL=[BASE,path('manifest.webmanifest'),path('safety/rules_v3.json')];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  // Corpus and safety data are network-first so a corrected release replaces
  // previously cached historical data. Cache is only the offline fallback.
  if(url.pathname.startsWith(path('data/v3/'))||url.pathname.startsWith(path('safety/'))){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const response=await fetch(event.request);
        if(response.ok) await cache.put(event.request,response.clone());
        return response;
      }catch(error){
        const cached=await cache.match(event.request);
        if(cached) return cached;
        throw error;
      }
    })());
    return;
  }

  // Navigation and built assets are also network-first, but successful same-
  // origin responses are cached so an already-used app can reopen offline.
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request);
      if(response.ok) await cache.put(event.request,response.clone());
      return response;
    }catch(error){
      const cached=await cache.match(event.request);
      if(cached) return cached;
      if(event.request.mode==='navigate'){
        const shell=await cache.match(BASE);
        if(shell) return shell;
      }
      throw error;
    }
  })());
});
