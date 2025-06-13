import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/organisms/AppHeader';
import { routeArray } from '@/config/routes';

const Layout = () => {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

// The actual notifications data will be passed to NotificationsDropdown
  // For simplicity, we are passing it as a prop to AppHeader now.
  // In a real app, this might come from a global state or context.
  const notifications = [
    { id: 1, type: 'info', message: 'Room 205 checkout completed', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Housekeeping needed for floor 3', time: '15 min ago' },
    { id: 3, type: 'success', message: 'VIP guest arrived early', time: '30 min ago' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Navigation */}
<AppHeader
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-full overflow-hidden">
          <Outlet />
        </div>
      </main>

      {/* Click outside to close dropdowns */}
{/* Click outside to close dropdowns handled within AppHeader */}
    </div>
  );
};

export default Layout;