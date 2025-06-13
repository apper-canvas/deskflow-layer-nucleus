import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import ReservationsPage from '@/components/pages/ReservationsPage';
import RoomsPage from '@/components/pages/RoomsPage';
import GuestsPage from '@/components/pages/GuestsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  reservations: {
    id: 'reservations',
    label: 'Reservations',
    path: '/reservations',
    icon: 'Calendar',
component: ReservationsPage
  },
  rooms: {
    id: 'rooms',
    label: 'Rooms',
    path: '/rooms',
    icon: 'Bed',
component: RoomsPage
  },
  guests: {
    id: 'guests',
    label: 'Guests',
    path: '/guests',
    icon: 'Users',
component: GuestsPage
  }
};

export const routeArray = Object.values(routes);