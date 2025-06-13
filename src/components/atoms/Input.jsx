import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', id, required, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      required={required}
      {...props}
    />
  );
};

export default Input;