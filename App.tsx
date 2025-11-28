import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductSkeleton from './components/ProductSkeleton';
import ComparisonTable from './components/ComparisonTable';
import ReviewAnalysis from './components/ReviewAnalysis';
import { analyzeProduct } from './services/geminiService';
import { AnalysisResult } from './types';
import { Upload, ArrowRight, Link as LinkIcon, AlertCircle, ScanLine, Camera, Search, Sparkles, X } from 'lucide-react';

const App: React.FC = () => {
  // Login State
  const [username, setUsername] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');

  // App State
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
    }
  };

  // Immediate Trigger on Image Selection (Lens Style)
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Auto-trigger analysis
      await runAnalysis(undefined, file);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await runAnalysis(query, selectedImage || undefined);
  };

  const runAnalysis = async (textQuery?: string, imageFile?: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Scroll to results area immediately to show loading state
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const data = await analyzeProduct(textQuery || '', imageFile);
      setResult(data);
      if (!data.productData && !data.rawText) {
          setError("Could not identify product. Try a clearer angle.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Connection failed. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setQuery('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!username) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8 shadow-2xl animate-fade-in text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
               <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ShopLens</h1>
          <p className="text-gray-400 mb-8">Smart visual shopping assistant</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="w-full h-14 bg-gray-800 border border-gray-600 rounded-2xl px-6 text-center text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full h-14 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN LENS INTERFACE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-primary selection:text-white pb-24">
      <Navbar onReset={clearState} />

      <main className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Personalized Greeting */}
        {!result && !loading && (
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-2xl text-gray-300">
                    Hi, <span className="text-white font-semibold">{username}</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Tap the lens below to search</p>
            </div>
        )}

        {/* LENS VIEWFINDER (Hero Section) */}
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] md:aspect-[4/3] rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl shadow-primary/10 border border-gray-800 bg-gray-900 group">
            
            {/* Viewfinder Corners Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 p-6">
                <div className="w-full h-full border-2 border-white/10 rounded-2xl relative">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                </div>
            </div>

            {/* Content Area */}
            {previewUrl ? (
                // Image Loaded State
                <div className="relative w-full h-full">
                    <img src={previewUrl} alt="Target" className="w-full h-full object-cover" />
                    
                    {/* Scanning Animation */}
                    {loading && <div className="scan-line"></div>}
                    
                    {/* Retake Button */}
                    {!loading && (
                        <button 
                            onClick={clearState}
                            className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            ) : (
                // Empty State (Camera Button)
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-xl shadow-primary/20 animate-pulse">
                        <Camera className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-lg font-medium text-white">Tap to search with Lens</span>
                    <span className="text-sm text-gray-500 mt-2">Upload or take a photo</span>
                </div>
            )}

            {/* Hidden Input */}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageSelect} 
                className="hidden" 
                accept="image/*"
                capture="environment" 
            />
        </div>

        {/* SEARCH BAR (Floating) */}
        <div className="max-w-md mx-auto mt-6">
            <form onSubmit={handleTextSubmit} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about this product..."
                    className="block w-full pl-11 pr-12 py-4 bg-gray-800/80 border border-gray-700 rounded-full leading-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 transition-all shadow-lg"
                />
                <button 
                    type="submit"
                    className="absolute inset-y-1 right-1 px-4 bg-white text-black rounded-full hover:bg-gray-200 font-medium text-sm transition-colors flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <ArrowRight className="w-5 h-5" />}
                </button>
            </form>
        </div>
        
        {/* ERROR MESSAGE */}
        {error && (
            <div className="max-w-md mx-auto mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
            </div>
        )}

        {/* RESULTS SECTION */}
        <div className="mt-12" ref={resultsRef}>
            {loading && (
                <div className="animate-fade-in">
                    <ProductSkeleton />
                    <div className="text-center mt-4">
                        <p className="text-gray-400 animate-pulse">Scanning product details...</p>
                    </div>
                </div>
            )}
            
            {!loading && result && result.productData && (
                <div className="animate-slide-up space-y-8">
                    {/* Header Info */}
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                            {result.productData.category}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{result.productData.productName}</h2>
                        <p className="text-xl text-gray-400">{result.productData.brand}</p>
                    </div>

                    {/* Comparison Table */}
                    <ComparisonTable sellers={result.productData.sellers || []} productName={result.productData.productName || ''} />

                    {/* Description & Features */}
                    <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700">
                        <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                            {result.productData.description}
                        </p>
                         <div className="flex flex-wrap gap-2">
                            {result.productData.keyFeatures?.map((feature, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    {result.productData.reviews && <ReviewAnalysis reviews={result.productData.reviews} />}

                    {/* Sources */}
                    {result.sources && result.sources.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 pt-4 opacity-70">
                            {result.sources.slice(0, 3).map((source, i) => (
                                <a 
                                    key={i} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full text-xs text-gray-400 hover:text-white transition-colors"
                                >
                                    <LinkIcon className="w-3 h-3" />
                                    <span className="truncate max-w-[150px]">{source.title}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Fallback Text */}
            {!loading && result && !result.productData && result.rawText && (
                 <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mt-8">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm">
                        {result.rawText}
                    </pre>
                 </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;