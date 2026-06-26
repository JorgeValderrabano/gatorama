// sw.js - Service Worker Básico
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
    // Necesario para que la app pase la validación de PWA
});