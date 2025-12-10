var versao = 1;

self.addEventListener("install", async function (event) {});

self.addEventListener("activate", function (event) {});

self.addEventListener("fetch", (event) => {});

self.addEventListener('push', function (event) {
    const data = event.data.json();

    console.log('Push recebido');

    const title = data.title || 'AppNews UFSC';
    const options = {
        body: data.body || 'You have a new notification!',
        icon: '/img/icon-192.png',
        badge: '/img/icon-192.png',
        tag: 'swc'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
