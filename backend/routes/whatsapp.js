const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const auth = require('../middleware/auth');

// Get Status (for QR code)
router.get('/status', auth, (req, res) => {
    try {
        const status = whatsappService.getStatus();
        res.json(status);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Send Message
router.post('/send', auth, async (req, res) => {
    try {
        const { phone, message } = req.body;
        if (!phone || !message) {
            return res.status(400).json({ msg: 'Phone and message are required' });
        }
        await whatsappService.sendMessage(phone, message);
        res.json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message || 'Failed to send message' });
    }
});

module.exports = router;
