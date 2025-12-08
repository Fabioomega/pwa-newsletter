function onlyAdmin(req, res, next) {
    if (!req.user.is_admin) {
        return res.status(403).json({ message: "Acesso permitido somente para administradores" });
    }
    next();
}

module.exports = onlyAdmin;