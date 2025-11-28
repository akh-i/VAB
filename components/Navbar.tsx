import React from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';

interface Props {
  onReset?: () => void;
}

const Navbar: React.FC<Props> = ({ onReset }) => {
  return (
    <nav className="w-full border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              ShopLens AI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {onReset && (
              <button 
                onClick={onReset}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Search</span>
              </button>
            )}
            <div className="hidden md:block">
              <span className="text-sm text-gray-400">Powered by Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;