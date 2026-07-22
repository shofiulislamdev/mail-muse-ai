import React, { useCallback } from 'react';
import { RotateCcw, Sliders, Globe, Command } from 'lucide-react';
import { EmailFormData, EmailTone, EmailLength, UIState } from '../types';
import { ToneSelector } from './ToneSelector';
import { PurposeSelector } from './PurposeSelector';
import { GenerateButton } from './GenerateButton';

interface EmailFormProps {
  formData: EmailFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmailFormData>>;
  onGenerate: () => void;
  onReset: () => void;
  uiState: UIState;
  setUiState: (state: UIState) => void;
  hasError?: boolean;
}

const LENGTHS: { id: EmailLength; label: string; detail: string }[] = [
  { id: 'short', label: 'Short', detail: '~80-120 words' },
  { id: 'medium', label: 'Medium', detail: '~150-220 words' },
  { id: 'detailed', label: 'Detailed', detail: '~250-400 words' },
];

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Portuguese',
  'Italian',
];

/**
 * EmailForm Component
 * Renders the input configuration form for the email generator.
 * Features keyboard shortcuts (Cmd/Ctrl + Enter to submit), accessibility, and responsive layouts.
 */
export const EmailForm: React.FC<EmailFormProps> = React.memo(({
  formData,
  setFormData,
  onGenerate,
  onReset,
  uiState,
  setUiState,
  hasError = false,
}) => {
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleToneSelect = useCallback(
    (tone: EmailTone) => {
      setFormData((prev) => ({ ...prev, tone }));
    },
    [setFormData]
  );

  const handleLengthSelect = useCallback(
    (length: EmailLength) => {
      setFormData((prev) => ({ ...prev, length }));
    },
    [setFormData]
  );

  // Keyboard shortcut listener: Cmd/Ctrl + Enter triggers generation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex flex-col h-full transition-all"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl" aria-hidden="true">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Email Setup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure parameters for your draft
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          title="Reset Form"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {/* Purpose & Recipient Selector */}
        <PurposeSelector formData={formData} onChange={handleChange} hasError={hasError} />

        {/* Writing Tone Selector */}
        <ToneSelector
          selectedTone={formData.tone}
          onSelectTone={handleToneSelect}
        />

        {/* Length & Language Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Email Length
            </label>
            <div
              role="radiogroup"
              aria-label="Email length selection"
              className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              {LENGTHS.map((len) => {
                const isSelected = formData.length === len.id;
                return (
                  <button
                    key={len.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleLengthSelect(len.id)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all text-center cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs border border-slate-200/60 dark:border-slate-600'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {len.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="languageSelect" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Output Language
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" aria-hidden="true" />
              </div>
              <select
                id="languageSelect"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="dark:bg-slate-800 dark:text-slate-100">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button & Shortcut Hint */}
      <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <GenerateButton
          onClick={onGenerate}
          isLoading={uiState === 'loading'}
          label="Generate Email Draft"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-1 py-0.5 rounded text-slate-600">Cmd/Ctrl</kbd> + <kbd className="font-mono bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-1 py-0.5 rounded text-slate-600">Enter</kbd> to generate</span>
          </span>
          <span>Powered by Gemini 2.0 Flash</span>
        </div>

        {/* State Tester Row */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
            <span>Test UI States:</span>
            <span className="text-[10px] text-slate-400">Requirement Controls</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setUiState('success')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500 ${
                uiState === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setUiState('loading')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500 ${
                uiState === 'loading'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Skeleton
            </button>
            <button
              type="button"
              onClick={() => setUiState('empty')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500 ${
                uiState === 'empty'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Empty
            </button>
            <button
              type="button"
              onClick={() => setUiState('error')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500 ${
                uiState === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Error
            </button>
          </div>
        </div>
      </div>
    </form>
  );
});

EmailForm.displayName = 'EmailForm';
