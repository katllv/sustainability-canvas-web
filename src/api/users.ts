// --- User API functions ---
const API_URL = import.meta.env.VITE_API_URL;
// Endpoints:
// - CreateAdmin: [POST] /api/users/admin/create
// - DeleteUser: [DELETE] /api/users/admin/{userId}
// - GetAllUsers: [GET] /api/users/admin/all

const token = localStorage.getItem('jwt') || '';

export async function createAdmin(user: { email: string; password: string }) {
	const res = await fetch(`${API_URL}/users/admin/create`, {
		method: 'POST',
		body: JSON.stringify(user),
	});
	if (!res.ok) throw new Error('Failed to create admin');
	return res.json();
}

export async function deleteUser(userId: string) {
	const res = await fetch(`${API_URL}/users/admin/${userId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error('Failed to delete user');
	return res.json();
}

export async function getAllUsers() {
	const res = await fetch(`${API_URL}/users/admin/all`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error('Failed to fetch users');
	return res.json();
}

// --- TanStack Query hooks ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAllUsers() {
	return useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
	});
}

export function useCreateAdmin() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
}
