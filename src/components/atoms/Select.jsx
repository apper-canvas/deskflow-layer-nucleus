import React from 'react';

const Select = ({ value, onChange, className = '', children, id, required, multiple, ...props }) => {
  const handleChange = (e) => {
    if (multiple) {
      // For multi-select, extract selected values into an array
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedValues = selectedOptions.map(option => option.value).filter(val => val !== '');
      onChange(selectedValues);
    } else {
      // For single select, pass the event as expected
      onChange(e);
    }
  };

  return (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      multiple={multiple}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      required={required}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;