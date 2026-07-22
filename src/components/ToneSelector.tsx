import React from 'react';
import { EmailTone } from '../types';

interface ToneOption {
  id: EmailTone;
  label: string;
  icon: string;
  desc: string;
}

interface ToneSelectorProps {
  selectedTone: EmailTone;
  onSelectTone: (tone: EmailTone) => void;
}

const TONES: ToneOption[] = [
  { id: 'formal', label: 'Formal', icon: '🏛️', desc: 'Strict, executive level, authoritative' },
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Clear, respectful, business-standard' },
  { id: 'friendly', label: 'Friendly', icon: '😊', desc: 'Warm, approachable, collaborative' },
  { id: 'apology', label: 'Apology', icon: '🙏', desc: 'Sincere, accountable, empathetic' },
  { id: 'request', label: 'Request', icon: '📩', desc: 'Polite ask, clear objective, friction-free' },
  { id: 'thank_you', label: 'Thank You', icon: '💐', desc: 'Grateful, appreciative, highlighting impact' },
  { id: 'persuasive', label: 'Persuasive', icon: '🚀', desc: 'Compelling, sales-focused, action-driven' },
  { id: 'urgent', label: 'Urgent', icon: '⚡', desc: 'Time-sensitive, priority-driven' },
  { id: 'casual', label: 'Casual', icon: '☕', desc: 'Relaxed, conversational' },
  { id: 'empathetic', label: 'Empathetic', icon: '🤝', desc: 'Understanding, reassuring, thoughtful' },
];

/**
 * ToneSelector Component
 * Allows users to choose an AI writing tone style.
 * Fully keyboard accessible with aria-pressed states and clean hover effects.
 */
export const ToneSelector: React.FC<ToneSelectorProps> = React.memo(({
  selectedTone,
  onSelectTone,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Writing Tone & Style
        </label>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">10 AI Styles</span>
      </div>

      <div
        role="group"
        aria-label="Select AI writing tone"
        className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
      >
        {TONES.map((t) => {
          const isSelected = selectedTone === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectTone(t.id)}
              className={`group p-2.5 rounded-xl text-left border transition-all duration-200 ease-in-out active:scale-95 flex flex-col justify-between cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                isSelected
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 dark:text-indigo-200 font-semibold shadow-xs -translate-y-0.5'
                  : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100/90 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5 hover:shadow-2xs text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                  {t.icon}
                </span>
                <span className="text-xs font-semibold">{t.label}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ToneSelector.displayName = 'ToneSelector';
