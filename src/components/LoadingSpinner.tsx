import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer subtle glow ring */}
        <div className={`${sizeClasses[size]} rounded-full border-current opacity-20`} />
        {/* Inner animated spinning arc */}
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} border-transparent border-t-current rounded-full animate-spin`}
          role="status"
          aria-label="loading"
        />
      </div>
      {label && <span className="text-xs font-semibold tracking-wide animate-pulse">{label}</span>}
    </div>
  );
};
