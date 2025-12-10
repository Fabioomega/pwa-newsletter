const express = require('express');
const jwt = require("jsonwebtoken")
const User = require("../model/user");
const { jwtSecret } = require("../config/env")
const auth = require('../middlewares/auth');
const onlyAdmin = require('../middlewares/onlyAdmin');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { username, senha, isAdmin } = req.body;

        const campos = ['username', 'senha', 'isAdmin'];

        const camposObrigatorios = [];

        for (let campo of campos) {
            if (req.body[campo] === undefined) {
                camposObrigatorios.push(campo);
            }

        }
        if (camposObrigatorios.length > 0) {
            res.status(400).json({ error: 'Existem campos obrigatórios não preenchidos.', camposObrigatorios });
            return;
        }

        const existe = await User.findOne({ username });

        if (existe) {
            return res.status(400).json({
                "mensagem": "Usuário já cadastrado."
            });
        }

        const user = new User({
            username,
            passwordHash: senha,
            isAdmin: isAdmin
        });

        await user.save();

        return res.status(201).json({
            "mensagem": "Usuário cadastrado com sucesso!"
        });
    }

    catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, senha } = req.body;

        const campos = ['username', 'senha'];

        const camposObrigatorios = [];

        for (let campo of campos) {
            if (!req.body[campo]) {
                camposObrigatorios.push(campo);
            }

        }
        if (camposObrigatorios.length > 0) {
            res.status(400).json({ error: 'Existem campos obrigatórios não preenchidos.', camposObrigatorios });
            return;
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                "mensagem": "Usuário não cadastrado."
            });
        }

        const ok = await user.validarSenha(senha);

        if (!ok) {
            return res.status(401).json({
                "mensagem": "Credênciais inválidas."
            });
        }

        const token = jwt.sign(
            {
                sub: user._id, username: user.username, isAdmin: user.isAdmin
            },
            jwtSecret,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        return res.json({
            user: { isAdmin: user.isAdmin }, token: token
        });

    }

    catch (err) {
        next(err)
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie("token", { path: "/" });
    return res.json({ "mensagem": "Logout realizado." });
});

router.get('/is-logged', auth, (req, res) => {
    return res.send('You are an user! Yay!')
});

router.get('/is-admin', auth, onlyAdmin, (req, res) => {
    return res.send('You are an admin! Yay!')
});

module.exports = router;