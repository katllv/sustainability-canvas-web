// --- Auth Context & API integration ---
// Endpoints:
// - Login:         [POST]   /api/auth/login
// - Register:      [POST]   /api/auth/register
// - Get Session:   [GET]    /api/auth/session (or similar, if implemented)
// - Logout:        [POST]   /api/auth/logout (or custom logic)
//
// This file provides React context for authentication state and profile loading.
// Refactor the effect and signOut logic to use the above endpoints and localStorage/cookies for JWT/session management.
//
// Usage: Wrap your app in <AuthProvider> and use the useAuth() hook for access to user, session, profile, loading, and signOut.

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  AuthContext,
  type JwtPayload,
  type User,
  type Profile,
  type RegisterInput,
} from './auth-context';

const API_URL = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // On mount, check for JWT in localStorage and fetch profile if present
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setToken(token);
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded?.userId || decoded?.sub;
        // Get email from JWT token
        const emailFromToken = (decoded as any)?.email || (decoded as any)?.Email || '';

        if (userId) {
          // Try to fetch profile from API
          const url = `${API_URL}/api/profiles/${userId}`;
          fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (res.ok) return res.json();
              // If 401, token is invalid - clear it
              if (res.status === 401) {
                localStorage.removeItem('jwt');
                setToken(null);
              }
              return null;
            })
            .then((data) => {
              if (data) {
                const roleValue = data.role ?? data.Role;
                const role =
                  roleValue === null || roleValue === undefined || isNaN(Number(roleValue))
                    ? 0
                    : Number(roleValue);

                setUser({
                  id: userId,
                  email: data.email || data.Email || emailFromToken,
                  role: role,
                });
                setProfile({
                  id: String(data.id || data.Id),
                  name: data.name || data.Name || null,
                  profileUrl: data.profileUrl || data.ProfileUrl || null,
                });
              } else {
                setUser(null);
                setProfile(null);
              }
              setLoading(false);
            })
            .catch(() => {
              setUser(null);
              setProfile(null);
              setLoading(false);
            });
          return;
        }
      } catch {
        // Invalid token
        setProfile(null);
      }
    }
    setLoading(false);
  }, []);

  // Set profile and token from login/register response
  const setAuthFromResponse = (data: {
    token?: string;
    user?: Record<string, unknown>;
    profile?: Record<string, unknown>;
  }): boolean => {
    // data is expected something like:
    // { message, token, user: { Id, Username, Role, Profile: { Id, Name, Email } } }
    if (!data?.token) {
      setProfile(null);
      setToken(null);
      localStorage.removeItem('jwt');
      return false;
    }

    setToken(data.token);
    localStorage.setItem('jwt', data.token);

    // Try a few shapes – adjust if you know your exact API shape
    const rawProfile = ((data.user as Record<string, unknown>)?.Profile || // original expected shape
      data.profile || // maybe backend returns { profile: ... }
      data.user) as Record<string, unknown> | undefined; // fallback to user object itself

    if (!rawProfile) {
      setProfile(null);
      return false;
    }

    // Set user data (from user object)
    const userData = data.user as Record<string, unknown>;
    const roleValue = userData.Role ?? userData.role;
    const role =
      roleValue === null || roleValue === undefined || isNaN(Number(roleValue))
        ? 0
        : Number(roleValue);

    setUser({
      id: String(userData.Id ?? userData.id ?? ''),
      email: String(userData.Email ?? userData.email ?? ''),
      role: role,
    });

    // Set profile data (from profile object)
    setProfile({
      id: String(rawProfile.id ?? rawProfile.Id ?? ''),
      name: (rawProfile.name ?? rawProfile.Name ?? null) as string | null,
      profileUrl: (rawProfile.profileUrl ?? rawProfile.ProfileUrl ?? null) as string | null,
    });

    return true;
  };

  // Login function (username, password)
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: username, Password: password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();

      const ok = setAuthFromResponse(data);
      setLoading(false);
      return ok;
    } catch {
      setProfile(null);
      setToken(null);
      localStorage.removeItem('jwt');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (input: RegisterInput) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Register failed');
      const data = await res.json();

      const ok = setAuthFromResponse(data);
      setLoading(false);
      return ok;
    } catch {
      setProfile(null);
      setToken(null);
      localStorage.removeItem('jwt');
      setLoading(false);
      return false;
    }
  };

  // Sign out: remove JWT and clear state
  const signOut = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('jwt');
  };

  // Refetch profile from API
  const refetchProfile = async () => {
    const currentToken = localStorage.getItem('jwt');
    if (!currentToken || !profile?.id) return;

    try {
      const url = `${API_URL}/api/profiles/${profile.id}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const roleValue = data.role ?? data.Role;
        const role =
          roleValue === null || roleValue === undefined || isNaN(Number(roleValue))
            ? 0
            : Number(roleValue);

        setUser({
          id: profile.id,
          email: data.email || data.Email || '',
          role: role,
        });
        setProfile({
          id: String(data.id || data.Id),
          name: data.name || data.Name || null,
          profileUrl: data.profileUrl || data.ProfileUrl || null,
        });
      }
    } catch (error) {
      console.error('Failed to refetch profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, register, signOut, token, refetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
