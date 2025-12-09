const path = require("path");
const express = require("express");
const auth = require("../middlewares/auth");
const onlyAdmin = require("../middlewares/onlyAdmin");
const News = require('../model/news');

const router = express.Router();


router.post('/update', auth, onlyAdmin, async (req, res, next) => {
    try {
        const { id, content } = req.body;

        const fields = ['id', 'content'];

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

        await News.findByIdAndUpdate(id, { $set: { content: content } });

        return res.status(201).json({
            mensagem: "Noticia editada com sucesso!",
            msgId: news._id
        });
    }
    catch (err) {
        next(err)
    }
});

router.post('/publish', auth, onlyAdmin, async (req, res, next) => {
    try {
        const { content, type } = req.body;

        const fields = ['content', 'type'];

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

        let news = new News({
            content: content,
            contentType: type,
            createdBy: req.user.sub
        });

        try {
            await news.save();
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = {};

                for (let field in err.errors) {
                    validationErrors[field] = err.errors[field].message;
                }

                return res.status(400).json({
                    error: validationErrors,
                });
            }

            return res.status(500).json({
                error: err.message,
            });
        }

        return res.status(201).json({
            mensagem: "Noticia salva com sucesso!",
            msgId: news._id
        });
    }
    catch (err) {
        next(err)
    }
});

module.exports = router;