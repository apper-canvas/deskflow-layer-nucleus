import React from 'react';

const Spinner = ({ className = 'w-6 h-6 border-2 border-current border-t-transparent', color = 'text-primary' }) => {
  return (
    <div className={`animate-spin rounded-full ${className} ${color}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;