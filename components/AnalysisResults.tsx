import React, { useState } from 'react';
import { VideoAnalysis } from '../types';
import { Copy, Check, RefreshCw, Zap, Camera, Palette, Activity, MonitorPlay } from 'lucide-react';

interface AnalysisResultsProps {
  results: VideoAnalysis;
  onReset: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(results.generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Master Prompt Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="bg-indigo-600/10 border-b border-indigo-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-indigo-100">Generative Prompt</h2>
          </div>
          <span className="text-xs font-mono text-indigo-300/70 uppercase tracking-widest">Ready for Veo/Sora</span>
        </div>
        <div className="p-6">
          <div className="bg-black/30 rounded-xl p-5 font-mono text-sm text-indigo-100 leading-relaxed border border-indigo-500/10 relative group">
             {results.generatedPrompt}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
             <button 
              onClick={onReset}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
             >
               <RefreshCw className="w-4 h-4" />
               Analyze Another
             </button>
             <button 
              onClick={handleCopy}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
             >
               {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
               {copied ? "Copied!" : "Copy Prompt"}
             </button>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visual Style */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Palette className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-semibold text-slate-200">Visual Style</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {results.visualStyle}
          </p>
        </div>

        {/* Cinematography */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Camera className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-slate-200">Cinematography</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {results.cinematography}
          </p>
        </div>

        {/* Pacing */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-slate-200">Pacing & Mood</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {results.pacingAndMood}
          </p>
        </div>

        {/* Technical Details */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <MonitorPlay className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-semibold text-slate-200">Technical</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {results.technicalDetails}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResults;