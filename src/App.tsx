import { Routes, Route } from 'react-router';
import { Navigation } from '@/components/Navigation';
import HomePage from '@/pages/HomePage';
import CanvasPage from '@/pages/CanvasPage';
import ProjectsPage from '@/pages/ProjectsPage';

function App() {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/canvas'
          element={<CanvasPage />}
        />
        <Route
          path='/projects'
          element={<ProjectsPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
