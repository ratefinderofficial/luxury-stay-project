import React from 'react';

const Badge = ({ children, type = 'default' }) => {
  
  const styles = {
    default: "bg-gray-100 text-gray-800",
    
    // Status: Available / Paid / Completed
    success: "bg-green-100 text-green-800 border border-green-200",
    
    // Status: Cleaning / Pending
    warning: "bg-orange-100 text-orange-800 border border-orange-200",
    
    // Status: Occupied / Cancelled / Error
    danger: "bg-red-100 text-red-800 border border-red-200",
    
    // Status: Info / Checked In
    info: "bg-blue-100 text-blue-800 border border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.default}`}>
      {children}
    </span>
  );
};

export default Badge;