import { Route } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import AppLayout from '@/components/layout/AppLayout';

export const appLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
});
