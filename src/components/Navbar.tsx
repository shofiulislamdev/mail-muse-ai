import React from 'react';
import { Sparkles, Mail, Layers, History, CheckCircle2, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import { UIState } from '../types';

interface NavbarProps {
  uiState: UIState;
  setUiState: (state: UIState) => void;
  savedCount: number;
  onOpenHistory: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * Navbar Component
 * Renders the top SaaS header with brand logo, quick state toggles, night mode switch, saved drafts drawer trigger, and compose button.
 */
export const Navbar: React.FC<NavbarProps> = React.memo(({
  uiState,
  setUiState,
  savedCount,
  onOpenHistory,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500 dark:text-green-500 text-lg tracking-tight">MailMuse<span className="text-red-500">-AI</span></span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 rounded-full">
                Md. Shofiul Islam
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Intelligent AI Email Writer</p>
          </div>
        </div>

        {/* State Selector Bar for testing requirement states */}
        <nav aria-label="UI State Controls" className="hidden md:flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
            <span>UI States:</span>
          </div>
          <button
            type="button"
            onClick={() => setUiState('success')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
              uiState === 'success'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setUiState('loading')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
              uiState === 'loading'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            <span>Loading</span>
          </button>
          <button
            type="button"
            onClick={() => setUiState('empty')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
              uiState === 'empty'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Empty</span>
          </button>
          <button
            type="button"
            onClick={() => setUiState('error')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
              uiState === 'error'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>Error</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Night Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
            className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            title={isDarkMode ? 'Light Mode' : 'Night Mode'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span className="text-xs font-semibold hidden sm:inline">Day</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <span className="text-xs font-semibold hidden sm:inline">Night</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            aria-label={`Saved Drafts (${savedCount} copies)`}
            className="relative px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center gap-2 shadow-2xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span className="hidden sm:inline">Saved Drafts</span>
            {savedCount > 0 && (
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                {savedCount}
              </span>
            )}
          </button>

          <a
            href="#generator"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-2 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Compose</span>
          </a>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';

