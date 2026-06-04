import React from 'react';

export default function SkeletonLoader({ rows = 3, height = '16px', className = '' }) {
  return (
    <div className={`space-y-3 w-full ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white/5 rounded-lg"
          style={{ height }}
        />
      ))}
    </div>
  );
}
