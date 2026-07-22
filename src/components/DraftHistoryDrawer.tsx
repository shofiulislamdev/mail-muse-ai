import React, { useEffect } from 'react';
import { X, Bookmark, Trash2, Mail, ExternalLink, Calendar, User } from 'lucide-react';
import { GeneratedEmail } from '../types';

interface DraftHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: GeneratedEmail[];
  onSelectDraft: (draft: GeneratedEmail) => void;
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
}

/**
 * DraftHistoryDrawer Component
 * Accessible sliding drawer component displaying previously saved email drafts.
 * Supports keyboard 'Escape' key to close and ARIA dialog properties.
 */
export const DraftHistoryDrawer: React.FC<DraftHistoryDrawerProps> = React.memo(({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onDeleteDraft,
  onClearAll,
}) => {
  // Listen for Escape key to close the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200"
    >
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container */}
      <aside className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-250 transition-colors">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100/80 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl" aria-hidden="true">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 id="drawer-title" className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Saved Email Drafts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{drafts.length} saved copies</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved drafts drawer"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Draft List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {drafts.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Mail className="w-10 h-10 mx-auto mb-2 opacity-50 text-indigo-400" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No saved drafts yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-1">
                Generated emails can be saved here for quick reference, team sharing, and future edits.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-3.5 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-200 dark:hover:border-indigo-800 rounded-xl transition-all duration-150 group relative space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100/90 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold capitalize">
                    {draft.tone} Tone
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {draft.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {draft.subject}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed whitespace-pre-line">
                  {draft.body}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {draft.recipient}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-rose-500"
                      title="Delete draft"
                      aria-label={`Delete draft titled ${draft.subject}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDraft(draft);
                        onClose();
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-xs flex items-center gap-1 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500"
                    >
                      <span>Load</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {drafts.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-semibold flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Drafts</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </aside>
    </div>
  );
});

DraftHistoryDrawer.displayName = 'DraftHistoryDrawer';
