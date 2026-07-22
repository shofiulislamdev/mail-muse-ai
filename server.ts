import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { buildEmailPrompt } from './server/promptBuilder';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint to generate AI emails
  app.post('/api/generate-email', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY environment variable is missing. Please configure your API key in settings.',
        });
      }

      const {
        senderName,
        senderRole,
        recipientName,
        recipientRole,
        companyName,
        purpose,
        tone,
        length,
        keyPoints,
        callToAction,
        language,
      } = req.body;

      if (!purpose) {
        return res.status(400).json({ error: 'Email purpose is required.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = buildEmailPrompt({
        senderName,
        senderRole,
        recipientName,
        recipientRole,
        companyName,
        purpose,
        tone,
        length,
        keyPoints,
        callToAction,
        language,
      });

      const CANDIDATE_MODELS = [
        'gemini-2.5-flash-lite',
        'gemini-flash-latest',
        'gemini-1.5-flash',
        'gemini-2.0-flash-lite',
        'gemini-2.5-flash',
      ];

      let response;
      let lastError: any;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  subject: {
                    type: Type.STRING,
                    description: 'The crafted subject line for the email',
                  },
                  body: {
                    type: Type.STRING,
                    description: 'The complete generated email body with greetings and sign-off',
                  },
                },
                required: ['subject', 'body'],
              },
            },
          });
          if (response && response.text) {
            console.log(`Successfully generated content using model: ${modelName}`);
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} failed:`, err?.message || err);
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error('All candidate Gemini models failed to respond.');
      }

      const responseText = response.text;
      if (!responseText) {
        throw new Error('No content returned from Gemini API.');
      }

      const parsed = JSON.parse(responseText);

      return res.json({
        subject: parsed.subject || 'Generated Email Draft',
        body: parsed.body || '',
      });
    } catch (err: any) {
      console.error('Error generating email with Gemini:', err);
      const isQuotaError = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED');
      const errorMessage = isQuotaError
        ? 'Gemini API-এর Free Tier Quota (Rate Limit) পার হয়ে গেছে। কিছুদিন অপেক্ষা করুন বা Google AI Studio-তে নতুন একটি API Key তৈরি করে .env ফাইলেই বসান।'
        : (err.message || 'An error occurred while generating the email draft.');
      return res.status(isQuotaError ? 429 : 500).json({
        error: errorMessage,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite Middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
