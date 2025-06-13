import React from 'react';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const AppNavLink = ({ to, label, iconName, onClick, className = '' }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
        ${isActive 
          ? 'bg-primary text-white shadow-sm' 
          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <ApperIcon name={iconName} className="w-4 h-4" />
      <span>{label}</span>
    </NavLink>
  );
};

export default AppNavLink;