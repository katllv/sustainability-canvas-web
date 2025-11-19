import { createRoute } from '@tanstack/react-router';
import LoginPage from '@/pages/LoginPage';
import { publicLayoutRoute } from './public-layout-route';

export const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: 'login',
  component: LoginPage,
});
