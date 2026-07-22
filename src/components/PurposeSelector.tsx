import React from 'react';
import { User, UserCheck, Briefcase, Building2, ListOrdered, Target, AlertCircle } from 'lucide-react';
import { EmailFormData } from '../types';

interface PurposeSelectorProps {
  formData: EmailFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Optional error flag for missing purpose field */
  hasError?: boolean;
}

/**
 * PurposeSelector Component
 * Captures sender & recipient information, core email purpose, key value points, and CTA.
 * Fully accessible with unique labels, focus-visible outlines, and ARIA attributes.
 */
export const PurposeSelector: React.FC<PurposeSelectorProps> = React.memo(({
  formData,
  onChange,
  hasError = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Sender Information Group */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
          Sender Information (Your Details)
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sender Name / Your Name */}
          <div className="relative">
            <label htmlFor="senderName" className="sr-only">
              Your Name (Sender)
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <UserCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
            </div>
            <input
              id="senderName"
              type="text"
              name="senderName"
              value={formData.senderName || ''}
              onChange={onChange}
              placeholder="Your Name (e.g. Alex Carter)"
              className="w-full pl-9 pr-3 py-2 text-sm bg-indigo-50/30 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Sender Designation / Role */}
          <div className="relative">
            <label htmlFor="senderRole" className="sr-only">
              Your Designation / Title
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
            </div>
            <input
              id="senderRole"
              type="text"
              name="senderRole"
              value={formData.senderRole || ''}
              onChange={onChange}
              placeholder="Your Designation (e.g. Senior Manager)"
              className="w-full pl-9 pr-3 py-2 text-sm bg-indigo-50/30 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
      </fieldset>

      {/* Recipient Information Group */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
          Recipient Information
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Recipient Name */}
          <div className="relative">
            <label htmlFor="recipientName" className="sr-only">
              Recipient Name
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="recipientName"
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={onChange}
              placeholder="Recipient Name (e.g. Sarah Jenkins)"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Role / Title */}
          <div className="relative">
            <label htmlFor="recipientRole" className="sr-only">
              Recipient Role or Title
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="recipientRole"
              type="text"
              name="recipientRole"
              value={formData.recipientRole}
              onChange={onChange}
              placeholder="Role / Title (e.g. VP of Product)"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="relative">
          <label htmlFor="companyName" className="sr-only">
            Company Name
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Building2 className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            placeholder="Company Name (e.g. Acme Technologies)"
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </fieldset>

      {/* Primary Goal / Purpose Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="emailPurpose" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Primary Email Objective / Purpose <span className="text-indigo-600 dark:text-indigo-400" aria-hidden="true">*</span>
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            {formData.purpose.length}/300
          </span>
        </div>

        <textarea
          id="emailPurpose"
          name="purpose"
          rows={3}
          value={formData.purpose}
          onChange={onChange}
          aria-required="true"
          aria-invalid={hasError}
          maxLength={300}
          placeholder="State the main objective of this email (e.g., Introduce workflow automation software, ask for a 15 min meeting)"
          className={`w-full p-3 text-sm bg-slate-50/70 dark:bg-slate-800/80 border rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all text-slate-800 dark:text-slate-100 resize-none placeholder:text-slate-400 ${
            hasError
              ? 'border-rose-400 ring-1 ring-rose-300/50 bg-rose-50/30 dark:bg-rose-950/20'
              : 'border-slate-200 dark:border-slate-700 focus-visible:border-indigo-500'
          }`}
        />
        {hasError && (
          <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Email purpose is required to generate a draft.</span>
          </p>
        )}
      </div>

      {/* Key Points & Call To Action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="keyPoints" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Key Value Points
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ListOrdered className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="keyPoints"
              type="text"
              name="keyPoints"
              value={formData.keyPoints}
              onChange={onChange}
              placeholder="e.g. 40% time saved, free trial"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="callToAction" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Call To Action (CTA)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Target className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="callToAction"
              type="text"
              name="callToAction"
              value={formData.callToAction}
              onChange={onChange}
              placeholder="e.g. Schedule 15-min call next Tuesday"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PurposeSelector.displayName = 'PurposeSelector';
