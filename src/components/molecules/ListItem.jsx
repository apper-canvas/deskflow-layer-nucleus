import React from 'react';
import Text from '@/components/atoms/Text';

const ListItem = ({ primaryText, secondaryText, icon, iconClassName, rightContent, className = '' }) => {
  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center space-x-3">
        {icon && (
          <div className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ${iconClassName}`}>
            {icon}
          </div>
        )}
        <div>
          <Text as="p" className="text-sm font-medium text-gray-900">
            {primaryText}
          </Text>
          {secondaryText && (
            <Text as="p" className="text-xs text-gray-500">
              {secondaryText}
            </Text>
          )}
        </div>
      </div>
      <div className="text-right">
        {rightContent}
      </div>
    </div>
  );
};

export default ListItem;