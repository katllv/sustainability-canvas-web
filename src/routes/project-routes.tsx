import { Route, Outlet } from '@tanstack/react-router';

import ProjectsPage from '../pages/ProjectsPage';
import ProjectIdPage from '../pages/ProjectIdPage';
import CanvasPage from '../pages/CanvasPage';
import AnalysisPage from '../pages/AnalysisPage';
import CollaboratorsPage from '../pages/CollaboratorsPage';
import { appLayoutRoute } from './app-layout-route';

// /projects
export const projectsRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: 'projects',
  component: ProjectsPage,
});

// /projects/$projectId (parent layout)
export const projectRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: 'projects/$projectId',
  component: () => <Outlet />, // parent for nested pages
});

// /projects/:projectId   (index)
export const projectOverviewRoute = new Route({
  getParentRoute: () => projectRoute,
  path: '/', // index route
  component: ProjectIdPage,
});

// /projects/:projectId/canvas
export const projectCanvasRoute = new Route({
  getParentRoute: () => projectRoute,
  path: 'canvas',
  component: CanvasPage,
});

// /projects/:projectId/analysis
export const projectAnalysisRoute = new Route({
  getParentRoute: () => projectRoute,
  path: 'analysis',
  component: AnalysisPage,
});

// /projects/:projectId/collaborators
export const projectCollaboratorsRoute = new Route({
  getParentRoute: () => projectRoute,
  path: 'collaborators',
  component: CollaboratorsPage,
});
