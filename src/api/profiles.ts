// --- Profiles & Collaborators API functions ---
const API_URL = import.meta.env.VITE_API_URL || '';
// Endpoints:
// - GetProfileById:         [GET]    /api/profiles/{id}
// - UpdateProfile:          [PUT]    /api/profiles/{id}
// - GetProjectCollaborators:[GET]    /api/projects/{projectId}/collaborators
// - AddProjectCollaborator: [POST]   /api/projects/{projectId}/collaborators
// - UpdateCollaboratorRole: [PUT]    /api/collaborators/{collaboratorId}
// - RemoveCollaborator:     [DELETE] /api/collaborators/{collaboratorId}
//
// TanStack Query hooks:
// - useProfile, useUpdateProfile, useProjectCollaborators, useAddCollaborator, useUpdateCollaboratorRole, useRemoveCollaborator

const getToken = () => localStorage.getItem('jwt') || '';

export async function getProfile(userId: string) {
    const res = await fetch(`${API_URL}/api/profiles/${userId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

export async function updateProfile(userId: string, updates: { name?: string; picture_url?: string }) {
    const res = await fetch(`${API_URL}/api/profiles/${userId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
}

export async function getProjectCollaborators(projectId: string) {
    const res = await fetch(`${API_URL}/api/projects/${projectId}/collaborators`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch collaborators');
    return res.json();
}

export async function addCollaborator(projectId: string, email: string) {
    const res = await fetch(`${API_URL}/api/projects/${projectId}/collaborators`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to add collaborator');
    return res.json();
}

export async function removeCollaborator(collaboratorId: string) {
    const res = await fetch(`${API_URL}/api/collaborators/${collaboratorId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) throw new Error('Failed to remove collaborator');
    return res.json();
}

// --- TanStack Query hooks ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProfile(userId: string) {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => getProfile(userId),
        enabled: !!userId,
    });
}

export function useProjectCollaborators(projectId: string) {
    return useQuery({
        queryKey: ['projectCollaborators', projectId],
        queryFn: () => getProjectCollaborators(projectId),
        enabled: !!projectId,
    });
}

export function useAddCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, email }: { projectId: string; email: string }) =>
      addCollaborator(projectId, email),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projectCollaborators', variables.projectId],
      });
    },
  });
}
export function useRemoveCollaborator() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeCollaborator,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projectCollaborators'] });
        },
    });
}