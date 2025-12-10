const express = require('express');
const router = express.Router();
const User = require('../model/user');
const auth = require('../middlewares/auth');
const { publicKey } = require('../config/env');

router.post('/subscribe', auth, async (req, res) => {
    try {
        const subscription = req.body;
        const userId = req.user.sub;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.subscription = subscription;
        await user.save();

        res.status(201).json({ message: 'Subscription saved successfully.' });
    } catch (error) {
        
        res.status(500).json({ message: 'Error saving subscription.', error: error.message });
    }
});

router.get('/public-key', (req, res) => {
    res.status(200).json({ publicKey });
});

module.exports = router;