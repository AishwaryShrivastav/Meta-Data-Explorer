import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import MetadataEditor from './components/MetadataEditor';
import { EditableMetaData } from './types';
import { formatDateForInput, downloadFile, downloadMetadataJson } from './utils/fileUtils';

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metaData, setMetaData] = useState<EditableMetaData>({
    name: '',
    type: '',
    lastModified: '',
    description: '',
    keywords: [],
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setMetaData({
      name: selectedFile.name,
      type: selectedFile.type,
      lastModified: formatDateForInput(selectedFile.lastModified),
      description: '',
      keywords: [],
    });
  };

  const handleSave = () => {
    if (!file) return;
    const timestamp = new Date(metaData.lastModified).getTime();
    downloadFile(file, metaData.name, metaData.type, isNaN(timestamp) ? Date.now() : timestamp);
  };

  const handleDownloadJson = () => {
    if (!file) return;
    const dataToSave = {
      ...metaData,
      originalSize: file.size,
      originalName: file.name,
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
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-200 selection:bg-blue-500/30 flex flex-col">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
                MetaLens
              </span>
            </div>
            <div className="hidden sm:block text-xs font-medium text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
              AI-Powered Metadata Editor
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!file ? (
          <div className="max-w-xl mx-auto mt-8 md:mt-20 fade-in-up">
            <FileUpload onFileSelect={handleFileSelect} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                {
                  title: "Inspect",
                  desc: "View detailed technical specs.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ),
                  color: "blue"
                },
                {
                  title: "Analyze",
                  desc: "Auto-tag content with Gemini AI.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  ),
                  color: "purple"
                },
                {
                  title: "Edit",
                  desc: "Fix metadata and export files.",
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
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:h-[calc(100vh-10rem)]">
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
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;