const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client;
let qrCodeUrl = null;
let isReady = false;

const initialize = () => {
    console.log('Initializing WhatsApp Client...');

    // Create a new client instance
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        }
    });

    client.on('qr', async (qr) => {
        console.log('QR Received');
        try {
            qrCodeUrl = await qrcode.toDataURL(qr);
            isReady = false;
        } catch (err) {
            console.error('Error generating QR code', err);
        }
    });

    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        isReady = true;
        qrCodeUrl = null;
    });

    client.on('authenticated', () => {
        console.log('WhatsApp Authenticated');
    });

    client.on('auth_failure', msg => {
        console.error('WhatsApp Auth Failure', msg);
    });

    client.on('disconnected', async (reason) => {
        console.log('WhatsApp was disconnected:', reason);
        isReady = false;
        qrCodeUrl = null;

        // Destroy the client and re-initialize
        try {
            await client.destroy();
        } catch (error) {
            console.error('Error destroying client:', error);
        }

        // Re-initialize after a short delay
        setTimeout(() => {
            initialize();
        }, 3000);
    });

    client.initialize();
};

const getStatus = () => {
    return { isReady, qrCodeUrl };
};

const sendMessage = async (phone, message) => {
    if (!isReady) throw new Error('WhatsApp client is not ready');

    if (!phone) throw new Error('Phone number is missing or invalid');

    // Formatting phone number
    // whatsapp-web.js expects '919876543210@c.us' for private chats
    let chatId = phone.replace(/\D/g, '');
    if (chatId.length === 10) {
        chatId = '91' + chatId; // Assume India if only 10 digits
    }
    chatId = chatId + '@c.us';

    const response = await client.sendMessage(chatId, message);
    return response;
};

module.exports = {
    initialize,
    getStatus,
    sendMessage
};
