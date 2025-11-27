import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Upload file area. Drag and drop or click to select a file."
        className={`
          relative group cursor-pointer 
          border-2 border-dashed rounded-2xl p-12 
          flex flex-col items-center justify-center text-center
          transition-all duration-300 ease-in-out
          backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/30
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02] shadow-2xl shadow-blue-500/20' 
            : 'border-slate-700 hover:border-blue-400 hover:bg-slate-800/50 bg-slate-900/30'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
        
        <div className={`p-5 rounded-full mb-6 transition-all duration-300 ${isDragging ? 'bg-blue-500/20 text-blue-400 scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-blue-300 shadow-lg'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">
          {isDragging ? 'Drop file here' : 'Upload File'}
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-2 leading-relaxed">
          Drag & drop or click to select a file to view and edit its metadata.
        </p>
      </div>

      {/* Disclaimer Section */}
      <div className="mt-6 p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-center backdrop-blur-sm">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-blue-400 font-semibold block mb-1">Ownership Confirmation</span>
          By uploading this file, you confirm that you are the rightful owner of the asset and are using this tool specifically to view the metadata or to correct any incorrect metadata associated with the file.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;