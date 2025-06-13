import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import StatusTag from '@/components/atoms/StatusTag';
import Spinner from '@/components/atoms/Spinner';
const NotificationsDropdown = ({ notifications, loading, showNotifications, onToggle, onMarkAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'checkout': return 'LogOut';
      case 'checkin': return 'LogIn';
      case 'cleaning': return 'Sparkles';
      case 'payment': return 'CreditCard';
      case 'maintenance': return 'Wrench';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'bg-red-100 text-red-800';
    if (type === 'checkout') return 'bg-orange-100 text-orange-800';
    if (type === 'checkin') return 'bg-green-100 text-green-800';
    if (type === 'cleaning') return 'bg-blue-100 text-blue-800';
    if (type === 'payment') return 'bg-purple-100 text-purple-800';
    if (type === 'maintenance') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };
  return (
    <div className="relative">
<button
        onClick={onToggle}
        className="relative p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
      >
        <ApperIcon name="Bell" className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
{showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Text as="h3" className="text-sm font-medium text-gray-900">
                Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
              </Text>
              {unreadCount > 0 && (
                <button
                  onClick={() => notifications.filter(n => !n.read).forEach(n => onMarkAsRead(n.id))}
                  className="text-xs text-primary hover:text-primary-dark"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Spinner size="sm" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <ApperIcon name="Bell" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <Text className="text-sm text-gray-500">No notifications</Text>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                        <ApperIcon name={getNotificationIcon(notification.type)} className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Text className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </Text>
                          <div className="flex items-center space-x-2">
                            {notification.priority === 'high' && (
                              <StatusTag status="urgent" className="text-xs" />
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                        <Text className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {notification.time}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center text-sm text-primary hover:text-primary-dark">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;