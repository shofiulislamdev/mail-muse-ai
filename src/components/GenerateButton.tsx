import React from 'react';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
  label = 'Generate Email Draft',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative group w-full py-3.5 px-5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 transition-all duration-200 ease-in-out flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none overflow-hidden ${className}`}
    >
      {/* Subtle shine highlight on hover */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {isLoading ? (
        <LoadingSpinner label="Generating AI Draft..." size="sm" className="text-white" />
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-indigo-200 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
          <span className="tracking-wide text-sm">{label}</span>
        </>
      )}
    </button>
  );
};
