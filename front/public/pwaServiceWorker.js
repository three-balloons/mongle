const createLogger = (context) => ({
    log(...msg) {
        console.log(`[${context}]`, ...msg);
    },
    debug(...msg) {
        console.debug(`[${context}]`, ...msg);
    },
    error(...msg) {
        console.error(`[${context}]`, ...msg);
    },
});

const logger = createLogger(`sw`);

/* life cycle */
self.addEventListener('install', () => {
    logger.debug('Sw is install!');
});

self.addEventListener('activate', () => {
    logger.debug('Sw is activate!');
});

self.addEventListener('fetch', () => {
    logger.debug('Sw is fetch');
});

/*** for offline fallback ***/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';

const urlsToCache = ['/', '/index.html', '/offline.html'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }),
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 네트워크 응답이 성공적으로 왔을 경우, 캐시에 저장하고 응답을 반환합니다
                const clone = response.clone();
                caches.open('mongle-cache').then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                    return new Response('Network error occurred', { status: 408 });
                });
            }),
    );
});
