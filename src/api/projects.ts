// --- Projects API functions ---
const API_URL = import.meta.env.VITE_API_URL;
// Endpoints:
// - GetProjects:            [GET]    /api/projects
// - GetProjectsByProfileId: [GET]    /api/profiles/{profileId}/projects
// - GetUserProjects:        [GET]    /api/profiles/{profileId}/collaborations
// - GetProjectById:         [GET]    /api/projects/{id}
// - CreateProject:          [POST]   /api/projects
// - UpdateProject:          [PUT]    /api/projects/{id}
// - DeleteProject:          [DELETE] /api/projects/{id}
//
// TanStack Query hooks:
// - useProjects, useProjectsByProfileId, useUserProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject

const token = localStorage.getItem('jwt') || '';

export async function getProjects() {
	const res = await fetch(`${API_URL}/projects`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error('Failed to fetch projects');
	return res.json();
}

export async function getProjectsByProfileId(profileId: string) {
	const res = await fetch(`${API_URL}/profiles/${profileId}/projects`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error('Failed to fetch projects by profile');
	return res.json();
}

export async function getUserProjects(profileId: string) {
	const res = await fetch(`${API_URL}/profiles/${profileId}/collaborations`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error('Failed to fetch user collaborations');
	return res.json();
}

export async function getProject(projectId: string) {
	const res = await fetch(`${API_URL}/projects/${projectId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error('Failed to fetch project');
	return res.json();
}


export async function createProject(project: { userId: string; title: string; description?: string }) {
	const res = await fetch(`${API_URL}/projects`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify(project),
	});
	if (!res.ok) throw new Error('Failed to create project');
	return res.json();
}

export async function updateProject(id: string, updates: { title?: string; description?: string }) {
	const res = await fetch(`${API_URL}/projects/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify(updates),
	});
	if (!res.ok) throw new Error('Failed to update project');
	return res.json();
}

export async function deleteProject(id: string) {
	const res = await fetch(`${API_URL}/projects/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
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

export function useProjectsByProfileId(profileId: string) {
	return useQuery({
		queryKey: ['projectsByProfile', profileId],
		queryFn: () => getProjectsByProfileId(profileId),
		enabled: !!profileId,
	});
}

export function useUserProjects(profileId: string) {
	return useQuery({
		queryKey: ['userProjects', profileId],
		queryFn: () => getUserProjects(profileId),
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

