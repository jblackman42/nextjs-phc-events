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
  },
  {
    path: '/prayerwall',
    requiredRoleID: [2],
    requiredGroupID: [49]
  }
] as const;

export const chartColors = [
  "#1e90ff", // Blue
  "#2ed573", // Green
  "#ffa502", // Yellow
  "#ff6348", // Orange
  "#ff4757", // Red
  "#8e44ad", // Purple
]