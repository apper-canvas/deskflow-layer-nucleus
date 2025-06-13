import React from 'react';

const Select = ({ value, onChange, className = '', children, id, required, ...props }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      required={required}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;