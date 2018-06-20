let cacheName = 'V1';
const staticCacheName = [
    '/',
    './restaurant.html',
    './css/styles.css',
    './css/medium.css',
    './css/large.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/main.js',
    './js/restaurant_info.js',
    './js/dbhelper.js',
    'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
];
self.addEventListener('install', (event) => {
    // Wait to add all CacheFiles before install ServiceWorker
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(staticCacheName);
        }).catch(() => {
            return new Response('Error installing Cache!');
        })
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Get all the cache keys (cacheName)
        caches.keys().then((cacheNames) => {
            return cacheNames.map((cache) => {
                if (cache !== cacheName) {
                    console.log('Cache Files removed from SW' + cache);
                    return caches.delete(cache);
                }
            })
        }).catch(() => {
            return new Response('Error in Service Worker')
        })
    );
});


self.addEventListener('fetch', function(e) {
    // e.respondWidth Responds to the fetch event
    e.respondWith(
        // Check in cache for the request being made
        caches.match(e.request)
        .then(function(response) {

            // If the request is in the cache
            if (response) {
                console.log("ServiceWorker Found in Cache", e.request.url);
                // Return the cached version
                return response || fetch(event.request);
            }

            // If the request is NOT in the cache, fetch and cache
            if (e.request.url.indexOf('restaurant.html') > -1) {
                console.log(e.request.url.indexOf('restaurant.html'))
                return fetch(e.request);
            }
            let requestClone = e.request.clone();
            return fetch(requestClone)
                .then(function(response) {

                    if (!response) {
                        console.log("No response from fetch ")
                        return response;
                    }

                    var responseClone = response.clone();

                    //  Open the cache
                    caches.open(cacheName).then(function(cache) {

                        // Put the fetched response in the cache
                        cache.put(e.request, responseClone);
                        console.log('New Data Cached', e.request.url);
                        // Return the response
                        return response;
                    });

                })
                .catch(() => {
                    return new Response('This Page was not cached', {
                        headers: {
                            'Content-Type': 'text/html'
                        }
                    })
                });

        })
    );
});