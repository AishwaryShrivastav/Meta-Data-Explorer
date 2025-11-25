import React, { useState, useEffect } from 'react';
import { EditableMetaData, AIAnalysisResult, AppState } from '../types';
import { analyzeFileWithGemini } from '../services/geminiService';

interface MetadataEditorProps {
  file: File;
  metaData: EditableMetaData;
  setMetaData: React.Dispatch<React.SetStateAction<EditableMetaData>>;
  onSave: () => void;
  onDownloadJson: () => void;
  onReset: () => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ 
  file, 
  metaData, 
  setMetaData, 
  onSave, 
  onDownloadJson,
  onReset 
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetaData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFileWithGemini(file);
      setMetaData(prev => ({
        ...prev,
        description: result.summary,
        keywords: result.keywords,
        name: result.suggestedFilename || prev.name, // Suggestion or keep original
      }));
    } catch (err: any) {
      setError("Failed to analyze file. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const val = input.value.trim();
      if (val && !metaData.keywords.includes(val)) {
        setMetaData(prev => ({ ...prev, keywords: [...prev.keywords, val] }));
        input.value = '';
      }
    }
  };

  const removeKeyword = (tag: string) => {
    setMetaData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== tag) }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Metadata Editor
        </h2>
        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all
            ${analyzing 
              ? 'bg-purple-500/20 text-purple-300 cursor-wait' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25'}
          `}
        >
          {analyzing ? (
            <>
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Auto-Fill with AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           {error}
        </div>
      )}

      <div className="space-y-5 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {/* Filename */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">File Name</label>
          <input
            type="text"
            name="name"
            value={metaData.name}
            onChange={handleInputChange}
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-600"
          />
        </div>

        {/* MIME Type - Suggestion only, technically hard to change the actual file content type without conversion, but useful for metadata */}
        <div>
           <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">MIME Type</label>
           <input
            type="text"
            name="type"
            value={metaData.type}
            onChange={handleInputChange}
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-600"
          />
        </div>

        {/* Last Modified */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Last Modified</label>
          <input
            type="datetime-local"
            name="lastModified"
            value={metaData.lastModified}
            onChange={handleInputChange}
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-600"
          />
        </div>

        {/* Description (Sidecar data) */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Description (Sidecar)</label>
          <textarea
            name="description"
            rows={4}
            value={metaData.description}
            onChange={handleInputChange}
            placeholder="Enter a description for this file..."
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none placeholder-slate-600"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Keywords</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {metaData.keywords.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {tag}
                <button onClick={() => removeKeyword(tag)} className="ml-1.5 hover:text-white">×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type and press Enter to add..."
            onKeyDown={handleAddKeyword}
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-600 text-sm"
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 gap-3">
         <button
          onClick={onDownloadJson}
          className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          JSON Sidecar
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          Save File
        </button>
      </div>
       <button onClick={onReset} className="mt-3 text-xs text-slate-500 hover:text-slate-300 w-full text-center">
          Upload a different file
        </button>
    </div>
  );
};

export default MetadataEditor;
