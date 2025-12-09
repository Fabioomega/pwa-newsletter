const path = require("path");
const express = require("express");
const User = require("../model/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'new_user.html'));
});

router.post('/preferences', auth, async (req, res, next) => {
    try {
        const { preferences } = req.body;

        const fields = ['preferences'];

        const requiredFields = [];

        for (let field of fields) {
            if (!req.body[field]) {
                requiredFields.push(field);
            }

        }
        if (requiredFields.length > 0) {
            res.status(400).json({ error: 'Existem campos obrigatórios não preenchidos.', camposObrigatorios: requiredFields });
            return;
        }

        await User.findByIdAndUpdate(req.user.sub, { $set: { preferences: preferences } }, { runValidators: true });

        return res.json({
            "mensagem": "Preferencias modificadas com successo!"
        });
    }
    catch (err) {
        next(err)
    }
});

module.exports = router;