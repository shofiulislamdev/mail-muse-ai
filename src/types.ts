export type EmailTone = 
  | 'formal'
  | 'professional'
  | 'friendly'
  | 'apology'
  | 'request'
  | 'thank_you'
  | 'persuasive'
  | 'urgent'
  | 'casual'
  | 'empathetic';

export type EmailLength = 'short' | 'medium' | 'detailed';

export type UIState = 'empty' | 'loading' | 'success' | 'error';

export interface EmailFormData {
  senderName?: string;
  senderRole?: string;
  recipientName: string;
  recipientRole: string;
  companyName: string;
  purpose: string;
  tone: EmailTone;
  length: EmailLength;
  keyPoints: string;
  callToAction: string;
  language: string;
}

export interface GeneratedEmail {
  id: string;
  subject: string;
  body: string;
  tone: EmailTone;
  timestamp: string;
  recipient: string;
  purpose: string;
  wordCount: number;
  readingTime: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  data: Partial<EmailFormData>;
}
