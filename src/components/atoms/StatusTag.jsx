import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatusTag = ({ status, className = '', showIcon = true }) => {
  const getStatusColor = (s) => {
    switch (s) {
      case 'available': return 'bg-success text-white';
      case 'occupied': return 'bg-error text-white';
      case 'cleaning': return 'bg-warning text-white';
      case 'maintenance': return 'bg-gray-500 text-white';
      case 'confirmed': return 'bg-success text-white';
      case 'checked-in': return 'bg-primary text-white';
      case 'checked-out': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-error text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (s) => {
    switch (s) {
      case 'available': return 'CheckCircle';
      case 'occupied': return 'User';
      case 'cleaning': return 'Sparkles';
      case 'maintenance': return 'Wrench';
      case 'confirmed': return 'CheckCircle';
      case 'checked-in': return 'User';
      case 'checked-out': return 'UserCheck';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)} ${className}`}>
      {showIcon && <ApperIcon name={getStatusIcon(status)} className="w-3 h-3" />}
      <span>{status.replace('-', ' ')}</span>
    </span>
  );
};

export default StatusTag;