import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const TONE_STYLE_INSTRUCTIONS: Record<string, string> = {
  formal: `Use a highly structured, authoritative, and executive-level writing style. Maintain polite professional distance, classic business vocabulary, precise grammar, and avoid informal contractions or slang.`,
  professional: `Use a clear, balanced, and business-standard writing style. Keep the message respectful, efficient, and direct while maintaining a polite, constructive tone.`,
  friendly: `Use a warm, approachable, and collaborative writing style. Keep the message positive, welcoming, and personable while remaining courteous and respectful.`,
  apology: `Use a deeply sincere, humble, and accountable writing style. Acknowledge any mistake, inconvenience, or delay with genuine empathy, take clear responsibility, avoid defensive excuses, and clearly state corrective steps or solutions.`,
  request: `Use a courteous, direct, and persuasive writing style. Frame the ask clearly, explain the reason and benefit behind the request, minimize effort for the recipient, and provide a frictionless call to action.`,
  thank_you: `Use a genuinely grateful, appreciative, and warm writing style. Express sincere thanks, highlight the specific positive impact of the recipient's support or actions, and end on an inspiring note.`,
  persuasive: `Use a compelling, value-oriented, and action-driven writing style. Focus heavily on key benefits, address potential questions gently, and motivate the recipient to take immediate action.`,
  urgent: `Use a concise, priority-focused, and direct writing style. Convey time-sensitivity clearly without sounding aggressive, ensuring the required action stands out immediately.`,
  casual: `Use a relaxed, conversational, and natural writing style. Keep sentences light and engaging, ideal for internal colleagues or familiar peers.`,
  empathetic: `Use an understanding, reassuring, and thoughtful writing style. Show genuine care for the recipient's situation, offer thoughtful support, and communicate with warmth.`,
};

function buildEmailPrompt(params: any): string {
  const {
    senderName,
    senderRole,
    recipientName,
    recipientRole,
    companyName,
    purpose,
    tone = 'professional',
    length = 'medium',
    keyPoints,
    callToAction,
    language = 'English',
  } = params || {};

  const toneInstruction =
    TONE_STYLE_INSTRUCTIONS[tone] || TONE_STYLE_INSTRUCTIONS.professional;

  const recipientInfo = [
    recipientName ? `Name: ${recipientName}` : null,
    recipientRole ? `Role/Title: ${recipientRole}` : null,
    companyName ? `Company/Organization: ${companyName}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const senderSignOff = [
    senderName || '[Your Name]',
    senderRole || null,
  ].filter(Boolean).join('\n');

  return `You are a world-class executive communications consultant and expert email copywriter.
Your task is to compose an exceptional, highly effective email tailored precisely to the user's intent.

### INPUT PARAMETERS:
- Sender Details: Name: ${senderName || 'Not specified'}, Designation/Title: ${senderRole || 'Not specified'}
- Recipient Details: ${recipientInfo || 'Not specified (use standard professional greetings)'}
- Primary Purpose / Goal: ${purpose}
- Selected Writing Style / Tone: ${tone.toUpperCase()}
- Target Word Count / Length: ${length} (short = ~80-120 words, medium = ~150-220 words, detailed = ~250-400 words)
- Key Value Points to Include: ${keyPoints || 'None specified'}
- Call to Action (CTA): ${callToAction || 'None specified'}
- Output Language: ${language}

### WRITING STYLE INSTRUCTIONS FOR "${tone.toUpperCase()}" TONE:
${toneInstruction}

### MANDATORY EMAIL STRUCTURE REQUIREMENTS:
The generated email "body" MUST strictly include all 4 of the following sections in order, separated by clean paragraph line breaks:
1. **GREETING**: A natural, tone-appropriate salutation tailored to the recipient (e.g., "Dear ${recipientName || 'Name'}", "Hi ${recipientName || 'Name'}", etc.).
2. **BODY**:
   - An engaging opening line establishing immediate context and intent.
   - Core message paragraphs elaborating on the primary objective and seamlessly incorporating any key points.
   - A clear call to action or next steps.
3. **CLOSING**: A polite, tone-matched sign-off line (e.g., "Best regards,", "Sincerely,", "Warmly,", "With sincere appreciation,", "Kind regards,").
4. **SIGNATURE**: Standardized professional signature block at the bottom of the email body ending with the sender's name:
${senderSignOff}

### OUTPUT FORMAT:
Return strictly a valid JSON object matching this schema:
{
  "subject": "A compelling, concise, professional, and relevant email subject line",
  "body": "The complete formatted email text containing Greeting, Body paragraphs, Closing, and Signature"
}`;
}

export default async function handler(req: Request, res: Response) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'Vercel-এ GEMINI_API_KEY পাওয়া যায়নি! Vercel Settings -> Environment Variables-এ GEMINI_API_KEY যোগ করুন এবং Redeploy দিন।',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { purpose } = body;

    if (!purpose) {
      return res.status(400).json({ error: 'Email purpose (উদ্দেশ্য) প্রয়োজন।' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildEmailPrompt(body);

    const CANDIDATE_MODELS = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash-lite',
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

    return res.status(200).json({
      subject: parsed.subject || 'Generated Email Draft',
      body: parsed.body || '',
    });
  } catch (err: any) {
    console.error('Error generating email with Gemini on Vercel:', err);
    const isQuotaError =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('quota') ||
      err?.message?.includes('RESOURCE_EXHAUSTED');

    const errorMessage = isQuotaError
      ? 'Gemini API-এর Free Tier Quota (Rate Limit) শেষ হয়ে গেছে। কিছুক্ষণ পর চেষ্টা করুন অথবা Vercel-এ নতুন API Key যোগ করুন।'
      : (err.message || 'An error occurred while generating the email draft.');

    return res.status(isQuotaError ? 429 : 500).json({
      error: errorMessage,
    });
  }
}
