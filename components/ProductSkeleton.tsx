import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 aspect-square bg-gray-800 rounded-2xl"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
          <div className="h-20 bg-gray-800 rounded w-full"></div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-gray-800 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 h-64 rounded-xl"></div>
        <div className="bg-gray-800 h-64 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
