// export const PROTECTED_ROUTES = [
//   '/create',
//   '/ha',
// ] as const;
interface ProtectedRoute {
  path: string;
  requiredRoleID: number[];
  requiredGroupID: number[];
}

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  {
    path: '/create',
    requiredRoleID: [2, 2202],
    requiredGroupID: []
  },
  {
    path: '/ha',
    requiredRoleID: [2],
    requiredGroupID: []
  }
] as const;