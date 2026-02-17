
import React, { useState } from 'react';
import { Seller, MarketIntelligence } from '../types';
import { ExternalLink, CheckCircle, XCircle, Tag, Search, Bell, BellRing, TrendingDown, Info, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface Props {
  sellers?: Seller[];
  productName?: string;
  intelligence?: MarketIntelligence;
}

const ComparisonTable: React.FC<Props> = ({ sellers = [], productName = '', intelligence }) => {
  const [monitored, setMonitored] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{show: boolean, message: string} | null>(null);

  const safeSellers = Array.isArray(sellers) ? sellers.filter(s => s && (s.name || s.price)) : [];
  const sortedSellers = [...safeSellers].sort((a, b) => {
    const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return priceA - priceB;
  });

  const toggleMonitor = (idx: number, storeName: string, price: string) => {
    const newSet = new Set(monitored);
    const isAdding = !newSet.has(idx);
    if (isAdding) {
      newSet.add(idx);
      showToast(`VAB System: Tracking ${storeName} for drops below ${price}`);
    } else {
      newSet.delete(idx);
      showToast(`Tracking disabled for ${storeName}`);
    }
    setMonitored(newSet);
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Intelligence Cards */}
      {intelligence && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5 backdrop-blur-xl group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Price Health</span>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{intelligence.priceConfidence}%</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">System Confidence Score</div>
          </div>
          
          <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5 backdrop-blur-xl group hover:border-green-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Action Required</span>
              <TrendingDown className="w-4 h-4 text-green-500" />
            </div>
            <div className={`text-xl font-black mb-1 uppercase ${intelligence.buyRecommendation === 'buy_now' ? 'text-green-500' : 'text-yellow-500'}`}>
              {intelligence.buyRecommendation.replace('_', ' ')}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">{intelligence.expectedPriceDrop || 'Stable Market'}</div>
          </div>

          <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5 backdrop-blur-xl md:col-span-1">
             <div className="flex items-center gap-2 mb-2">
               <Info className="w-3.5 h-3.5 text-gray-600" />
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Market Analysis</span>
             </div>
             <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
               {intelligence.last30DaysTrend}
             </p>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-gray-800/30 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
        {toast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-2xl text-[10px] font-black uppercase z-20 flex items-center gap-3 animate-fade-in-down">
              <BellRing className="w-4 h-4 text-primary" />
              {toast.message}
          </div>
        )}

        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
             Active Monitoring: {sortedSellers.length} Nodes
          </h3>
          <span className="text-[10px] font-bold text-gray-500 uppercase">Live Indexing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {sortedSellers.map((seller, idx) => (
                <tr key={idx} className={`hover:bg-white/[0.03] transition-all group ${idx === 0 ? 'bg-primary/5' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{seller.name}</span>
                      {idx === 0 && <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">Master Node / Lowest</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-2xl font-black text-white">{formatCurrency(seller.price, 'INR')}</div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase">{seller.offers || 'Standard Pricing'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                        onClick={() => toggleMonitor(idx, seller.name, formatCurrency(seller.price, 'INR'))}
                        className={`p-4 rounded-2xl transition-all border ${
                            monitored.has(idx) 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                        }`}
                    >
                        {monitored.has(idx) ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(productName + ' ' + seller.name)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-[11px] font-black uppercase text-black bg-white px-8 py-4 rounded-2xl transition-all hover:bg-primary hover:text-white active:scale-95 shadow-xl shadow-white/5"
                    >
                      Access Node <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
