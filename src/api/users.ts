// --- User API functions ---
const API_URL = import.meta.env.VITE_API_URL || '';
// Endpoints:
// - CreateAdmin: [POST] /api/users/admin/create
// - DeleteUser: [DELETE] /api/users/admin/{userId}
// - GetAllUsers: [GET] /api/users/admin/all
// - UpdateEmail: [PUT] /api/users/email

const getToken = () => localStorage.getItem('jwt') || '';

export async function createAdmin(user: { email: string; password: string }) {
	const res = await fetch(`${API_URL}/api/users/admin/create`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(user),
	});
	if (!res.ok) throw new Error('Failed to create admin');
	return res.json();
}

export async function deleteUser(userId: string) {
	const res = await fetch(`${API_URL}/api/users/admin/${userId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (!res.ok) throw new Error('Failed to delete user');
	return res.json();
}

export async function getAllUsers() {
	const res = await fetch(`${API_URL}/api/users/admin/all`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (!res.ok) throw new Error('Failed to fetch users');
	return res.json();
}

export async function updateEmail(email: string) {
	const res = await fetch(`${API_URL}/api/users/email`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify({ email }),
	});
	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText || 'Failed to update email');
	}
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
