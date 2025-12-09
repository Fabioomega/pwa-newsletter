// <div>
//     <label for=""></label>
//     <input />
// </div>

const preferences = ["tecnologia", "saude", "negocios", "natureza", "politica"]
const app = document.getElementById("app");
const saveBtn = document.getElementById('save');

let selectedPreferences = new Set();

const buildPage = () => {
    for (let preference of preferences) {
        let div = document.createElement('div');
        div.innerHTML = `
            <label for="${preference}">${preference}</label>
            <input class="preference-modal" type="checkbox" id="${preference}" />
        `;
        app.appendChild(div);
    }

    for (let inp of document.getElementsByClassName('preference-modal')) {
        inp.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedPreferences.add(e.target.id);
                return;
            }

            selectedPreferences.delete(e.target.id);
        });
    }
}; buildPage();

const savePreferences = async () => {
    let f = await fetch("/users/preferences", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            preferences: [...selectedPreferences]
        })
    });

    if (f.status == 201) {
        console.log("Success!");
        return;
    }

    console.log('Preferences failed to change!');
}

saveBtn.addEventListener('click', savePreferences);