import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import { analyzeVideoStyle } from './services/geminiService';
import { AnalysisStatus, VideoAnalysis } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelected = async (file: File, context: string) => {
    setStatus(AnalysisStatus.PROCESSING_FILE);
    setErrorMsg(null);

    try {
      // 1. Validate size (e.g., limit to 50MB for this browser-based demo)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("File too large. Please upload a video under 50MB for this demo.");
      }

      setStatus(AnalysisStatus.ANALYZING);
      
      // 2. Call Service
      const results = await analyzeVideoStyle(file, context);
      
      setAnalysisResult(results);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const resetAnalysis = () => {
    setStatus(AnalysisStatus.IDLE);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Intro Text */}
        {status === AnalysisStatus.IDLE && (
           <div className="text-center max-w-2xl mx-auto mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
               Recreate any viral video style.
             </h2>
             <p className="text-lg text-slate-400">
               Paste a URL or upload a video. our AI dissects the editing, lighting, and camera work to give you the <span className="text-indigo-400 font-semibold">perfect prompt</span> for generation.
             </p>
           </div>
        )}

        {status === AnalysisStatus.ERROR && (
           <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-in shake">
             <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
             <div>
               <h3 className="text-red-200 font-semibold">Analysis Failed</h3>
               <p className="text-red-300/80 text-sm mt-1">{errorMsg}</p>
               <button onClick={resetAnalysis} className="mt-3 text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wide">Try Again</button>
             </div>
           </div>
        )}

        {status === AnalysisStatus.COMPLETED && analysisResult ? (
          <AnalysisResults results={analysisResult} onReset={resetAnalysis} />
        ) : (
          <UploadSection 
            onFileSelected={handleFileSelected} 
            isProcessing={status === AnalysisStatus.ANALYZING || status === AnalysisStatus.PROCESSING_FILE} 
          />
        )}
        
      </main>

      <footer className="border-t border-slate-900 mt-auto py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} StyleMimic. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;