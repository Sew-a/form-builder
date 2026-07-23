/**
 * Centralized API route constants for backend.
 * Keeps route paths in one place to avoid drift.
 */
export const API_ROUTES = {
  health: '/api/health',
  auth: {
    base: '/api/auth',
    register: '/register',
    login: '/login',
    logout: '/logout',
    me: '/me',
    updateProfile: '/me',
    changePassword: '/password',
    updateAvatar: '/avatar',
    deleteAccount: '/me',
  },
  forms: {
    base: '/api/forms',
    public: (id: string) => `/api/forms/${id}/public`,
    responses: (id: string) => `/api/forms/${id}/responses`,
    byId: (id: string) => `/api/forms/${id}`,
  },
} as const;