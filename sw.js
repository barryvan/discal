// Basic caching service worker. Will attempt to fetch
// from the network, caching as it goes, and fall back
// to the cache if the network fails.

// Note that the JS for this worker must be in the root
// of the site, as it operates in this scope.

const cacheName = 'v4::static';

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName).then(cache => {
			// Pre-cache static assets
			return cache.addAll([
				'/',
				
				'/css/style.css',
				
				'/js/setup.js',
				'/js/element.js',
				'/js/index.js',
				'/js/parse.js',
				'/js/render.js',
				
				'/lib/ical.js',
				'/lib/fetch.js'
			]).then(() => self.skipWaiting());
		})
	);
});

self.addEventListener('fetch', event => {
	let requestURL = new URL(event.request.url);
	
	event.respondWith(
		caches.open(cacheName).then(cache => {
			return fetch(event.request).then(response => {
				cache.put(event.request, response.clone());
				return response;
			}).catch(() => {
				return cache.match(event.request);
			})
		})
	);
});