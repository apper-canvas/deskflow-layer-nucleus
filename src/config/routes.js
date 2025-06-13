import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import ReservationsPage from '@/components/pages/ReservationsPage';
import RoomsPage from '@/components/pages/RoomsPage';
import GuestsPage from '@/components/pages/GuestsPage';
import ProfilePage from '@/components/pages/ProfilePage';
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
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: ProfilePage
  }
};

export const routeArray = Object.values(routes);