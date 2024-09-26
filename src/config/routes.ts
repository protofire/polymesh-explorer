export const ROUTES = {
  Home: '/',
  Account: '/account',
  Asset: '/asset',
  Identity: '/identity',
  Venue: '/venue',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];
