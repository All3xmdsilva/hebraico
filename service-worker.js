const CACHE_NAME = 'hebraico-quest-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/base.css',
  './css/theme.css',
  './css/layout.css',
  './css/components.css',
  './css/dashboard.css',
  './css/profile.css',
  './css/course.css',
  './css/quiz.css',
  './css/animations.css',
  './css/responsive.css',
  './js/storage.js',
  './js/dataLoader.js',
  './js/router.js',
  './js/dashboard.js',
  './js/course.js',
  './js/quiz.js',
  './js/perfis.js',
  './js/conquistas.js',
  './js/dicionario.js',
  './js/biblia.js',
  './js/flashcards.js',
  './js/memoria.js',
  './js/cacaPalavras.js',
  './js/forca.js',
  './js/arrastarLetras.js',
  './js/app.js',
  // Adicione os arquivos JSON conforme necessário:
  './data/mundos.json',
  './data/conquistas.json',
  './data/missoes.json',
  './data/dicionario.json',
  './data/biblia.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});