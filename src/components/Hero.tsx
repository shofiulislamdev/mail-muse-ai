import React from 'react';
import { Sparkles, Zap, Shield, Bot, CheckCircle } from 'lucide-react';
import { EMAIL_TEMPLATES } from '../data/templates';
import { EmailFormData } from '../types';

interface HeroProps {
  onSelectTemplate: (data: Partial<EmailFormData>) => void;
}

/**
 * Hero Component
 * Displays the SaaS platform headline, key value props, and quick-start template autofill prompts.
 */
export const Hero: React.FC<HeroProps> = React.memo(({ onSelectTemplate }) => {
  return (
    <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-indigo-200/40 via-violet-200/40 to-pink-200/30 blur-3xl -z-10 rounded-full opacity-70 pointer-events-none"
        aria-hidden="true"
      />

      <div className="text-center max-w-3xl mx-auto mb-8">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" aria-hidden="true" />
          <span>AI-Powered Email Composition SaaS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
          <span className="text-indigo-600/80 dark:text-indigo-300/80 font-medium">Ultra Fast Drafts</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Write High-Converting Emails in{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Seconds
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Craft tailored sales pitches, executive updates, follow-ups, and customer responses. 
          Pick your tone, specify key details, and generate flawless email copy instantly.
        </p>

        {/* Feature Highlights Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
            <span>10 Smart Tone Customizers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" aria-hidden="true" />
            <span>Instant One-Click Copy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
            <span>Executive Formatting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-violet-500 dark:text-violet-400" aria-hidden="true" />
            <span>Editable Live Preview</span>
          </div>
        </div>
      </div>

      {/* Quick Prompt Templates Strip */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-4xl mx-auto transition-colors">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
            Quick Start Templates (Click to Autofill):
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Select any pre-made prompt</span>
        </div>

        <div role="list" className="flex flex-wrap items-center gap-2">
          {EMAIL_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onSelectTemplate(tmpl.data)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 group cursor-pointer shadow-2xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors" aria-hidden="true" />
              <span>{tmpl.title}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 font-normal">
                ({tmpl.category})
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
