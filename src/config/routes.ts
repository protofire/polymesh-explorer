export const ROUTES = {
  Home: '/',
  Account: '/account',
  Asset: '/asset',
  Identity: '/identity',
  Venue: '/venue',
  Settlement: '/settlement',
  NftView: '/nft',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];
