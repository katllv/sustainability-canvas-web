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

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
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

export async function uploadProfilePicture(userId: string, imageData: string) {
    const res = await fetch(`${API_URL}/api/profiles/${userId}/picture`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ imageData }),
    });
    if (!res.ok) throw new Error('Failed to upload profile picture');
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
    if (res.status === 204) return { success: true };
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

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ userId, updates }: { userId: string | number; updates: Record<string, unknown> }) =>
            updateProfile(String(userId), updates),
        onSuccess: (data, variables) => {
            // Convert userId to string to match query key format
            const userIdStr = String(variables.userId);
            const oldData = queryClient.getQueryData(['profile', userIdStr]) || {};
            
            // Directly update the cache with the new data
            queryClient.setQueryData(['profile', userIdStr], {
                ...oldData,
                ...data,
            });
        },
    });
}

export function useUploadProfilePicture() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ userId, imageData }: { userId: string | number; imageData: string }) =>
            uploadProfilePicture(String(userId), imageData),
        onSuccess: (data, variables) => {
            // Convert userId to string to match query key format
            const userIdStr = String(variables.userId);
            // Directly update the cache with the new data
            queryClient.setQueryData(['profile', userIdStr], (old: Record<string, unknown> | undefined) => ({
                ...old,
                ...data,
            }));
        },
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
    onSuccess: (newCollaborator, variables) => {
      // Optimistically add the new collaborator to cache
      queryClient.setQueryData(
        ['projectCollaborators', variables.projectId],
        (old: unknown[] | undefined) => {
          if (!old) return [newCollaborator];
          return [...old, newCollaborator];
        }
      );
        queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
export function useRemoveCollaborator() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeCollaborator,
        onSuccess: (_data, collaboratorId) => {
            // Optimistically remove the collaborator from all project caches
            queryClient.setQueriesData<Array<{ id: number }>>(
                { queryKey: ['projectCollaborators'] },
                (old) => {
                    if (!old) return old;
                    return old.filter((collab) => String(collab.id) !== collaboratorId);
                }
            );
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}