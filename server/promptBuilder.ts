import { EmailFormData } from '../src/types';

/**
 * Detailed writing style instructions mapped by tone.
 */
export const TONE_STYLE_INSTRUCTIONS: Record<string, string> = {
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

/**
 * Reusable system prompt builder for AI email generation.
 */
export function buildEmailPrompt(params: EmailFormData): string {
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
  } = params;

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
