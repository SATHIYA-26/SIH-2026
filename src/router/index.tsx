import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Dashboard } from '../pages/Dashboard';
import { Fields } from '../pages/Fields';
import { FieldHealth } from '../pages/FieldHealth';
import { History } from '../pages/History';
import { CheckField } from '../pages/CheckField';
import { Followups } from '../pages/Followups';
import { Alerts } from '../pages/Alerts';
import { RiskTrends } from '../pages/RiskTrends';
import { DiseaseTrends } from '../pages/DiseaseTrends';
import { PestTrends } from '../pages/PestTrends';
import { Reports } from '../pages/Reports';
import { Compare } from '../pages/Compare';
import { Settings } from '../pages/Settings';
import { Profile } from '../pages/Profile';
import { AdminInsights } from '../pages/AdminInsights';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'fields', element: <Fields /> },
      { path: 'field-health', element: <FieldHealth /> },
      { path: 'history', element: <History /> },
      { path: 'check-field', element: <CheckField /> },
      { path: 'followups', element: <Followups /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'insights/risk', element: <RiskTrends /> },
      { path: 'insights/disease', element: <DiseaseTrends /> },
      { path: 'insights/pest', element: <PestTrends /> },
      { path: 'reports', element: <Reports /> },
      { path: 'compare', element: <Compare /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <Profile /> },
      { path: 'admin-insights', element: <AdminInsights /> },
    ],
  },
]);
