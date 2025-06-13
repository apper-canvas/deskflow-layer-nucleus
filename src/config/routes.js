import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Reservations from '../pages/Reservations';
import Rooms from '../pages/Rooms';
import Guests from '../pages/Guests';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  reservations: {
    id: 'reservations',
    label: 'Reservations',
    path: '/reservations',
    icon: 'Calendar',
    component: Reservations
  },
  rooms: {
    id: 'rooms',
    label: 'Rooms',
    path: '/rooms',
    icon: 'Bed',
    component: Rooms
  },
  guests: {
    id: 'guests',
    label: 'Guests',
    path: '/guests',
    icon: 'Users',
    component: Guests
  }
};

export const routeArray = Object.values(routes);