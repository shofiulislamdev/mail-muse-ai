import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  filename?: string;
  label?: string;
  className?: string;
  onDownloadSuccess?: (msg: string) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename = 'email_draft.txt',
  label = 'Download .txt',
  className = '',
  onDownloadSuccess,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!content) return;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloaded(true);
    if (onDownloadSuccess) {
      onDownloadSuccess(`Email downloaded as ${filename}`);
    }

    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleDownload}
      className={`px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 border border-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
        downloaded ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : ''
      } ${className}`}
      title={label}
    >
      {downloaded ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
