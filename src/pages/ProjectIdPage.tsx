import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Users } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { getProjectsByProfileId } from '@/api/projects';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  project_collaborators: Array<{ role: string }>;
  impacts: Array<{ count?: number }>;
}

export default function ProjectsPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      if (!profile) return;

      try {
        const { data, error } = await getProjectsByProfileId(profile.id);
        if (data && !error) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [profile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

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
        <p className='text-gray-600'>Manage your sustainability canvas projects</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects.map((project) => (
          <Link
            key={project.id}
            to='/projects/$projectId/canvas'
            params={{ projectId: project.id }}>
            <Card className='h-full cursor-pointer border hover:border-the-dark-blue'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg text-the-dark-blue'>{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 mb-4 text-sm'>
                  {project.description || 'No description provided'}
                </p>

                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    <span>Updated {formatDate(project.updated_at)}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Users className='w-3 h-3' />
                    <span>{project.project_collaborators.length} members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className='flex flex-col items-center justify-center flex-1 text-center'>
          <div className='text-gray-400 mb-4'>
            <Calendar className='w-16 h-16 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-600 mb-2'>No projects yet</h3>
            <p className='text-gray-500'>
              Create your first sustainability canvas project to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
