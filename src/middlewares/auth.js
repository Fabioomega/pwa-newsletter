const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function auth(req, res, next) {
    const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ mensagem: "Token não informado." });
    }

    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado." });
    }
}

module.exports = auth;