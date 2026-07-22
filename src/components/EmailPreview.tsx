import React, { useState, useEffect, memo } from 'react';
import { jsPDF } from 'jspdf';
import { 
  RotateCw, 
  BookmarkPlus, 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  Mail, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  FileText,
  Eye,
  Check,
  FileDown
} from 'lucide-react';
import { GeneratedEmail, UIState } from '../types';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { LoadingSpinner } from './LoadingSpinner';

interface EmailPreviewProps {
  uiState: UIState;
  email: GeneratedEmail | null;
  errorMessage?: string | null;
  onRegenerate: () => void;
  onSaveDraft: (email: GeneratedEmail) => void;
  onClearError: () => void;
  onLoadSample: () => void;
  onShowToast?: (msg: string) => void;
}

/**
 * EmailPreview Component
 * Renders the generated email draft with live editing, word counts, copy/download actions,
 * loading skeletons, empty states, and error retry handlers.
 */
export const EmailPreview: React.FC<EmailPreviewProps> = memo(({
  uiState,
  email,
  errorMessage,
  onRegenerate,
  onSaveDraft,
  onClearError,
  onLoadSample,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(email?.subject || '');
  const [editedBody, setEditedBody] = useState(email?.body || '');
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (email) {
      setEditedSubject(email.subject);
      setEditedBody(email.body);
    }
  }, [email]);

  const fullEmailContent = `Subject: ${editedSubject}\n\n${editedBody}`;

  const todayDateStr = new Date().toISOString().slice(0, 10);
  const downloadFileName = `email_draft_${todayDateStr}.txt`;
  const generatedTimeString = email?.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const downloadTextContent = `Subject: ${editedSubject}
Generated Time: ${generatedTimeString}

Email Body:
----------------------------------------
${editedBody}
----------------------------------------
`;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(79, 70, 229); // Indigo 600
      doc.rect(0, 0, 210, 16, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('AI EMAIL GENERATOR - DRAFT', 14, 11);

      // Metadata Section
      doc.setTextColor(71, 85, 105); // Slate 600
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 25);
      if (email?.recipient) {
        doc.text(`To: ${email.recipient}`, 14, 30);
      }

      // Horizontal Divider
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(14, 34, 196, 34);

      // Subject Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42); // Slate 900
      const splitSubject = doc.splitTextToSize(`Subject: ${editedSubject}`, 180);
      doc.text(splitSubject, 14, 42);

      const subjectHeight = splitSubject.length * 6;

      // Email Body
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      const splitBody = doc.splitTextToSize(editedBody, 180);
      doc.text(splitBody, 14, 44 + subjectHeight);

      doc.save(`email_draft_${todayDateStr}.pdf`);
      onShowToast?.('PDF downloaded successfully!');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      onShowToast?.('Failed to generate PDF file.');
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[580px] overflow-hidden transition-colors">
      {/* Email Preview Card Header */}
      <div className="bg-slate-50/80 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg" aria-hidden="true">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              Email Preview Card
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Live rendered output</p>
          </div>
        </div>

        {uiState === 'success' && email && (
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
              isEditing
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-650'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Done Editing' : 'Edit Draft'}</span>
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col" aria-live="polite">
        {/* 1. LOADING SKELETON STATE */}
        {uiState === 'loading' && (
          <div
            role="status"
            aria-label="Generating AI email draft"
            className="flex-1 flex flex-col justify-between space-y-6 transition-all duration-300 ease-in-out"
          >
            <div className="space-y-4">
              {/* Skeleton Status Banner */}
              <div className="flex items-center gap-2.5 p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100/90 text-indigo-700 text-xs font-semibold shadow-2xs animate-pulse">
                <LoadingSpinner size="sm" className="text-indigo-600" />
                <span>AI is synthesizing tone, key value points, and email structure...</span>
              </div>

              {/* Header Skeleton */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-slate-200/80 rounded-md w-1/3 animate-pulse" />
                  <div className="h-3.5 bg-slate-200/80 rounded-md w-1/5 animate-pulse" />
                </div>
                <div className="h-3 bg-slate-200/60 rounded-md w-2/5 animate-pulse" />
                <div className="h-5 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100 rounded-md w-4/5 mt-2 animate-pulse" />
              </div>

              {/* Email Body Skeleton Lines */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/40 space-y-3.5">
                <div className="h-3.5 bg-slate-200/80 rounded-md w-1/4 animate-pulse" />
                <div className="h-3.5 bg-slate-200/70 rounded-md w-full animate-pulse" />
                <div className="h-3.5 bg-slate-200/70 rounded-md w-11/12 animate-pulse" />
                <div className="h-3.5 bg-slate-200/70 rounded-md w-4/5 animate-pulse" />

                <div className="h-3.5 bg-slate-200/70 rounded-md w-full mt-4 animate-pulse" />
                <div className="h-3.5 bg-slate-200/70 rounded-md w-10/12 animate-pulse" />
                <div className="h-3.5 bg-slate-200/70 rounded-md w-3/4 animate-pulse" />

                <div className="h-3.5 bg-slate-200/80 rounded-md w-1/3 mt-6 animate-pulse" />
                <div className="h-3 bg-slate-200/60 rounded-md w-1/4 animate-pulse" />
              </div>
            </div>

            {/* Skeleton Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="h-9 bg-slate-200/70 rounded-xl w-32 animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-9 bg-slate-200/70 rounded-xl w-24 animate-pulse" />
                <div className="h-9 bg-slate-200/70 rounded-xl w-20 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* 2. EMPTY STATE */}
        {uiState === 'empty' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-xs" aria-hidden="true">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              No Email Generated Yet
            </h3>
            <p className="text-sm text-slate-500 max-w-md mt-1.5 mb-6 leading-relaxed">
              Fill in recipient details and purpose on the left form, or click a quick sample template to preview an instant AI draft.
            </p>

            <button
              type="button"
              onClick={onLoadSample}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-2 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>Load Sample Preview Draft</span>
            </button>
          </div>
        )}

        {/* 3. ERROR STATE */}
        {uiState === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-xs" aria-hidden="true">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">
              Unable to Generate Email Draft
            </h3>
            <p className="text-xs text-rose-700/90 dark:text-rose-300/90 max-w-md mt-1.5 mb-5 leading-relaxed font-medium">
              {errorMessage || 'We encountered an error processing your request. Please ensure the email purpose field is filled out or try again.'}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRegenerate}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retry Generation</span>
              </button>
              <button
                type="button"
                onClick={onClearError}
                className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              >
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. SUCCESS STATE (FULL PREVIEW) */}
        {uiState === 'success' && email && (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {/* Metadata Header */}
            <div className="bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-400 dark:text-slate-400">To:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{email.recipient}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] capitalize">
                    {email.tone} Tone
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400">{email.timestamp}</span>
                </div>
              </div>

              {/* Subject Line Field */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex-1 flex items-center gap-2 overflow-hidden">
                  <span className="font-bold text-slate-400 dark:text-slate-400 shrink-0">Subject:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      aria-label="Edit Email Subject"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-600 rounded-md px-2 py-1 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                    />
                  ) : (
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {editedSubject}
                    </span>
                  )}
                </div>

                <CopyButton
                  textToCopy={editedSubject}
                  label="Copy Subject"
                  itemType="Subject"
                  variant="ghost"
                  onCopySuccess={onShowToast}
                />
              </div>
            </div>

            {/* Email Body Card */}
            <div className="flex-1 bg-slate-50/30 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
              {isEditing ? (
                <textarea
                  aria-label="Edit Email Body"
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="w-full h-full min-h-[260px] p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-sans leading-relaxed resize-none"
                />
              ) : (
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed flex-1">
                  {editedBody}
                </div>
              )}

              {/* Reading Stats & Rating Feedback */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" aria-hidden="true" />
                    {editedBody.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    ~{Math.max(1, Math.ceil(editedBody.split(/\s+/).filter(Boolean).length / 200))} min read
                  </span>
                </div>

                {/* Rating Feedback Icons */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 mr-1">Feedback:</span>
                  <button
                    type="button"
                    onClick={() => setFeedback('up')}
                    aria-label="Thumbs up feedback"
                    className={`p-1 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-emerald-500 ${
                      feedback === 'up' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback('down')}
                    aria-label="Thumbs down feedback"
                    className={`p-1 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-rose-500 ${
                      feedback === 'down' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton
                  textToCopy={fullEmailContent}
                  label="Copy Email"
                  itemType="Email"
                  variant="primary"
                  onCopySuccess={onShowToast}
                />

                <DownloadButton
                  content={downloadTextContent}
                  filename={downloadFileName}
                  label="Download .txt"
                  onDownloadSuccess={onShowToast}
                />

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                  title="Download email draft as a PDF document"
                >
                  <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                  title="Generate another variant"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <span>Variant</span>
                </button>

                <button
                  type="button"
                  onClick={() => email && onSaveDraft(email)}
                  className="px-3 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

EmailPreview.displayName = 'EmailPreview';
