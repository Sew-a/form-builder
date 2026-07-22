/**
 * Centralized route constants.
 *
 * Keep all public/internal routes in this file so components don't
 * hardcode href strings scattered across the codebase.
 */
export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  builder: (formId: string) => `/builder/${formId}`,
  settings: {
    profile: '/settings/profile',
  },
  auth: {
    login: '/login',
    register: '/register',
  },
  forms: {
    view: (formId: string) => `/forms/${formId}`,
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type SettingsRouteKey = keyof typeof ROUTES.settings;
export type AuthRouteKey = keyof typeof ROUTES.auth;
export type FormsRouteKey = keyof typeof ROUTES.forms;