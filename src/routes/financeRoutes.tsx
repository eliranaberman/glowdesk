
import { RouteObject } from 'react-router-dom';
import BusinessManagement from '../pages/finances/BusinessManagement';
import Revenues from '../pages/finances/Revenues';
import CashFlow from '../pages/finances/CashFlow';
import FinancialReports from '../pages/finances/FinancialReports';
import BusinessInsights from '../pages/finances/BusinessInsights';

export const financeRoutes: RouteObject[] = [
  {
    path: '/finances',
    element: <BusinessManagement />,
  },
  {
    path: '/finances/revenues',
    element: <Revenues />,
  },
  {
    path: '/finances/cashflow',
    element: <CashFlow />,
  },
  {
    path: '/finances/reports',
    element: <FinancialReports />,
  },
  {
    path: '/finances/insights',
    element: <BusinessInsights />,
  },
];
