import { Link } from '@tanstack/react-router';
import { Calendar, Users, Clock } from 'lucide-react';

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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const collaborators = project.collaborators ?? [];

  const formatPrettyDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCollaboratorName = (c: Collaborator): string => {
    return c.name || 'Team member';
  };

  const getCollaboratorInitials = (nameOrEmail: string): string => {
    const base = nameOrEmail.split('@')[0];
    const parts = base.split(/[.\-_ ]/).filter(Boolean);
    if (!parts.length) return base.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const getCollaboratorSummary = () => {
    if (!collaborators.length) return 'No team members yet';

    const names = collaborators.map(getCollaboratorName);
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]}, ${names[1]}`;
    return `${names[0]}, ${names[1]} and ${names.length - 2} more`;
  };

  const firstFew = collaborators.slice(0, 4);

  return (
    <div className='overflow-hidden border border-the-light-gray rounded-lg'>
      {/* blue header */}
      <div className='bg-the-yellow px-6 py-4 flex items-center justify-between rounded-t-lg'>
        <div className='text-lg font-semibold text-the-dark-blue'>{project.title}</div>
        <Link
          to='/projects/$projectId/canvas'
          params={{ projectId: project.id }}
          className='inline-flex items-center gap-2 rounded-lg bg-the-dark-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90'>
          Open Canvas
          <span aria-hidden>➜</span>
        </Link>
      </div>

      {/* white body */}
      <div className='px-6 py-4 bg-white rounded-b-lg'>
        <div className='grid md:grid-cols-3 gap-4 md:flex-row items-center justify-center'>
          {/* team members */}
          <div className='flex-1'>
            <div className='flex items-center gap-2 text-xs text-gray-500'>
              <Users className='w-4 h-4' />
              <span>Team Members</span>
            </div>

            <div className='mt-3 flex flex-wrap items-center gap-2'>
              {firstFew.map((c: Collaborator, idx: number) => {
                const name = getCollaboratorName(c);
                const initials = getCollaboratorInitials(name);
                return (
                  <div
                    key={idx}
                    className='flex h-8 w-8 items-center justify-center rounded-full bg-[#E2EBFF] text-xs font-semibold text-[#3451A4]'>
                    {initials}
                  </div>
                );
              })}
            </div>

            <p className='mt-2 text-xs text-gray-500'>{getCollaboratorSummary()}</p>
          </div>

          {/* created / last edited */}
          <div className='flex flex-row gap-10 text-xs text-gray-500 md:items-center'>
            <div>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span>Created</span>
              </div>
              <div className='mt-1 text-sm font-medium text-the-dark-blue'>
                {formatPrettyDate(project.createdAt)}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-10 text-xs text-gray-500 md:items-center'>
            <div>
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span>Last Updated</span>
              </div>
              <div className='mt-1 text-sm font-medium text-the-dark-blue'>
                {formatPrettyDate(project.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
