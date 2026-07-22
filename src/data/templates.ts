import { EmailTemplate, GeneratedEmail } from '../types';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'cold-outreach',
    title: 'Cold Sales Outreach',
    category: 'Sales',
    description: 'Pitch your solution to prospective clients with high converting value proposition.',
    data: {
      recipientName: 'Sarah Jenkins',
      recipientRole: 'VP of Product',
      companyName: 'Acme Technologies',
      purpose: 'Introduce our new workflow automation tool that reduces team manual workload by 40%.',
      tone: 'persuasive',
      length: 'short',
      keyPoints: '40% efficiency boost, 14-day free trial, integrated with Slack & Jira',
      callToAction: 'Brief 15-minute intro call next Tuesday',
      language: 'English'
    }
  },
  {
    id: 'follow-up-proposal',
    title: 'Proposal Follow-up',
    category: 'Follow Up',
    description: 'Politely follow up on a pending business proposal without sounding pushy.',
    data: {
      recipientName: 'David Miller',
      recipientRole: 'Director of Marketing',
      companyName: 'Apex Brands',
      purpose: 'Follow up on the Q3 Growth Marketing Strategy proposal sent last Thursday.',
      tone: 'professional',
      length: 'medium',
      keyPoints: 'Addressed budget questions, flexible start date, attached updated scope',
      callToAction: 'Review attached draft and let me know if you have 10 mins this week',
      language: 'English'
    }
  },
  {
    id: 'project-status-update',
    title: 'Executive Project Update',
    category: 'Internal',
    description: 'Provide stakeholders with a clear, structured update on project progress and milestones.',
    data: {
      recipientName: 'Alex Rivera & Leadership Team',
      recipientRole: 'Executive Sponsor',
      companyName: 'Internal Stakeholders',
      purpose: 'Bi-weekly project status update for the Core Platform Migration.',
      tone: 'formal',
      length: 'detailed',
      keyPoints: 'Phase 1 completed 2 days ahead of schedule, security audit passed, user testing starts Monday',
      callToAction: 'No action required, next sync on July 28th',
      language: 'English'
    }
  },
  {
    id: 'delay-apology',
    title: 'Apology for Delay',
    category: 'Customer Service',
    description: 'Maintain trust by taking accountability for a missed deadline or service delay.',
    data: {
      recipientName: 'Michael Chang',
      recipientRole: 'Head of Operations',
      companyName: 'Global Logistics Inc.',
      purpose: 'Apologize for the delay in delivering the quarterly analytics report.',
      tone: 'empathetic',
      length: 'short',
      keyPoints: 'Data validation issue resolved, extra QA checks added, priority delivery within 2 hours',
      callToAction: 'Please let us know if you need any expedited custom breakdowns',
      language: 'English'
    }
  },
  {
    id: 'thank-you-interview',
    title: 'Post-Interview Thank You',
    category: 'Career',
    description: 'Send a memorable thank-you note following a job interview to reinforce fit.',
    data: {
      recipientName: 'Elena Rostova',
      recipientRole: 'Engineering Manager',
      companyName: 'Nexus Cloud',
      purpose: 'Thank Elena for the inspiring conversation regarding the Senior Frontend Lead position.',
      tone: 'friendly',
      length: 'short',
      keyPoints: 'Loved discussing design systems, eager to bring React performance expertise, aligned with team vision',
      callToAction: 'Look forward to hearing about next steps',
      language: 'English'
    }
  }
];

export const SAMPLE_GENERATED_EMAILS: Record<string, GeneratedEmail> = {
  default: {
    id: 'demo-1',
    subject: 'Transforming Acme Technologies Workflows: Quick 15-Min Intro',
    body: `Hi Sarah,

I hope your week is going smoothly!

I noticed Acme Technologies has been scaling rapidly over the past few quarters. With that growth, keeping team workflows streamlined without drowning in operational drag can be a constant balancing act.

Our new workflow automation platform helps product teams reduce repetitive manual tasks by up to 40% while keeping Slack and Jira perfectly synchronized. Teams like yours typically save 6+ hours per engineer every week.

I’d love to share a quick 3-minute video or jump on a brief 15-minute call next Tuesday to see if this aligns with your Q3 priorities. 

Would Tuesday at 10:00 AM or 2:00 PM work for a brief intro?

Best regards,

Alex Carter
Account Executive | Automation Flow
alex.carter@automationflow.io`,
    tone: 'persuasive',
    timestamp: 'Just now',
    recipient: 'Sarah Jenkins (Acme Technologies)',
    purpose: 'Cold Sales Outreach',
    wordCount: 138,
    readingTime: '45 sec read'
  },
  'follow-up-proposal': {
    id: 'demo-2',
    subject: 'Following up: Q3 Growth Marketing Strategy Proposal for Apex Brands',
    body: `Dear David,

I hope you’re having a productive week.

I wanted to touch base regarding the Q3 Growth Marketing Strategy proposal we shared last Thursday. I know leadership schedules can be demanding, so I wanted to make sure you received all the details cleanly.

We’ve reviewed our proposed scope and added flexible start options to align seamlessly with your internal budgeting timeline for next month.

Whenever you have a few moments, please review the attached updated scope. I’d welcome 10 minutes later this week to answer any questions or make adjustments based on your feedback.

Looking forward to hearing your thoughts!

Warm regards,

Alex Carter
Senior Strategist
Apex Partner Group`,
    tone: 'professional',
    timestamp: '2 mins ago',
    recipient: 'David Miller (Apex Brands)',
    purpose: 'Proposal Follow-up',
    wordCount: 124,
    readingTime: '40 sec read'
  }
};
