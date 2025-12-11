import { Outlet, useLocation } from '@tanstack/react-router';
import Header from '../components/layout/Header';

function Root() {
  const location = useLocation();
  const isCanvasPage = location.pathname.includes('/canvas');

  return (
    <div
      className={`${isCanvasPage ? 'h-screen' : 'min-h-screen'} flex flex-col bg-the-light-grey print:bg-white`}>
      <Header />
      <div className={`flex-1 px-6 lg:px-20 py-6 print:p-0 ${isCanvasPage ? 'min-h-0' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
