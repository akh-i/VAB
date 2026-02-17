
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import ComparisonTable from './components/ComparisonTable';
import ReviewAnalysis from './components/ReviewAnalysis';
import { analyzeProduct } from './services/geminiService';
import { AnalysisResult } from './types';
import { sounds } from './utils/audio';
import { 
  ArrowRight, X, Activity, 
  Terminal, Shield, Cpu, Wifi, Maximize2, 
  TrendingUp, Globe, ShoppingCart, Zap,
  BarChart3, Layers, AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["SYSTEM READY", "ECOSYSTEM INITIALIZED"]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showIntro) {
      sounds.playIntro();
      const timer = setTimeout(() => setShowIntro(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `> ${new Date().toLocaleTimeString()} | ${msg.toUpperCase()}`]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      sounds.playClick();
      setUsername(nameInput.trim());
      addLog(`ACCESS_GRANTED: ${nameInput.toUpperCase()}`);
      addLog("SYNCING GLOBAL RETAIL NODES...");
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      sounds.playClick();
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      addLog("IMAGE_PAYLOAD_RECEIVED: ANALYZING PIXELS...");
      await runAnalysis(undefined, file);
    }
  };

  const runAnalysis = async (textQuery?: string, imageFile?: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`INITIATING FORENSIC SCAN: ${textQuery || 'VISUAL_DATA'}`);
    
    try {
      const data = await analyzeProduct(textQuery || '', imageFile);
      setResult(data);
      sounds.playSuccess();
      addLog("DATA_RECOVERY_SUCCESSFUL: RENDERING REPORT");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (err: any) {
      const errorMsg = err.message || "SYSTEM_LINK_FAILURE";
      setError(errorMsg);
      addLog(`CRITICAL_ERROR: ${errorMsg.split(':')[0]}`);
    } finally {
      setLoading(false);
    }
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="relative text-center scale-75 md:scale-100">
          <h1 className="vab-logo-intro">VAB</h1>
          <div className="mt-8 space-y-2 opacity-50">
             <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
             <p className="font-mono text-[9px] text-primary tracking-[1.5em] uppercase">Digital Ecosystem v3.0</p>
          </div>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 cyber-grid">
        <div className="w-full max-w-xl bg-white/[0.01] border border-white/5 rounded-[4rem] p-16 text-center backdrop-blur-3xl shadow-[0_0_120px_rgba(99,102,241,0.05)]">
          <div className="mx-auto w-24 h-24 rounded-3xl rotate-45 border border-primary/20 flex items-center justify-center mb-16 relative">
               <Shield className="w-10 h-10 text-primary -rotate-45" />
               <div className="absolute inset-0 rounded-3xl border-2 border-primary/10 animate-ping"></div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-widest uppercase">Ecosystem Access</h1>
          <p className="text-gray-600 font-mono text-[9px] mb-12 uppercase tracking-[0.6em]">System Identity Verification Required</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="0x_IDENTITY"
              className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-8 text-center text-xl text-white placeholder-gray-800 focus:border-primary outline-none transition-all uppercase font-mono tracking-widest"
              autoFocus
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full h-20 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all active:scale-95 uppercase tracking-[0.3em] text-xs"
            >
              Initialize Node
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 cyber-grid selection:bg-primary selection:text-white pb-24">
      <Navbar onReset={() => { setPreviewUrl(null); setResult(null); setQuery(''); addLog("SYSTEM_RESET"); setError(null); }} />

      <main className="max-w-7xl mx-auto px-6 py-12 relative grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR: SYSTEM HUD */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  {error ? 'System Fault' : 'System Stable'}
                </span>
              </div>
              <Activity className={`w-4 h-4 ${error ? 'text-red-500' : 'text-primary'}`} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-600">
                <span>CPU_LOAD</span>
                <span className="text-primary">02%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[2%]"></div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-600">
                <span>RETAIL_INDEX</span>
                <span className="text-green-500">100%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full"></div>
              </div>
            </div>

            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-black/40 border border-white/5 group">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} className="w-full h-full object-cover brightness-75 contrast-125" />
                  {loading && <div className="scan-line"></div>}
                  <button onClick={() => setPreviewUrl(null)} className="absolute top-6 right-6 bg-black/80 p-4 rounded-full hover:bg-red-500 transition-all backdrop-blur-xl border border-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/[0.03] transition-all group">
                  <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Maximize2 className="w-6 h-6 text-gray-600 group-hover:text-primary" />
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.4em] text-gray-600 uppercase">Awaiting Visual Input</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); runAnalysis(query); }} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="EXECUTE_QUERY..."
                className="w-full h-16 bg-black/40 border border-white/10 rounded-2xl px-6 text-sm font-mono placeholder-gray-800 focus:border-primary outline-none transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl hover:bg-primary hover:text-white transition-all">
                <Zap className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* SYSTEM CONSOLE */}
          <div className="bg-black/80 border border-white/5 rounded-[2rem] p-6 h-48 overflow-hidden relative backdrop-blur-xl">
             <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Forensic Log Stream</span>
             </div>
             <div className="space-y-1.5 font-mono">
                {logs.map((log, i) => (
                  <div key={i} className={`text-[9px] ${log.includes('CRITICAL_ERROR') ? 'text-red-500' : 'text-gray-400'}`}>
                    <span className="text-primary/40 mr-2">#</span>{log}
                  </div>
                ))}
                <div ref={logEndRef}></div>
             </div>
          </div>
        </div>

        {/* MAIN DASHBOARD */}
        <div className="lg:col-span-8" ref={resultsRef}>
          {loading ? (
            <div className="space-y-8 animate-pulse">
               <div className="h-20 bg-white/5 rounded-[2rem]"></div>
               <div className="h-96 bg-white/5 rounded-[3rem]"></div>
               <div className="h-64 bg-white/5 rounded-[3rem]"></div>
            </div>
          ) : error ? (
            <div className="h-[600px] flex flex-col items-center justify-center text-center p-12">
               <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
                  <AlertCircle className="w-10 h-10 text-red-500" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">System Fault Detected</h3>
               <p className="text-sm font-mono text-red-400/80 mb-8 max-w-md bg-red-950/20 p-6 rounded-2xl border border-red-500/10">
                  {error}
               </p>
               <button 
                onClick={() => runAnalysis(query)}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
               >
                 Restart Scan
               </button>
            </div>
          ) : result && result.productData ? (
            <div className="space-y-12 animate-slide-up">
              <header className="px-4">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-6 h-[1px] bg-primary"></div>
                   <span className="text-[10px] font-mono text-primary tracking-[0.4em] uppercase">{result.productData.category}</span>
                </div>
                <h2 className="text-5xl font-black tracking-tighter leading-[0.9] text-white uppercase italic">{result.productData.productName}</h2>
                <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Node_Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{result.productData.brand} Ecosystem</span>
                  </div>
                </div>
              </header>

              <ComparisonTable 
                sellers={result.productData.sellers} 
                productName={result.productData.productName} 
                intelligence={result.productData.intelligence}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                  <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-3">
                    <Layers className="w-4 h-4" /> Technical Profile
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {result.productData.description}
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                  <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-3">
                    <Zap className="w-4 h-4" /> Key Modifiers
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {result.productData.keyFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-gray-500 uppercase bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <span className="text-primary font-bold">»</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ReviewAnalysis reviews={result.productData.reviews} />
            </div>
          ) : (
            <div className="h-[800px] border border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center bg-white/[0.01]">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 px-12">
                  {[
                    { icon: ShoppingCart, label: 'Omni-Retail' },
                    { icon: TrendingUp, label: 'Price Forensics' },
                    { icon: BarChart3, label: 'Market Sync' },
                    { icon: Shield, label: 'VAB Secure' }
                  ].map((item, i) => (
                    <div key={i} className="text-center group">
                      <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 mx-auto group-hover:border-primary/40 transition-all">
                        <item.icon className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-600">{item.label}</span>
                    </div>
                  ))}
               </div>
               <div className="text-center max-w-sm space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.8em] text-gray-800">Ecosystem Idle</p>
                  <p className="text-xs text-gray-600 leading-relaxed font-light px-8">
                    Scan a product via image or enter model parameters to initiate forensic retail analysis.
                  </p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
