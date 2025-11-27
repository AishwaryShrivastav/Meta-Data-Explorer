import React from 'react';
import { EditableMetaData, CustomField } from '../types';
import { formatBytes } from '../utils/fileUtils';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetaData(prev => ({ ...prev, [name]: value }));
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

  const handleAddCustomField = () => {
    setMetaData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { id: Date.now().toString(), key: '', value: '' }]
    }));
  };

  const handleCustomFieldChange = (id: string, field: 'key' | 'value', newValue: string) => {
    setMetaData(prev => ({
      ...prev,
      customFields: prev.customFields.map(item => 
        item.id === id ? { ...item, [field]: newValue } : item
      )
    }));
  };

  const handleRemoveCustomField = (id: string) => {
    setMetaData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Metadata Editor
        </h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Close editor and return home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Read-Only File Stats */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
          <div>
             <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Original Size</span>
             <span className="text-sm font-mono text-slate-300">{formatBytes(file.size)}</span>
          </div>
          <div>
             <span className="block text-[10px] text-slate-500 uppercase tracking-wider">File Path</span>
             <span className="text-sm font-mono text-slate-300 truncate block" title={file.webkitRelativePath || file.name}>
               {file.webkitRelativePath || '/'}
             </span>
          </div>
        </div>

        {/* Standard Metadata Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700/50 pb-1">Standard Properties</h3>
          
          {/* Filename */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">File Name</label>
            <input
              type="text"
              name="name"
              value={metaData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-600"
            />
          </div>

          {/* MIME Type */}
          <div>
             <label className="block text-xs font-medium text-slate-400 mb-1.5">MIME Type</label>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Modified</label>
            <input
              type="datetime-local"
              name="lastModified"
              value={metaData.lastModified}
              onChange={handleInputChange}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-600"
            />
          </div>
        </div>

        {/* Sidecar Metadata Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700/50 pb-1">Sidecar Data</h3>
          
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={3}
              value={metaData.description}
              onChange={handleInputChange}
              placeholder="Enter a description for this file..."
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none placeholder-slate-600"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Keywords</label>
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

        {/* Extended/Custom Metadata Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Extended Metadata</h3>
            <button 
              onClick={handleAddCustomField}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Field
            </button>
          </div>
          
          <div className="space-y-2">
            {metaData.customFields.length === 0 && (
              <p className="text-sm text-slate-500 italic">No custom fields added. Add fields like 'Author', 'Copyright', or 'Location'.</p>
            )}
            {metaData.customFields.map((field) => (
              <div key={field.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-1 duration-200">
                <input
                  type="text"
                  placeholder="Key (e.g. Author)"
                  value={field.key}
                  onChange={(e) => handleCustomFieldChange(field.id, 'key', e.target.value)}
                  className="w-1/3 bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                  className="flex-grow bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                />
                <button 
                  onClick={() => handleRemoveCustomField(field.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-3 mb-2">
           <button
            onClick={onDownloadJson}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            title="Download metadata as a separate JSON file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            JSON Sidecar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            title="Save file with new name and timestamps"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save File
          </button>
        </div>
        <p className="text-[10px] text-slate-500 text-center leading-tight">
          "Save File" updates system properties. Extended metadata is saved in the JSON Sidecar.
        </p>
      </div>
    </div>
  );
};

export default MetadataEditor;