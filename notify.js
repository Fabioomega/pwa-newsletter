const { Command, Argument } = require('commander');
const { input, password } = require('@inquirer/prompts');

const program = new Command();

async function getLoginCredentials() {
    const username = await input({
        message: 'Username:',
        validate: value => value.trim() ? true : 'Username cannot be empty'
    });

    const pwd = await password({
        message: 'Password:',
        validate: value => value.trim() ? true : 'Password cannot be empty'
    });

    return { username, password: pwd };
}

const login = async (host, username, password) => {
    let f = await fetch(`${host}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            senha: password,
        })
    });

    let json;

    try {
        json = await f.json();
    }
    catch (err) {
        console.error(err);
    }

    if (f.status !== 200) {
        console.error("The login failed with code %d", f.status);
        console.error(`The error message is: ${json.mensagem}`);
        return;
    }

    return { token: json.token };
};

const betterFetch = async (endpoint, token, body) => {
    let f = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Basic ${token}`
        },
        body: JSON.stringify(body)
    });

    let json = await f.json();
    return { status: f.status, json };
};

program
    .name('news')
    .description('CLI to publish news articles')
    .version('0.1.0');

program.command('publish')
    .description('A CLI tool to publish a news article')
    .addArgument(new Argument('<type>', 'type of article to publish').choices(["tecnologia", "saude", "negocios", "natureza", "politica"]))
    .argument('<article>', 'the news to publish')
    .option('-h, --host <host>', 'the server address to publish to', 'http://localhost:8080')
    .action(async (type, article, options) => {
        const { username, password } = await getLoginCredentials();
        let token;

        try {
            const { token: tkn } = await login(options.host, username, password);

            token = tkn;
        } catch (err) {
            console.error(err);
            return;
        }

        try {
            const { status, json } = await betterFetch(`${options.host}/news/publish`, token, {
                content: article,
                type: type
            });

            if (status !== 201) {
                console.error("The publication failed with code %d", status);
                console.error(`The error message is: ${JSON.stringify(json?.error)}`);
                return;
            }

            console.log(`Publication was successful!\nThe article id is: ${json.msgId}`);
        } catch (err) {
            console.error(err);
            return;
        }
    });

program.command('revise')
    .description('Revise a news article')
    .argument('<id>', 'the article id')
    .argument('<article>', 'the revised news content')
    .option('-h, --host <host>', 'the server ip to publish at. Defaults to: localhost:8080', 'http://localhost:8080')
    .action(async (id, article, options) => {
        const { username, password } = await getLoginCredentials();
        let token;

        try {
            const { token: tkn } = await login(options.host, username, password);

            token = tkn;
        } catch (err) {
            console.error(err);
            return;
        }

        try {
            const { status, json } = await betterFetch(`${options.host}/news/update`, token, {
                id: id,
                content: article
            });

            if (status !== 201) {
                console.error("The revision failed with code %d", status);
                console.error(`The error message is: ${JSON.stringify(json?.error)}`);
                return;
            }

            console.log(`Revision was successful!\nThe article id is: ${json.msgId}`);
        } catch (err) {
            console.error(err);
            return;
        }
    });

program.parse();
