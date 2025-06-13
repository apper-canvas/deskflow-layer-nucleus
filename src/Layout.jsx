import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, type: 'info', message: 'Room 205 checkout completed', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Housekeeping needed for floor 3', time: '15 min ago' },
    { id: 3, type: 'success', message: 'VIP guest arrived early', time: '30 min ago' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <ApperIcon name="Building" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-semibold text-gray-900">DeskFlow Pro</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Hotel Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {routeArray.filter(route => route.id !== 'home').map(route => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                <ApperIcon name={route.icon} className="w-4 h-4" />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  3
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
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'info' ? 'bg-info' :
                              notification.type === 'warning' ? 'bg-warning' :
                              'bg-success'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">JD</span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
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
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">Front Desk Manager</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <ApperIcon name="User" className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <ApperIcon name="Settings" className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-50 flex items-center space-x-2">
                        <ApperIcon name="LogOut" className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      }
                    `}
                  >
                    <ApperIcon name={route.icon} className="w-4 h-4" />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-full overflow-hidden">
          <Outlet />
        </div>
      </main>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;