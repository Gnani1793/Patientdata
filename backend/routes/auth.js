const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Simple credential-based login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Gnani';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gnani1793';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const payload = { user: { username } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'ChangeThisSecret', { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(401).json({ msg: 'Invalid credentials' });
});

module.exports = router;