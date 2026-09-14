const CACHE_NAME = 'reception-factory-v2';
const CACHE_FILES = ['/reception-factory.html'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
    );
    self.skipWaiting();
});

// 自分の古い世代のキャッシュだけを削除する
// （同じサイトに別アプリ reception.html を置いた場合にそちらのキャッシュを消さないため）
const MINE = /^reception-factory-v\d+$/;

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => MINE.test(k) && k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
