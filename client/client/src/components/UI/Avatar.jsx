import React from 'react';

const Avatar = ({ src, alt, size = 'md', name }) => {
  
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  // Helper to get initials (e.g., "Adnan Khan" -> "AK")
  const getInitials = (n) => {
    if (!n) return '?';
    return n.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block rounded-full overflow-hidden border border-gray-200 bg-gray-100 ${sizes[size]}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt || name} 
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-primary text-white font-bold">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;