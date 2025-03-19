interface ProtectedRoute {
  path: string;
  requiredRoleID: number[];
  requiredGroupID: number[];
}

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  {
    path: '/create',
    requiredRoleID: [2, 2202],
    requiredGroupID: [48]
  },
  {
    path: '/ha',
    requiredRoleID: [2],
    requiredGroupID: []
  }
] as const;