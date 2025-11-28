
import React from 'react';
import { ReviewSummary } from '../types';
import { ThumbsUp, ThumbsDown, Star, MessageSquareQuote } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  reviews?: ReviewSummary;
}

const ReviewAnalysis: React.FC<Props> = ({ reviews }) => {
  if (!reviews) return null;

  // Safe defaults
  const { 
    averageRating = 0, 
    totalReviews = '0', 
    summary = 'No summary available.',
    pros = [],
    cons = []
  } = reviews;
  
  // Mock data for the chart based on average rating
  const positive = (averageRating || 0) * 20; // convert 5 star to 100% roughly
  const negative = Math.max(0, 100 - positive);
  
  const chartData = [
    { name: 'Positive', value: positive },
    { name: 'Negative', value: negative },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary Card */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquareQuote className="text-primary" /> Review Summary
          </h3>
          <p className="text-gray-300 italic mb-6">"{summary}"</p>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
                {/* Circular Chart */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={45}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{averageRating}</span>
                </div>
            </div>
            <div>
                <div className="text-sm text-gray-400">Total Reviews</div>
                <div className="text-xl font-bold text-white">{totalReviews}</div>
                <div className="flex items-center gap-1 mt-1">
                     {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                        />
                     ))}
                </div>
            </div>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Insights</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
              <ThumbsUp className="w-4 h-4" /> Pros
            </div>
            {pros.length > 0 ? (
                <ul className="space-y-1">
                {pros.map((pro, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                    {pro}
                    </li>
                ))}
                </ul>
            ) : <p className="text-sm text-gray-500">No pros listed.</p>}
          </div>
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
              <ThumbsDown className="w-4 h-4" /> Cons
            </div>
            {cons.length > 0 ? (
                <ul className="space-y-1">
                {cons.map((con, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                    {con}
                    </li>
                ))}
                </ul>
            ) : <p className="text-sm text-gray-500">No cons listed.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
