import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import MetadataEditor from './components/MetadataEditor';
import ErrorBoundary from './components/ErrorBoundary';
import DiagnosticPanel from './components/DiagnosticPanel';
import { EditableMetaData, CustomField } from './types';
import { formatDateForInput, downloadFile, downloadMetadataJson } from './utils/fileUtils';

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metaData, setMetaData] = useState<EditableMetaData>({
    name: '',
    type: '',
    lastModified: '',
    description: '',
    keywords: [],
    customFields: [],
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setMetaData({
      name: selectedFile.name,
      type: selectedFile.type,
      lastModified: formatDateForInput(selectedFile.lastModified),
      description: '',
      keywords: [],
      customFields: [],
    });
  };

  const handleSave = () => {
    if (!file) return;
    const timestamp = new Date(metaData.lastModified).getTime();
    downloadFile(file, metaData.name, metaData.type, isNaN(timestamp) ? Date.now() : timestamp);
  };

  const handleDownloadJson = () => {
    if (!file) return;

    // Convert custom fields array back to a clean object
    const extendedMetadata = metaData.customFields.reduce((acc, field) => {
      if (field.key.trim()) {
        acc[field.key.trim()] = field.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const dataToSave = {
      filename: metaData.name,
      mimeType: metaData.type,
      lastModified: metaData.lastModified,
      description: metaData.description,
      keywords: metaData.keywords,
      originalSize: file.size,
      originalName: file.name,
      extendedMetadata: Object.keys(extendedMetadata).length > 0 ? extendedMetadata : undefined,
    };

    // Strip extension for JSON filename
    const baseName = metaData.name.substring(0, metaData.name.lastIndexOf('.')) || metaData.name;
    downloadMetadataJson(dataToSave, baseName);
  };

  const handleReset = () => {
    setFile(null);
    setMetaData({
      name: '',
      type: '',
      lastModified: '',
      description: '',
      keywords: [],
      customFields: [],
    });
  };

  const handleGoHome = () => {
    if (file) {
      if (window.confirm("Return to home? Any unsaved changes to the current file will be lost.")) {
        handleReset();
      }
    } else {
      handleReset();
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-200 selection:bg-blue-500/30 flex flex-col">
        
        {/* Navbar */}
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button 
                onClick={handleGoHome}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                aria-label="Go to Home"
              >
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
                  MetaLens
                </span>
              </button>
              <div className="hidden sm:block text-xs font-medium text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                File Metadata Editor
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {!file ? (
            <div className="max-w-xl mx-auto mt-8 md:mt-20 fade-in-up">
              <FileUpload onFileSelect={handleFileSelect} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {[
                  {
                    title: "Inspect",
                    desc: "View technical properties.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ),
                    color: "blue"
                  },
                  {
                    title: "Organize",
                    desc: "Manage tags and descriptions.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    ),
                    color: "purple"
                  },
                  {
                    title: "Edit",
                    desc: "Fix metadata and export.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    ),
                    color: "indigo"
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-colors">
                    <div className={`w-10 h-10 mx-auto mb-3 bg-${feature.color}-500/10 rounded-full flex items-center justify-center text-${feature.color}-400`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">{feature.title}</h3>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
               {/* Breadcrumbs */}
               <div className="mb-4 flex items-center text-sm text-slate-400 animate-in fade-in slide-in-from-left-4 duration-300">
                  <button 
                    onClick={handleGoHome} 
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Home
                  </button>
                  <svg className="w-4 h-4 text-slate-600 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  <div className="flex items-center gap-2 text-slate-200 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="truncate max-w-[150px] sm:max-w-[300px]">{file.name}</span>
                  </div>
               </div>

              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:h-[calc(100vh-12rem)]">
                <div className="lg:col-span-1 lg:h-full lg:overflow-hidden">
                  <FilePreview file={file} />
                </div>
                <div className="lg:col-span-2 lg:h-full lg:overflow-hidden">
                  <MetadataEditor 
                    file={file} 
                    metaData={metaData} 
                    setMetaData={setMetaData} 
                    onSave={handleSave} 
                    onDownloadJson={handleDownloadJson}
                    onReset={() => {
                      if (window.confirm("Close this file? Unsaved changes will be lost.")) {
                        handleReset();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Diagnostic Panel Button/Overlay */}
        <DiagnosticPanel />
      </div>
    </ErrorBoundary>
  );
};

export default App;