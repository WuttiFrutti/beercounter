console.log("Service worker running");


window.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('chefbeer').then(function(cache) {
        return cache.addAll([
          '/',
          '/bundle.js',
        ]);
      })
    );
   });