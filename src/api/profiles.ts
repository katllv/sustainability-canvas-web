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
    const data = await res.json();
    console.log('Profile data from API:', data);
    // Map backend PascalCase to frontend snake_case
    return {
        ...data,
        picture_url: data.ProfileUrl || data.profileUrl || data.picture_url,
        name: data.Name || data.name,
        email: data.Email || data.email,
        jobTitle: data.JobTitle || data.jobTitle,
        department: data.Department || data.department,
        organization: data.Organization || data.organization,
        location: data.Location || data.location,
    };
}

export async function updateProfile(userId: string, updates: { name?: string; picture_url?: string; jobTitle?: string; department?: string; organization?: string; location?: string }) {
    // Map frontend format to backend camelCase (what backend expects with JsonNamingPolicy.CamelCase)
    const backendUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) backendUpdates.name = updates.name;
    if (updates.picture_url !== undefined) backendUpdates.profileUrl = updates.picture_url;
    if (updates.jobTitle !== undefined) backendUpdates.jobTitle = updates.jobTitle;
    if (updates.department !== undefined) backendUpdates.department = updates.department;
    if (updates.organization !== undefined) backendUpdates.organization = updates.organization;
    if (updates.location !== undefined) backendUpdates.location = updates.location;
    
    console.log('Sending profile updates:', JSON.stringify(backendUpdates, null, 2));
    
    const res = await fetch(`${API_URL}/api/profiles/${userId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(backendUpdates),
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('Update profile failed:', errorText);
        throw new Error('Failed to update profile');
    }
    const data = await res.json();
    console.log('Updated profile response:', data);
    return data;
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
    return res.json();
}

// --- TanStack Query hooks ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

export function useProfile(userId: string) {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => getProfile(userId),
        enabled: !!userId,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { refetchProfile } = useAuth();
    
    return useMutation({
        mutationFn: ({ userId, updates }: { userId: string; updates: { name?: string; picture_url?: string; jobTitle?: string; department?: string; organization?: string; location?: string } }) =>
            updateProfile(userId, updates),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
            // Also update auth context so header updates
            refetchProfile();
        },
    });
}

export function useUploadProfilePicture() {
    const queryClient = useQueryClient();
    const { refetchProfile } = useAuth();
    
    return useMutation({
        mutationFn: ({ userId, imageData }: { userId: string; imageData: string }) =>
            uploadProfilePicture(userId, imageData),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
            // Also update auth context so header and profile page update
            refetchProfile();
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