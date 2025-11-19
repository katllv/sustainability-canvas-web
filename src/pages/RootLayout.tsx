import { Outlet } from '@tanstack/react-router';
import Header from '../components/layout/Header';

function Root() {
  return (
    <div className='min-h-screen flex flex-col bg-the-light-grey'>
      <Header />
      <div className='flex-1 px-6 lg:px-20 py-6'>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
