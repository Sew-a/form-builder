/**
 * Centralized API route constants for backend.
 * Keeps route paths in one place to avoid drift.
 */
export const API_ROUTES = {
  health: '/api/health',
  auth: {
    base: '/api/auth',
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    updateProfile: '/api/auth/me',
    changePassword: '/api/auth/password',
    updateAvatar: '/api/auth/avatar',
    deleteAccount: '/api/auth/me',
  },
  forms: {
    base: '/api/forms',
    public: (id: string) => `/api/forms/${id}/public`,
    responses: (id: string) => `/api/forms/${id}/responses`,
    byId: (id: string) => `/api/forms/${id}`,
  },
} as const;