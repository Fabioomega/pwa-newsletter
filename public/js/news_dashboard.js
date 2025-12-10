const select = document.getElementById("typeSelect");
const container = document.getElementById("headlineContainer");
const changePreferences = document.getElementById('changePreferences');

let headlines;

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const subscribeUser = async (registration) => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.warn('Notification permission denied.');
        return;
    }

    try {
        const response = await fetch('/notifications/public-key');
        const data = await response.json();
        const applicationServerKey = urlBase64ToUint8Array(data.publicKey);

        const options = {
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        };
        const subscription = await registration.pushManager.subscribe(options);

        await fetch('/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });

        console.log('Subscription sent to server.');
    } catch (error) {
        console.error('Failed to subscribe the user:', error);
    }
}

const formatDate = (date) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const getPreferences = async () => {
    let f = await fetch("/users/preferences");

    let json = await f.json();

    return json.preferences;
}

const getNews = async(preferences) => {
    const response = await fetch(`/news/?types=${preferences.join(';')}`);
    const news = await response.json();
    return news;
}

const loadNews = async(preferences) => {
    headlines = await getNews(preferences);
}

const loadHeadlines = (type) => {
    container.innerHTML = "";
    headlines.forEach(news => {
        if (news.contentType != type) return;

        const div = document.createElement("div");
        div.className = "headline";
        
        div.innerHTML = `
            <div class="headline-title">${news.content}</div>
            <div class="headline-meta">
                <span>👤 ${news.username}</span>
                <span>🕒 ${formatDate(new Date(news.createdAt))}</span>
            </div>
        `;
        
        container.appendChild(div);
    });
}

const loadTypeSelect = async (preferences) => {
    for (let preference of preferences) {
        let opt = document.createElement('option');
        opt.setAttribute('value', preference);
        
        let textNode = document.createTextNode(preference);
        opt.appendChild(textNode);

        select.appendChild(opt);
    }
};


const loadPage = async () => {
    let preferences = await getPreferences();

    await Promise.all([loadTypeSelect(preferences), loadNews(preferences)]);

    if (preferences.length != 0) loadHeadlines(preferences[0]);
}; loadPage();

select.addEventListener("change", () => loadHeadlines(select.value));
changePreferences.addEventListener('click', () => redirect('/page/preferences'));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../js/service_worker.js")
    .then(function (registration) {
        subscribeUser(registration);
    })
    .catch(function (err) {
      console.log("Registro do service worker:", err);
    });
} else {
  console.log("ServiceWorker não é suportado.");
}