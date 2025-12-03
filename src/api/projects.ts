// --- Projects API functions ---
const API_URL = import.meta.env.VITE_API_URL || '';
// Endpoints:
// - GetProjects:            [GET]    /api/projects
// - GetProjectsByProfileId: [GET]    /api/profiles/{profileId}/projects
// - GetUserProjects:        [GET]    /api/profiles/{profileId}/collaborations
// - GetUserProjectsFull:    [GET]    /api/profiles/{profileId}/projects-full
// - GetProjectById:         [GET]    /api/projects/{id}
// - CreateProject:          [POST]   /api/projects
// - UpdateProject:          [PUT]    /api/projects/{id}
// - DeleteProject:          [DELETE] /api/projects/{id}
//
// TanStack Query hooks:
// - useProjects, useProjectsByProfileId, useUserProjects, useUserProjectsFull, useProject, useCreateProject, useUpdateProject, useDeleteProject

const getToken = () => localStorage.getItem('jwt') || '';

export async function getProjects() {
	const res = await fetch(`${API_URL}/api/projects`, {
		headers: { Authorization: `Bearer ${getToken()}` },
	});
	if (!res.ok) throw new Error('Failed to fetch projects');
	return res.json();
}

export async function getProjectsByProfileId(profileId: string | number) {
	const id = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
	const res = await fetch(`${API_URL}/api/profiles/${id}/projects`, {
		headers: { Authorization: `Bearer ${getToken()}` },
	});
	if (!res.ok) throw new Error('Failed to fetch projects by profile');
	return res.json();
}

export async function getUserProjects(profileId: string | number) {
	const id = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
	const res = await fetch(`${API_URL}/api/profiles/${id}/collaborations`, {
		headers: { Authorization: `Bearer ${getToken()}` },
	});
	if (!res.ok) throw new Error('Failed to fetch user collaborations');
	return res.json();
}

export async function getUserProjectsFull(profileId: string | number) {
	const id = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
	const res = await fetch(`${API_URL}/api/profiles/${id}/projects-full`, {
		headers: { Authorization: `Bearer ${getToken()}` },
	});
	if (!res.ok) throw new Error('Failed to fetch user projects with collaborators');
	return res.json();
}

export async function getProject(projectId: string) {
	const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
		headers: { Authorization: `Bearer ${getToken()}` },
	});
	if (!res.ok) throw new Error('Failed to fetch project');
	return res.json();
}


export async function createProject(project: { profileId: number; title: string; description?: string }) {
	const res = await fetch(`${API_URL}/api/projects`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
		body: JSON.stringify(project),
	});
	if (!res.ok) throw new Error('Failed to create project');
	return res.json();
}

export async function updateProject(id: string, updates: { title?: string; description?: string }) {
	const res = await fetch(`${API_URL}/api/projects/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
		body: JSON.stringify(updates),
	});
	if (!res.ok) throw new Error('Failed to update project');
	return res.json();
}

export async function deleteProject(id: string) {
	const res = await fetch(`${API_URL}/api/projects/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${getToken()}` },
	});
	if (!res.ok) throw new Error('Failed to delete project');
	return res.json();
}

// --- TanStack Query hooks ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProjects() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: getProjects,
	});
}

export function useProjectsByProfileId(profileId: string | number) {
	return useQuery({
		queryKey: ['projectsByProfile', profileId],
		queryFn: () => getProjectsByProfileId(profileId),
		enabled: !!profileId,	
	});
}

export function useCollaboratorProjects(profileId: string | number) {
	return useQuery({
		queryKey: ['collaboratorProjects', profileId],
		queryFn: () => getUserProjects(profileId),
		enabled: !!profileId,
	});
}

export function useUserProjectsFull(profileId: string | number) {
	return useQuery({
		queryKey: ['projects', profileId],
		queryFn: () => getUserProjectsFull(profileId),
		enabled: !!profileId,
	});
}

export function useProject(projectId: string) {
	return useQuery({
		queryKey: ['project', projectId],
		queryFn: () => getProject(projectId),
		enabled: !!projectId,
	});
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: { title?: string; description?: string } }) => updateProject(id, updates),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
}

