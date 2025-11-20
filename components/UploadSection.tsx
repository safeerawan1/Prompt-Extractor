import React, { useCallback, useState } from 'react';
import { UploadCloud, Link as LinkIcon, AlertCircle, FileVideo, X } from 'lucide-react';

interface UploadSectionProps {
  onFileSelected: (file: File, context: string) => void;
  isProcessing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [showUrlWarning, setShowUrlWarning] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Simple validation for video types
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
      setShowUrlWarning(false);
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
        // In a real production app, we would send this URL to a backend to download.
        // For this client-side demo, we must ask for the file.
        setShowUrlWarning(true);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelected(selectedFile, additionalContext);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* URL Input Section (Simulation) */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-1 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <form onSubmit={handleUrlSubmit} className="flex items-center">
          <div className="pl-4 pr-2 text-slate-400">
            <LinkIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Paste Shorts/Reels/TikTok URL here..."
            className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 py-3 px-2 outline-none"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors m-1"
          >
            Analyze
          </button>
        </form>
      </div>

      {showUrlWarning && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200">
            <p className="font-semibold mb-1">Browser Limitation</p>
            <p>Due to browser security restrictions (CORS), we cannot directly download videos from social media URLs in this demo. Please download the video and upload the file below for analysis.</p>
          </div>
          <button onClick={() => setShowUrlWarning(false)} className="ml-auto text-amber-400 hover:text-amber-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 justify-center text-slate-500 text-sm font-medium">
        <div className="h-px bg-slate-800 flex-1"></div>
        <span>OR UPLOAD FILE</span>
        <div className="h-px bg-slate-800 flex-1"></div>
      </div>

      {/* File Upload Zone */}
      {!selectedFile ? (
        <div 
          className={`relative group border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
            ${dragActive 
              ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]" 
              : "border-slate-700 hover:border-slate-600 bg-slate-800/20 hover:bg-slate-800/40"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept="video/*" 
            onChange={handleChange} 
          />
          
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors shadow-inner">
            <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            Drop your video here
          </h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
            Supports MP4, MOV, WEBM. Optimized for Short-form content (under 1 minute).
          </p>
          
          <button className="text-indigo-400 font-medium text-sm group-hover:text-indigo-300 transition-colors">
            Browse Files
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <FileVideo className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-white truncate max-w-[200px] sm:max-w-md">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-20"
                  placeholder="e.g. 'I want to recreate this but with a cyberpunk car instead of a person' or 'Focus on the transition styles'"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                />
             </div>

             <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all
                ${isProcessing 
                  ? 'bg-slate-700 cursor-wait opacity-70' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
                }`}
             >
               {isProcessing ? (
                 <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Analyzing Visuals...
                 </span>
               ) : (
                 "Generate Replication Prompt"
               )}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;