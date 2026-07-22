import React, { useState } from 'react';
import { Copy, Check, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  itemType?: string; // e.g., 'Subject' or 'Email'
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  onCopySuccess?: (msg: string) => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy Email',
  itemType = 'Email',
  className = '',
  variant = 'primary',
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (copied || isCopying || !textToCopy) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      
      const successMessage = `${itemType} copied to clipboard!`;
      if (onCopySuccess) {
        onCopySuccess(successMessage);
      }

      setTimeout(() => {
        setCopied(false);
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setIsCopying(false);
    }
  };

  const baseStyles =
    'relative overflow-hidden font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/30',
    secondary:
      'px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 border border-slate-200 shadow-2xs',
    outline:
      'px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300',
    ghost:
      'p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/80 shadow-none rounded-lg border border-transparent hover:border-indigo-100',
  };

  return (
    <motion.button
      whileTap={{ scale: copied ? 1 : 0.96 }}
      onClick={handleCopy}
      disabled={copied || isCopying || !textToCopy}
      className={`${baseStyles} ${variantStyles[variant]} ${
        copied ? 'bg-emerald-600 hover:bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20' : ''
      } ${className}`}
      title={copied ? 'Copied to clipboard' : `Copy ${itemType}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-emerald-100 font-bold"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />
            {variant !== 'ghost' && <span>Copied!</span>}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            {variant !== 'ghost' && <span>{label}</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
