const path = require("path");
const express = require("express");

const router = express.Router();

router.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'login.html'));
});

module.exports = router;