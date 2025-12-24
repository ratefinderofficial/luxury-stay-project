import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 
            disabled:bg-gray-100 disabled:text-gray-500 transition-colors
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 animate-pulse">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;