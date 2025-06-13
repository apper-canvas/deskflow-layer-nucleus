import React from 'react';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, children, className = '' }) => {
  return (
    <div className={className}>
      <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </Text>
      {children}
    </div>
  );
};

export default FormField;