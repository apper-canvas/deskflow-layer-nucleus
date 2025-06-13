import React from 'react';

const Button = ({ children, className = '', onClick, type = 'button', ...props }) => {
  // Filter out non-HTML attributes that might be passed accidentally
  const filteredProps = { ...props };
  delete filteredProps.variant; // Example of a custom prop that might be added later
  delete filteredProps.size;    // Example of a custom prop that might be added later

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-colors ${className}`}
      {...filteredProps}
    >
      {children}
    </button>
  );
};

export default Button;