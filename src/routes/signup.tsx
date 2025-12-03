import { createRoute } from '@tanstack/react-router';
import SignUpPage from '@/pages/SignUpPage';
import { publicLayoutRoute } from './public-layout-route';

export const signupRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: 'signup',
  component: SignUpPage,
});
