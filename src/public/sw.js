;
const CACHE_NAME = 'v1_cache_monitoreo_inteligente',
  urlsToCache = [
    './',
    './css/style.css',
    './css/all.css',
    './js/client.js',
    './webfonts/fa-brands-400.ttf',
    './webfonts/fa-brands-400.woff2',
    './webfonts/fa-regular-400.ttf',
    './webfonts/fa-regular-400.woff2',
    './webfonts/fa-solid-900.ttf',
    './webfonts/fa-solid-900.woff2',
    './img/icon_1024.png',
    './img/icon_96.png'
  ]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          return res
        }
        return fetch(e.request)
      })
  )
})