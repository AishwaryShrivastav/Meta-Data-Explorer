import React, { useState, useEffect } from 'react';
import { formatBytes } from '../utils/fileUtils';

interface FilePreviewProps {
  file: File;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create object URLs for Image, Video, and Audio types
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const renderPreviewMedia = () => {
    if (!previewUrl) return getFileIcon();

    if (file.type.startsWith('image/')) {
      return (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="max-w-full max-h-[400px] object-contain shadow-lg rounded-md" 
        />
      );
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <video 
          controls 
          className="max-w-full max-h-[400px] shadow-lg rounded-md w-full"
        >
          <source src={previewUrl} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center p-8 w-full">
           <svg className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
           <audio controls className="w-full max-w-xs">
            <source src={previewUrl} type={file.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    return getFileIcon();
  };

  const getFileIcon = () => {
    if (file.type.includes('pdf')) return (
      <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    );
    if (file.type.includes('text')) return (
      <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    );
    // Default
    return (
      <div className="flex flex-col items-center">
        <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <p className="mt-2 text-slate-500">Preview not available</p>
      </div>
    );
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-xl h-full flex flex-col items-center">
      <h2 className="text-xl font-semibold text-white w-full mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        File Preview
      </h2>
      
      <div className="flex-grow w-full flex flex-col items-center justify-center min-h-[200px] mb-8 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50 relative p-2">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        {renderPreviewMedia()}
      </div>

      <div className="w-full space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Original Size</p>
          <p className="text-slate-200 font-mono">{formatBytes(file.size)}</p>
        </div>
        
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Original Type</p>
          <p className="text-slate-200 font-mono break-all">{file.type || 'application/octet-stream'}</p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Last Modified (Original)</p>
          <p className="text-slate-200 font-mono">{new Date(file.lastModified).toLocaleString()}</p>
        </div>

        {file.webkitRelativePath && (
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Relative Path</p>
            <p className="text-slate-200 font-mono break-all text-xs">{file.webkitRelativePath}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;