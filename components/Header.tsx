import React from 'react';
import { Video, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              StyleMimic
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">REVERSE PROMPT ENGINEER</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;