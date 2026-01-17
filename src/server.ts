import express from 'express';
import { sendEmail } from './emailSender.js';
import { z } from 'zod';

const app = express();

// Middleware para fazer parsing do JSON body
app.use(express.json());

app.post('/send-email', async (req, res) => {
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


