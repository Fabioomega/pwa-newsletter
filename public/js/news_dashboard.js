const headlines = {
        tecnologia: [
            { title: "Nova IA promete revolucionar o setor de produtividade", user: "Ana Lima", time: "2025-01-10 14:22" },
            { title: "Fabricantes anunciam baterias com autonomia recorde", user: "Carlos Pinto", time: "2025-01-09 09:10" },
            { title: "Cidades inteligentes começam a se tornar padrão", user: "João Alves", time: "2025-01-08 17:45" }
        ],
        saude: [
            { title: "Estudo aponta melhora no bem-estar com exercícios leves", user: "Rita Sousa", time: "2025-01-07 11:32" },
            { title: "Nova vacina mostra resultados promissores", user: "Marcos Teixeira", time: "2025-01-06 08:54" },
            { title: "Hospitais adotam sistemas digitais avançados", user: "Camila Torres", time: "2025-01-05 19:18" }
        ],
        negocios: [
            { title: "Mercado global apresenta sinais de recuperação", user: "Daniel Oliveira", time: "2025-01-03 13:40" },
            { title: "Empresas apostam em energias renováveis", user: "Beatriz Rocha", time: "2025-01-02 15:05" },
            { title: "Startups brasileiras atraem investimentos recorde", user: "Leonardo Castro", time: "2025-01-01 10:12" }
        ],
        natureza: [
            { title: "Regiões tropicais registram aumento de biodiversidade", user: "Paula Mendes", time: "2025-01-04 12:22" },
            { title: "Projeto global para reflorestamento ganha força", user: "Fernando Reis", time: "2025-01-03 16:48" },
            { title: "Pesquisadores descobrem espécie rara na Amazônia", user: "Sofia Braga", time: "2025-01-01 09:55" }
        ],
        politica: [
            { title: "Novo acordo internacional é firmado", user: "Luiz Campos", time: "2025-01-07 07:30" },
            { title: "Reformas administrativas entram em debate", user: "Marina Duarte", time: "2025-01-06 20:25" },
            { title: "Eleições movimentam o cenário nacional", user: "Eduardo Nunes", time: "2025-01-05 13:10" }
        ]
};

const select = document.getElementById("typeSelect");
const container = document.getElementById("headlineContainer");

const getPreferences = async () => {
    let f = await fetch("/users/preferences");

    let json = await f.json();

    return json.preferences;
}

const loadHeadlines = (type) => {
    container.innerHTML = "";
    headlines[type].forEach(news => {
        const div = document.createElement("div");
        div.className = "headline";
        
        div.innerHTML = `
            <div class="headline-title">${news.title}</div>
            <div class="headline-meta">
                <span>👤 ${news.user}</span>
                <span>🕒 ${news.time}</span>
            </div>
        `;
        
        container.appendChild(div);
    });
}

const loadTypeSelect = async () => {
    let preferences = await getPreferences();
    for (let preference of preferences) {
        let opt = document.createElement('option');
        opt.setAttribute('value', preference);
        
        let textNode = document.createTextNode(preference);
        opt.appendChild(textNode);

        select.appendChild(opt);
    }
}; loadTypeSelect();

select.addEventListener("change", () => loadHeadlines(select.value));

loadHeadlines("tecnologia");
