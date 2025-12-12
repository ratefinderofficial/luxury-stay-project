import React from 'react';

// Main Table Container
export const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        {children}
      </table>
    </div>
  );
};

// Header Row
export const TableHead = ({ children }) => (
  <thead className="bg-gray-50">
    <tr>{children}</tr>
  </thead>
);

// Header Cell
export const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

// Body
export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200 bg-white">
    {children}
  </tbody>
);

// Row
export const TableRow = ({ children, onClick }) => (
  <tr 
    onClick={onClick} 
    className={`transition-colors hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </tr>
);

// Data Cell
export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

export default Table;