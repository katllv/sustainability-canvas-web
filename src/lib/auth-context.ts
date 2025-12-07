import { createContext } from 'react';

export interface JwtPayload {
  userId?: string;
  sub?: string;
}

export interface User {
  id: string;
  email: string;
  role: number;
}

export interface Profile {
  id: string;
  name: string | null;
  picture_url: string | null;
}

export interface RegisterInput {
  password: string;
  name: string;
  email: string;
  registrationCode: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  signOut: () => void;
  token: string | null;
  refetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
