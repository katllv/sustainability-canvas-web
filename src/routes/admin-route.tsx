import { Route } from '@tanstack/react-router';
import { appLayoutRoute } from './app-layout-route';
import AdminDashboard from '@/pages/AdminDashboard';

export const adminRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/admin',
  component: AdminDashboard,
});
