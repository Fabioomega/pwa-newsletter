const path = require("path");
const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'new_user.html'));
});

router.get('/preferences', auth, (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'preferences.html'));
});

router.get('/dashboard', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'news_dashboard.html'));
});

router.get('/login', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'login.html'));
});

module.exports = router;