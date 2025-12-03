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

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Profile {
  id: string;
  name: string | null;
  picture_url: string | null;
  email: string | null;
}

interface RegisterInput {
  password: string;
  name: string;
  email: string;
  registrationCode: string;
}

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  signOut: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // On mount, check for JWT in localStorage and fetch profile if present
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setToken(token);
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded?.userId || decoded?.sub;
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
            .then((profile) => {
              if (profile) {
                setProfile({
                  id: String(profile.id || profile.Id),
                  name: profile.name || profile.Name || null,
                  picture_url: null,
                  email: profile.email || profile.Email || null,
                });
              } else {
                setProfile(null);
              }
              setLoading(false);
            })
            .catch(() => {
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
  const setAuthFromResponse = (data: any): boolean => {
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
    const rawProfile =
      data.user?.Profile || // original expected shape
      data.profile || // maybe backend returns { profile: ... }
      data.user; // fallback to user object itself

    if (!rawProfile) {
      setProfile(null);
      return false;
    }

    setProfile({
      id: String(rawProfile.id ?? rawProfile.Id ?? ''),
      name: rawProfile.name ?? rawProfile.Name ?? null,
      picture_url: null,
      email: rawProfile.email ?? rawProfile.Email ?? null,
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
    setProfile(null);
    setToken(null);
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ profile, loading, login, register, signOut, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
