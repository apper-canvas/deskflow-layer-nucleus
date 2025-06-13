import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ProfileDropdown = ({ userName, userRole, showProfile, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
      >
        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
          <Text as="span" className="text-xs font-medium text-white">{userName.slice(0, 2).toUpperCase()}</Text>
        </div>
        <Text as="span" className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</Text>
        <ApperIcon name="ChevronDown" className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <Text as="p" className="text-sm font-medium text-gray-900">{userName}</Text>
              <Text as="p" className="text-xs text-gray-500">{userRole}</Text>
            </div>
            <div className="py-2">
              <Button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 bg-transparent hover:bg-gray-50">
                <ApperIcon name="User" className="w-4 h-4" />
                <span>Profile</span>
              </Button>
              <Button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 bg-transparent hover:bg-gray-50">
                <ApperIcon name="Settings" className="w-4 h-4" />
                <span>Settings</span>
              </Button>
              <Button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-50 flex items-center space-x-2 bg-transparent hover:bg-gray-50">
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;