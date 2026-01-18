import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendEmail } from './emailSender.js';
import { z } from 'zod';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const sendEmailLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX) || 10,
    message: { success: false, error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.post('/send-email', sendEmailLimiter, async (req, res) => {
    const schema = z.object({
        to: z.string(),
        subject: z.string().min(1),
        text: z.string().min(1),
    });
    const validatedData = schema.parse(req.body);
    const result = await sendEmail(validatedData.to, validatedData.subject, validatedData.text);
    if (result && result.success) {
        res.status(200).send({ success: true });
    } else {
        res.status(500).send({ success: false, error: 'Failed to send email' });
    }
});



const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});


