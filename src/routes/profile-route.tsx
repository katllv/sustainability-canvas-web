import { Route } from '@tanstack/react-router';
import ProfilePage from '../pages/ProfilePage';
import { appLayoutRoute } from './app-layout-route';

// /profile
export const profileRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: 'profile',
  component: ProfilePage,
});
