import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EmailForm } from './components/EmailForm';
import { EmailPreview } from './components/EmailPreview';
import { DraftHistoryDrawer } from './components/DraftHistoryDrawer';
import { Footer } from './components/Footer';
import { EmailFormData, GeneratedEmail, UIState } from './types';
import { SAMPLE_GENERATED_EMAILS } from './data/templates';
import { CheckCircle2 } from 'lucide-react';

const INITIAL_FORM: EmailFormData = {
  senderName: '',
  senderRole: '',
  recipientName: '',
  recipientRole: '',
  companyName: '',
  purpose: 'Introduce our AI-powered workflow automation software that saves engineering teams 6+ hours weekly.',
  tone: 'persuasive',
  length: 'short',
  keyPoints: '40% efficiency boost, 14-day free trial, native Slack & Jira integration',
  callToAction: 'Brief 15-minute intro call next Tuesday',
  language: 'English',
};

/**
 * App Root Component
 * Coordinates state management for the MailGenie AI Email Writer SaaS application.
 */
export default function App() {
  const [formData, setFormData] = useState<EmailFormData>(INITIAL_FORM);
  const [uiState, setUiState] = useState<UIState>('success');
  const [currentEmail, setCurrentEmail] = useState<GeneratedEmail | null>(SAMPLE_GENERATED_EMAILS.default);
  const [savedDrafts, setSavedDrafts] = useState<GeneratedEmail[]>([
    SAMPLE_GENERATED_EMAILS['follow-up-proposal'],
  ]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasFormError, setHasFormError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dark Mode / Night Mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mailgenie_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mailgenie_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mailgenie_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Night Mode activated 🌙' : 'Light Mode activated ☀️');
      return next;
    });
  }, []);

  // Helper toast notifier
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Autofill form with selected template data
  const handleSelectTemplate = useCallback((templateData: Partial<EmailFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...templateData,
    }));
    setHasFormError(false);
    showToast('Template details loaded into form!');
  }, [showToast]);

  // Submit form data to backend server & Gemini API
  const handleGenerate = useCallback(async () => {
    if (!formData.purpose.trim()) {
      setHasFormError(true);
      showToast('Email Purpose is required to generate a draft.');
      return;
    }

    setHasFormError(false);
    setApiError(null);
    setUiState('loading');

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        const cleanMessage = responseText.replace(/<[^>]*>/g, '').trim().slice(0, 180);
        throw new Error(
          response.ok
            ? 'Server returned invalid JSON response.'
            : `Server Error (${response.status}): ${cleanMessage || response.statusText}`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || `Error (${response.status}): Failed to generate email draft.`);
      }

      const recipientStr = formData.recipientName
        ? `${formData.recipientName} (${formData.companyName || 'Recipient'})`
        : formData.companyName || 'Recipient';

      const wordCount = data.body.split(/\s+/).filter(Boolean).length;

      const generated: GeneratedEmail = {
        id: `email-${Date.now()}`,
        subject: data.subject,
        body: data.body,
        tone: formData.tone,
        timestamp: 'Just now',
        recipient: recipientStr,
        purpose: formData.purpose,
        wordCount: wordCount,
        readingTime: `~${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      };

      setCurrentEmail(generated);
      setUiState('success');
      showToast('AI Email Draft generated via Gemini API!');
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      const errMsg = err?.message || 'Error generating email draft.';
      setApiError(errMsg);
      setUiState('error');
      showToast(errMsg);
    }
  }, [formData, showToast]);

  // Reset form inputs
  const handleReset = useCallback(() => {
    setFormData({
      recipientName: '',
      recipientRole: '',
      companyName: '',
      purpose: '',
      tone: 'professional',
      length: 'medium',
      keyPoints: '',
      callToAction: '',
      language: 'English',
    });
    setHasFormError(false);
    setApiError(null);
    setUiState('empty');
    setCurrentEmail(null);
    showToast('Form reset.');
  }, [showToast]);

  // Save generated email draft to drawer history
  const handleSaveDraft = useCallback((emailToSave: GeneratedEmail) => {
    setSavedDrafts((prev) => {
      if (!prev.some((d) => d.id === emailToSave.id)) {
        showToast('Draft saved to history!');
        return [emailToSave, ...prev];
      } else {
        showToast('Draft is already in your saved history.');
        return prev;
      }
    });
  }, [showToast]);

  // Delete saved draft item
  const handleDeleteDraft = useCallback((id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
    showToast('Draft deleted.');
  }, [showToast]);

  // Clear all saved drafts
  const handleClearAllDrafts = useCallback(() => {
    setSavedDrafts([]);
    showToast('All saved drafts cleared.');
  }, [showToast]);

  // Load sample template preview
  const handleLoadSamplePreview = useCallback(() => {
    setFormData(INITIAL_FORM);
    setCurrentEmail(SAMPLE_GENERATED_EMAILS.default);
    setHasFormError(false);
    setUiState('success');
    showToast('Sample email draft loaded.');
  }, [showToast]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Toast Notification Live Region */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700/50"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar Header */}
      <Navbar
        uiState={uiState}
        setUiState={setUiState}
        savedCount={savedDrafts.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Hero Header Section */}
      <Hero onSelectTemplate={handleSelectTemplate} />

      {/* Main SaaS Workspace Container */}
      <main id="generator" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side Setup Form */}
          <div className="lg:col-span-5 h-full">
            <EmailForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerate}
              onReset={handleReset}
              uiState={uiState}
              setUiState={setUiState}
              hasError={hasFormError}
            />
          </div>

          {/* Right Side Generated Email Preview Card */}
          <div className="lg:col-span-7 h-full">
            <EmailPreview
              uiState={uiState}
              email={currentEmail}
              errorMessage={apiError}
              onRegenerate={handleGenerate}
              onSaveDraft={handleSaveDraft}
              onClearError={() => {
                setApiError(null);
                setUiState(currentEmail ? 'success' : 'empty');
              }}
              onLoadSample={handleLoadSamplePreview}
              onShowToast={showToast}
            />
          </div>
        </div>
      </main>

      {/* Saved Drafts Drawer */}
      <DraftHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        drafts={savedDrafts}
        onSelectDraft={(draft) => {
          setCurrentEmail(draft);
          setUiState('success');
          showToast('Loaded saved draft into preview!');
        }}
        onDeleteDraft={handleDeleteDraft}
        onClearAll={handleClearAllDrafts}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
