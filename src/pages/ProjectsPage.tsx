import { useAuth } from '@/lib/useAuth';
import { useUserProjectsFull } from '@/api/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyProjectsState } from '@/components/projects/EmptyProjectsState';
import { Spinner } from '@/components/ui/spinner';

interface Collaborator {
  profileId: number;
  name: string;
  email?: string;
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
        <div className='flex items-center gap-3 mb-6'>
          <Spinner size='lg' />
          <h2>Loading...</h2>
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
