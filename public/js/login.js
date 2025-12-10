const usernameModal = document.getElementById('username');
const passwordModal = document.getElementById('password');
const outputModal = document.getElementById('output');
const sendBtn = document.getElementById('sendBtn');

const buttonHandler = async () => {
    let f = await fetch("/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameModal.value,
            senha: passwordModal.value,
        })
    });

    let json = await f.json();
    outputModal.textContent = JSON.stringify(json);

    if (f.status == 200) redirect('/page/dashboard');
};

sendBtn.addEventListener('click', buttonHandler);