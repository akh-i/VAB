
import { Shield, RefreshCw, Layers } from 'lucide-react';
import React from 'react';

interface Props {
  onReset?: () => void;
}

const Navbar: React.FC<Props> = ({ onReset }) => {
  return (
    <nav className="w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={onReset}>
            <div className="bg-white p-2 rounded-xl group-hover:bg-primary transition-all">
              <Layers className="h-5 w-5 text-black group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">
                VAB <span className="text-primary italic">Ecosystem</span>
              </span>
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.3em]">Central Intelligence</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-8">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                 <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Nodes Active</span>
               </div>
               <div className="w-[1px] h-4 bg-white/10"></div>
               <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Gemini_3_Flash</span>
            </div>
            
            {onReset && (
              <button 
                onClick={onReset}
                className="flex items-center gap-3 px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
