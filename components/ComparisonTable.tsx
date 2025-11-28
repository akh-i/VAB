import React from 'react';
import { Seller } from '../types';
import { ExternalLink, CheckCircle, XCircle, Tag, Search } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface Props {
  sellers?: Seller[];
  productName?: string;
}

const ComparisonTable: React.FC<Props> = ({ sellers = [], productName = '' }) => {
  // Safe guard: ensure sellers is an array and filter out nulls/undefined items
  const safeSellers = Array.isArray(sellers) 
    ? sellers.filter(s => s && typeof s === 'object' && (s.name || s.price)) 
    : [];

  // Sort sellers by price ascending
  const sortedSellers = [...safeSellers].sort((a, b) => {
    const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return priceA - priceB;
  });

  // Helper to ensure we get a working link to the product
  const getSellerLink = (seller: Seller) => {
    const name = (seller.name || '').toLowerCase();
    const url = (seller.link || '').toLowerCase();
    
    // Hyperlocal/Quick Commerce platforms logic
    const isHyperlocal = name.includes('blinkit') || 
                         name.includes('zepto') || 
                         name.includes('swiggy') || 
                         name.includes('instamart') || 
                         name.includes('bigbasket');

    // FORCE SEARCH for major retailers.
    // The AI often hallucinates specific product IDs or provides stale links for these massive catalogs.
    // We check both the seller name AND the URL itself to catch any direct links to these platforms.
    const isMajorRetailer = (
        name.includes('flipkart') || url.includes('flipkart.com') ||
        name.includes('amazon') || url.includes('amazon') ||
        name.includes('myntra') || url.includes('myntra') ||
        name.includes('ajio') || url.includes('ajio') ||
        name.includes('tata') || url.includes('tatacliq') ||
        name.includes('croma') || url.includes('croma') ||
        name.includes('reliance') || url.includes('reliancedigital') ||
        name.includes('vijay') || url.includes('vijaysales') ||
        name.includes('jiomart') || url.includes('jiomart')
    );

    // Only use the AI-provided link if it's NOT a major retailer (where we force search)
    // AND it's not a hyperlocal app, AND the link looks valid.
    if (!isMajorRetailer && !isHyperlocal && seller.link && seller.link.length > 15 && !seller.link.includes('google.com/search')) {
      return seller.link;
    }

    // Fallback: Generate a robust direct search URL for the specific retailer.
    // We clean the product name to improve search hit rates.
    const cleanName = (productName || '')
        .split('(')[0] // Take name before first parenthesis (usually the main model name)
        .replace(/[^\w\s]/gi, ' ') // Replace special chars with space
        .trim();

    const encodedName = encodeURIComponent(cleanName);

    if (name.includes('amazon') || url.includes('amazon')) return `https://www.amazon.in/s?k=${encodedName}`;
    if (name.includes('flipkart') || url.includes('flipkart')) return `https://www.flipkart.com/search?q=${encodedName}`;
    if (name.includes('croma') || url.includes('croma')) return `https://www.croma.com/search/?text=${encodedName}`;
    if (name.includes('reliance') || url.includes('reliance')) return `https://www.reliancedigital.in/search?q=${encodedName}`;
    if (name.includes('vijay') || url.includes('vijay')) return `https://www.vijaysales.com/search/${encodedName}`;
    if (name.includes('tata') || url.includes('tata')) return `https://www.tatacliq.com/search/?searchCategory=all&text=${encodedName}`;
    if (name.includes('jiomart') || url.includes('jiomart')) return `https://www.jiomart.com/search/${encodedName}`;
    if (name.includes('myntra') || url.includes('myntra')) return `https://www.myntra.com/${encodedName}`;
    if (name.includes('ajio') || url.includes('ajio')) return `https://www.ajio.com/search/?text=${encodedName}`;
    
    // Quick Commerce Search Links
    if (name.includes('blinkit')) return `https://blinkit.com/s/?q=${encodedName}`;
    if (name.includes('zepto')) return `https://zeptonow.com/search?q=${encodedName}`;
    if (name.includes('bigbasket')) return `https://www.bigbasket.com/ps/?q=${encodedName}`;

    // Generic Google Search fallback
    return `https://www.google.com/search?q=${encodedName}+${seller.name}+price+india`;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
           <Tag className="w-4 h-4 text-primary" /> Price Comparison
        </h3>
        <span className="text-xs text-gray-400 bg-gray-800 border border-gray-600 px-2 py-1 rounded-md">Live India Prices</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">Store</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Offers</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedSellers.map((seller, idx) => (
              <tr key={idx} className={`hover:bg-gray-700/30 transition-colors group ${idx === 0 ? 'bg-green-900/5' : ''}`}>
                <td className="px-6 py-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    {seller.name || 'Unknown Store'}
                    {idx === 0 && <span className="text-[10px] uppercase font-bold bg-green-500 text-black px-2 py-0.5 rounded-full">Best Price</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-white font-bold text-lg">
                  {formatCurrency(seller.price, 'INR')}
                </td>
                <td className="px-6 py-4">
                  {seller.offers ? (
                    <div className="flex items-start gap-1.5 text-xs text-yellow-300 bg-yellow-400/10 p-2 rounded border border-yellow-400/20 max-w-[200px]">
                        <span>{seller.offers}</span>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {seller.inStock ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-green-500 text-xs font-medium">In Stock</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span className="text-red-500 text-xs font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <a 
                    href={getSellerLink(seller)}
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    View Deal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
            {sortedSellers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                  <Search className="w-8 h-8 text-gray-600" />
                  <p>No pricing data found. Try scanning again.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;