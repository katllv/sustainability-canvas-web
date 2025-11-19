import { Route, Outlet } from '@tanstack/react-router';
import { rootRoute } from './root-route';

export const publicLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: () => <Outlet />,
});
