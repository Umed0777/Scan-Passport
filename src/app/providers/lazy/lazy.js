import { lazy } from 'react';

export const Layout = lazy(() => import('../layout/layout'));
export const Dashboard = lazy(() => import('@/pages/dashboard'));
export const Settings = lazy(() => import('@/pages/settings'));
