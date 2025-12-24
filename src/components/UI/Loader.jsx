import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
    </div>
  );
};

export default Loader;