import { Route } from '@tanstack/react-router';
import { publicLayoutRoute } from './public-layout-route';
import CreateAdminPage from '@/pages/CreateAdminPage';

export const createAdminRoute = new Route({
  getParentRoute: () => publicLayoutRoute,
  path: '/create-admin',
  component: CreateAdminPage,
});
