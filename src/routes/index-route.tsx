import { Route } from '@tanstack/react-router';
import { appLayoutRoute } from './app-layout-route';
import ProjectsPage from '../pages/ProjectsPage';

export const indexRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/', // "/"
  component: ProjectsPage,
});
