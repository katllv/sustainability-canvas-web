import { useAuth } from '@/lib/useAuth';
import { useUserProjectsFull } from '@/api/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyProjectsState } from '@/components/projects/EmptyProjectsState';

interface Collaborator {
  name: string;
  profileUrl: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  collaborators: Collaborator[];
}

export default function ProjectsPage() {
  const { profile } = useAuth();
  const { data: projects = [], isLoading: loading } = useUserProjectsFull(profile?.id || '');

  if (loading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-the-dark-blue mb-2'>My Projects</h1>
          <p className='text-gray-600'>Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-the-dark-blue mb-2'>My Projects</h1>
      </div>

      <div className='space-y-6'>
        {projects.map((project: Project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {projects.length === 0 && <EmptyProjectsState />}
    </div>
  );
}
