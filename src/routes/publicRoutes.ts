
import { RouteObject } from 'react-router-dom';
import InitialSetupPage from '../pages/InitialSetupPage';
import OnlineBooking from '../pages/OnlineBooking';

export const publicRoutes: RouteObject[] = [
  {
    path: '/setup',
    element: <InitialSetupPage />,
  },
  {
    path: '/online-booking',
    element: <OnlineBooking />,
  },
];
