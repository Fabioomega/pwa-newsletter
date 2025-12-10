const usernameModal = document.getElementById('username');
const passwordModal = document.getElementById('password');
const isAdminModal = document.getElementById('isAdmin');
const outputModal = document.getElementById('output');
const sendBtn = document.getElementById('sendBtn');

const buttonHandler = async () => {
    let body = JSON.stringify({
            username: usernameModal.value,
            senha: passwordModal.value,
            isAdmin: isAdminModal?.checked === true,
        });

    let f = await fetch("/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });

    let json = await f.json();
    outputModal.textContent = JSON.stringify(json);
};

sendBtn.addEventListener('click', buttonHandler);