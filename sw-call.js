const CACHE_NAME = 'reception-call-v2';
const CACHE_FILES = ['/reception-call.html'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
    );
    self.skipWaiting();
});

// 自分の古い世代のキャッシュだけを削除する
// （同じサイトに別アプリを置いた場合に、そちらのキャッシュを消さないため）
const MINE = /^reception-call-v\d+$/;

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => MINE.test(k) && k !== CACHE_NAME)
                    .map(k => caches.delete(k))
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
