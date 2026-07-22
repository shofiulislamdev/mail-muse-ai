import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

/**
 * Footer Component
 * Renders application credits and technical stack badges.
 */
export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md" aria-hidden="true">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">MailGenie AI</span>
          <span>— Intelligent AI Email Writer SaaS</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-slate-400 dark:text-slate-500">
          <span>Responsive SaaS UI</span>
          <span aria-hidden="true">•</span>
          <span>Tailwind CSS</span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" aria-label="love" />
          </span>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
