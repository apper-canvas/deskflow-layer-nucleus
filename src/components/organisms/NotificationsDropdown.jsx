import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import ListItem from '@/components/molecules/ListItem';

const NotificationsDropdown = ({ notifications, showNotifications, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
      >
        <ApperIcon name="Bell" className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
          {notifications.length}
        </span>
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <Text as="h3" className="text-sm font-medium text-gray-900">Notifications</Text>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map(notification => (
                <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <ListItem
                    icon={<div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'info' ? 'bg-info' :
                      notification.type === 'warning' ? 'bg-warning' :
                      'bg-success'
                    }`} />}
                    iconClassName="bg-transparent" // IconContainer is already styled, just pass raw div
                    primaryText={notification.message}
                    secondaryText={notification.time}
                    rightContent={null}
                    className="!p-0" // Remove default padding for ListItem
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;