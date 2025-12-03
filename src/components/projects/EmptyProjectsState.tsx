import { Calendar } from 'lucide-react';

export function EmptyProjectsState() {
  return (
    <div className='flex flex-col items-center justify-center flex-1 text-center mt-8'>
      <div className='text-gray-400 mb-4'>
        <Calendar className='w-16 h-16 mx-auto mb-4' />
        <h3 className='text-xl font-semibold text-gray-600 mb-2'>No projects yet</h3>
        <p className='text-gray-500'>
          Create your first sustainability canvas project to get started.
        </p>
      </div>
    </div>
  );
}
