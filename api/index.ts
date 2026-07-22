import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { buildEmailPrompt } from '../server/promptBuilder';

const app = express();
app.use(express.json());

const handleGenerateEmail = async (req: express.Request, res: express.Response) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'Vercel-এ GEMINI_API_KEY পাওয়া যায়নি! দয়া করে Vercel Settings -> Environment Variables-এ GEMINI_API_KEY যোগ করুন।',
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
    } = req.body || {};

    if (!purpose) {
      return res.status(400).json({ error: 'Email purpose (উদ্দেশ্য) প্রয়োজন।' });
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
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('All candidate Gemini models failed to respond.');
    }

    const parsed = JSON.parse(response.text);

    return res.json({
      subject: parsed.subject || 'Generated Email Draft',
      body: parsed.body || '',
    });
  } catch (err: any) {
    console.error('Error generating email with Gemini on Vercel:', err);
    const isQuotaError = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED');
    const errorMessage = isQuotaError
      ? 'Gemini API-এর Free Tier Quota (Rate Limit) শেষ হয়ে গেছে। কিছুক্ষণ পর চেষ্টা করুন অথবা Vercel-এ নতুন API Key যোগ করুন।'
      : (err.message || 'An error occurred while generating the email draft.');
    return res.status(isQuotaError ? 429 : 500).json({
      error: errorMessage,
    });
  }
};

// Match all route permutations for Vercel Serverless Function
app.post('/api/generate-email', handleGenerateEmail);
app.post('/generate-email', handleGenerateEmail);
app.post('/', handleGenerateEmail);
app.post('*', handleGenerateEmail);

app.get('*', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;

