import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';

export default function WhatsAppConnect() {
    const [status, setStatus] = useState({ isReady: false, qrCodeUrl: null });
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        try {
            const res = await api.get('/api/whatsapp/status');
            setStatus(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching WA status', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c.93.509 1.842.836 2.805.836h.001c3.182 0 5.768-2.586 5.768-5.766.001-1.541-.599-2.986-1.688-4.075C15.017 7.03 13.57 6.173 12.031 6.172zm0 10.291c-.85-.001-1.666-.252-2.395-.694l-.168-.103-1.789.475.48-1.728-.112-.178c-.496-.788-.758-1.693-.757-2.617 0-2.691 2.193-4.881 4.885-4.881 1.303 0 2.53.508 3.451 1.432.922.923 1.43 2.15 1.429 3.454.001 2.69-2.19 4.881-4.883 4.881h-.141z" />
                    <path d="M12.031 0C5.396 0 0 5.396 0 12.031c0 2.121.55 4.166 1.587 5.968L0 24.062l6.233-1.636c1.743.951 3.735 1.452 5.795 1.453h.003c6.635 0 12.031-5.396 12.031-12.031C24.061 5.485 18.577 0 12.031 0zM12.031 22.08c-1.85-.001-3.666-.499-5.263-1.448l-.377-.225-3.903 1.026 1.042-3.805-.246-.391c-1.046-1.666-1.597-3.597-1.595-5.567.004-5.759 4.69-10.443 10.453-10.443 2.788 0 5.412 1.085 7.391 3.064 1.977 1.977 3.064 4.606 3.063 7.395-.002 5.761-4.691 10.448-10.453 10.448z" />
                </svg>
                WhatsApp Automation
            </h3>

            {status.isReady ? (
                <div className="flex items-center text-green-600 font-medium">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    System Connected & Ready to Send
                </div>
            ) : status.qrCodeUrl ? (
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-4">Scan this QR code with your WhatsApp to enable automatic messaging:</p>
                    <img src={status.qrCodeUrl} alt="WhatsApp QR Code" className="w-64 h-64 border-4 border-gray-200 rounded-xl" />
                    <p className="text-xs text-gray-400 mt-2">Open WhatsApp on phone {'>'} Menu {'>'} Linked Devices {'>'} Link a Device</p>
                </div>
            ) : (
                <div className="flex items-center text-gray-500">
                    <span className="animate-pulse mr-2">●</span>
                    Initializing Client...
                </div>
            )}
        </div>
    );
}
