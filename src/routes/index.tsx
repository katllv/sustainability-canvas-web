// routes/index.tsx
import { Router } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { indexRoute } from './index-route';
import {
  projectsRoute,
  projectCanvasRoute,
  projectCollaboratorsRoute,
  projectOverviewRoute,
  projectRoute,
  projectAnalysisRoute,
} from './project-routes';
import { loginRoute } from './login';
import { signupRoute } from './signup';
import { appLayoutRoute } from './app-layout-route';
import { publicLayoutRoute } from './public-layout-route';

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([loginRoute, signupRoute]),
  appLayoutRoute.addChildren([
    indexRoute,
    projectsRoute, // this is /projects
    projectRoute.addChildren([
      // this is /projects/$projectId
      projectOverviewRoute, // index route
      projectCanvasRoute, //projects/$projectId/canvas
      projectAnalysisRoute, //projects/$projectId/analysis
      projectCollaboratorsRoute, //projects/$projectId/collaborators
    ]),
  ]),
]);

export const router = new Router({ routeTree });
