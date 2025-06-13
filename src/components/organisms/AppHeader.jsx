import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import AppNavLink from '@/components/molecules/AppNavLink';
import NotificationsDropdown from '@/components/organisms/NotificationsDropdown';
import ProfileDropdown from '@/components/organisms/ProfileDropdown';
import { routeArray } from '@/config/routes';
import { notificationService } from '@/services';

const AppHeader = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getAll();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationToggle = () => {
    setShowNotifications(prev => !prev);
    setShowProfile(false); // Close other dropdowns
  };

  const handleProfileToggle = () => {
    setShowProfile(prev => !prev);
    setShowNotifications(false); // Close other dropdowns
  };

  const handleCloseDropdowns = () => {
    setShowNotifications(false);
    setShowProfile(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <ApperIcon name="Building" className="w-5 h-5 text-white" />
            </div>
            <div>
              <Text as="h1" className="text-lg font-heading font-semibold text-gray-900">DeskFlow Pro</Text>
              <Text as="p" className="text-xs text-gray-500 hidden sm:block">Hotel Management</Text>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {routeArray.filter(route => route.id !== 'home').map(route => (
            <AppNavLink
              key={route.id}
              to={route.path}
              label={route.label}
              iconName={route.icon}
            />
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
<NotificationsDropdown
            notifications={notifications}
            loading={loading}
            showNotifications={showNotifications}
            onToggle={handleNotificationToggle}
            onMarkAsRead={handleMarkAsRead}
          />

          {/* Profile Menu */}
          <ProfileDropdown
            userName="John Doe"
            userRole="Front Desk Manager"
            showProfile={showProfile}
            onToggle={handleProfileToggle}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <nav className="px-4 py-2 space-y-1">
              {routeArray.filter(route => route.id !== 'home').map(route => (
                <AppNavLink
                  key={route.id}
                  to={route.path}
                  label={route.label}
                  iconName={route.icon}
                  onClick={() => onMobileMenuToggle(false)} // Close menu on nav click
                  className="!px-3" // Override default padding for mobile
                />
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-30"
          onClick={handleCloseDropdowns}
        />
      )}
    </header>
  );
};

export default AppHeader;