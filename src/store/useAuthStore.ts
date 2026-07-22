import { create } from 'zustand';
import { api } from '../lib/api';
import type {
  RegisterInput,
  LoginInput,
  AuthUserDTO,
  UpdateProfileInput,
  ChangePasswordInput,
  DeleteAccountInput,
} from '@shared/types';

interface AuthState {
  user: AuthUserDTO | null;
  loading: boolean;
  error: string | null;
  authModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  setAuthModalOpen: (open: boolean, tab?: 'signin' | 'signup') => void;
  setUser: (user: AuthUserDTO | null) => void;
  checkUser: () => Promise<void>;
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  changePassword: (data: ChangePasswordInput) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  deleteAccount: (data: DeleteAccountInput) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  authModalOpen: false,
  authModalTab: 'signin',

  setAuthModalOpen: (open, tab = 'signin') => {
    set({ authModalOpen: open, authModalTab: tab, error: null });
  },

  setUser: (user) => set({ user }),

  clearError: () => set({ error: null }),

  checkUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await api.get<AuthUserDTO>('/api/auth/me');
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const user = await api.post<AuthUserDTO>('/api/auth/login', credentials);
      set({ user, loading: false, authModalOpen: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, loading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = await api.post<AuthUserDTO>('/api/auth/register', data);
      set({ user, loading: false, authModalOpen: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post<void>('/api/auth/logout');
      set({ user: null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      set({ error: message, loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = await api.patch<AuthUserDTO>('/api/auth/me', data);
      set({ user, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not update profile';
      set({ error: message, loading: false });
      throw err;
    }
  },

  changePassword: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.patch<{ ok: boolean }>('/api/auth/password', data);
      set({ loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not change password';
      set({ error: message, loading: false });
      throw err;
    }
  },

  updateAvatar: async (avatarUrl) => {
    set({ loading: true, error: null });
    try {
      const user = await api.patch<AuthUserDTO>('/api/auth/avatar', { avatarUrl });
      set({ user, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not update profile picture';
      set({ error: message, loading: false });
      throw err;
    }
  },

  deleteAccount: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.delete<void>('/api/auth/me', data);
      set({ user: null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not delete account';
      set({ error: message, loading: false });
      throw err;
    }
  },
}));
