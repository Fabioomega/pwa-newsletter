const path = require("path");
const express = require("express");
const User = require("../model/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get('/preferences', auth, async (req, resp) => {
    let usersPreferences = {};
    try {
        usersPreferences = await User.findById(req.user.sub, 'preferences');
    } catch (err) {
        return resp.status(500).json({
            error: err.message,
        });
    }

    return resp.json({
        preferences: usersPreferences.preferences
    });
});

router.post('/preferences', auth, async (req, res, next) => {
    try {
        const { preferences } = req.body;

        console.log(req.body);

        const fields = ['preferences'];

        const requiredFields = [];

        for (let field of fields) {
            if (!req.body[field]) {
                requiredFields.push(field);
            }

        }
        if (requiredFields.length > 0 ) {
            res.status(400).json({ error: 'Existem campos obrigatórios não preenchidos.', camposObrigatorios: requiredFields });
            return;
        }

        await User.findByIdAndUpdate(req.user.sub, { $set: { preferences: preferences } }, { runValidators: true });

        return res.status(201).json({
            "mensagem": "Preferencias modificadas com successo!"
        });
    }
    catch (err) {
        next(err)
    }
});

module.exports = router;