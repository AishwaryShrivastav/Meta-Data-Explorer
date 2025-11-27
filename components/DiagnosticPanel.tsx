import React, { useState, useEffect } from 'react';
import { runSystemTests, TestResult } from '../utils/testSuite';

const DiagnosticPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults = await runSystemTests();
    // Simulate a small delay for visual effect
    setTimeout(() => {
      setResults(testResults);
      setIsRunning(false);
    }, 600);
  };

  useEffect(() => {
    if (isOpen && results.length === 0) {
      runTests();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-900 border border-slate-700 text-slate-500 hover:text-blue-400 p-2 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        title="Run System Diagnostics"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
    );
  }

  const allPassed = results.every(r => r.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            System Diagnostics
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-4 bg-slate-900 min-h-[200px]">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-400 text-sm">Running self-tests...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-slate-700/50">
                  <span className="text-sm text-slate-300 font-medium">{result.name}</span>
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <span className="flex items-center gap-1 text-xs text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        PASS
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        FAIL
                      </span>
                    )}
                  </div>
                  {result.message && (
                     <div className="w-full text-xs text-red-400 mt-1 pl-2 border-l-2 border-red-500/30">
                       {result.message}
                     </div>
                  )}
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className={`p-3 rounded-lg text-center font-medium border ${allPassed ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                   {allPassed ? "System Ready for Deployment" : "Issues Detected"}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
           <button 
             onClick={runTests} 
             disabled={isRunning}
             className="text-xs text-slate-400 hover:text-white underline px-3"
           >
             Rerun Tests
           </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;