import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * @param {string} title - Page ka main title (e.g. "Room Management")
 * @param {string} subtitle - Choti description (Optional)
 * @param {ReactNode} action - Right side button (e.g. "+ Add Room")
 * @param {Array} breadcrumbs - Path (e.g. ['Home', 'Rooms'])
 */
const PageHeader = ({ title, subtitle, action, breadcrumbs }) => {
  return (
    <div className="mb-8">
      {/* Breadcrumbs (Optional Navigation Path) */}
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className="hover:text-primary cursor-pointer">{crumb}</span>
              {index < breadcrumbs.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Action Button (Right Side) */}
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;