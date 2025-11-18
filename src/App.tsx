import { Routes, Route, Outlet } from 'react-router';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ProjectsPage from '@/pages/ProjectsPage';
import CollaboratorsPage from './pages/CollaboratorsPage';
import AnalysisPage from '@/pages/AnalysisPage';
import TeamPage from '@/pages/TeamPage';
import { ProjectRedirect } from '@/components/routing/ProjectRedirect';
import CanvasPage from './pages/CanvasPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

function AppLayout() {
  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-the-light-grey'>
        <Header />
        <main className='h-[calc(100vh-6rem-3rem)] px-6 lg:px-20 py-6'>
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path='/signup'
        element={<SignUpPage />}
      />
      <Route
        path='/login'
        element={<LoginPage />}
      />

      {/* Protected layout */}
      <Route
        path='/'
        element={<AppLayout />}>
        <Route
          index
          element={<ProjectRedirect />}
        />
        <Route
          path='projects'
          element={<ProjectsPage />}
        />
        <Route
          path='project/:id/canvas'
          element={<CanvasPage />}
        />
        <Route
          path='project/:id/analysis'
          element={<AnalysisPage />}
        />
        <Route
          path='project/:id/team'
          element={<TeamPage />}
        />
        <Route
          path='collaborators'
          element={<CollaboratorsPage />}
        />
        {/* catch-all inside layout */}
        <Route
          path='*'
          element={<ProjectRedirect />}
        />
      </Route>
    </Routes>
  );
}

export default App;
