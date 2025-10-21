import { Routes, Route } from 'react-router';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ProjectsPage from '@/pages/ProjectsPage';
import CollaboratorsPage from './pages/CollaboratorsPage';
import AnalysisPage from '@/pages/AnalysisPage';
import TeamPage from '@/pages/TeamPage';
import { ProjectRedirect } from '@/components/routing/ProjectRedirect';
import CanvasPage from './pages/CanvasPage';

function App() {
  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-the-light-grey'>
        <Header />
        <main className='h-[calc(100vh-6rem-3rem)] px-6 lg:px-20 py-6'>
          <Routes>
            <Route
              path='/'
              element={<ProjectRedirect />}
            />
            <Route
              path='/projects'
              element={<ProjectsPage />}
            />
            <Route
              path='/project/:id/canvas'
              element={<CanvasPage />}
            />
            <Route
              path='/project/:id/analysis'
              element={<AnalysisPage />}
            />
            <Route
              path='/project/:id/team'
              element={<TeamPage />}
            />
            <Route
              path='/collaborators'
              element={<CollaboratorsPage />}
            />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default App;
