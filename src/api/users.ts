// --- User API functions ---
const API_URL = import.meta.env.VITE_API_URL || '';
// Endpoints:
// - CreateAdmin: [POST] /api/users/admin/create
// - DeleteUser: [DELETE] /api/users/admin/{userId}
// - GetAllUsers: [GET] /api/users/admin/all
// - UpdateEmail: [PUT] /api/users/email
// - GetRegistrationCode: [GET] /api/management/registration-code
// - SetRegistrationCode: [POST] /api/management/registration-code

const getToken = () => localStorage.getItem('jwt') || '';

export async function createAdmin(user: { name: string; email: string; password: string; masterpassword: string }) {
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
	// 204 No Content doesn't have a response body
	if (res.status === 204) return;
	return res.json();
}

export async function deleteAllNonAdmin() {
	const res = await fetch(`${API_URL}/api/users/admin/delete-all-non-admin`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (!res.ok) throw new Error('Failed to delete all non-admin users');
	// 204 No Content doesn't have a response body
	if (res.status === 204) return;
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

export async function getRegistrationCode() {
	const res = await fetch(`${API_URL}/api/management/registration-code`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (!res.ok) throw new Error('Failed to fetch registration code');
	return res.json();
}

export async function setRegistrationCode(code: string) {
	const res = await fetch(`${API_URL}/api/management/registration-code`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify({ code }),
	});
	if (!res.ok) throw new Error('Failed to set registration code');
	return res.json();
}

export async function getMasterPassword() {
	const res = await fetch(`${API_URL}/api/management/master-password`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (!res.ok) throw new Error('Failed to fetch master password');
	return res.json();
}

export async function setMasterPassword(password: string) {
	const res = await fetch(`${API_URL}/api/management/master-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify({ NewMasterPassword: password }),
	});
	if (!res.ok) throw new Error('Failed to set master password');
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

export function useUpdateEmail() {
	return useMutation({
		mutationFn: updateEmail,
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteUser,
		onSuccess: (_, deletedUserId) => {
			// Directly update the cache instead of refetching
			queryClient.setQueryData(['users'], (oldData: Array<{ id: string }> | undefined) => {
				if (!oldData) return oldData;
				return oldData.filter((user) => user.id !== deletedUserId);
			});
		},
	});
}

export function useDeleteAllNonAdmin() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteAllNonAdmin,
		onSuccess: () => {
			// Invalidate and refetch the users list
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
}

export function useRegistrationCode() {
	return useQuery({
		queryKey: ['registrationCode'],
		queryFn: getRegistrationCode,
	});
}

export function useSetRegistrationCode() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: setRegistrationCode,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['registrationCode'] });
		},
	});
}

export function useMasterPassword() {
	return useQuery({
		queryKey: ['masterPassword'],
		queryFn: getMasterPassword,
	});
}

export function useSetMasterPassword() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: setMasterPassword,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['masterPassword'] });
		},
	});
}