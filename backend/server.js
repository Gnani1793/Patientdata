require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

connectDB();

const whatsappService = require('./services/whatsappService');

// Initialize WhatsApp
try {
    whatsappService.initialize();
} catch (error) {
    console.error('Failed to initialize WhatsApp Service:', error);
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/whatsapp', require('./routes/whatsapp'));

// app.get('/', (req, res) => res.send('Sri Satya Eye Care and Opticals API'));

// Serve static files from the React frontend app
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Anything that doesn't match the above routes, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));