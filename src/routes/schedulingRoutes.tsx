
import { RouteObject } from 'react-router-dom';
import Scheduling from '../pages/Scheduling';
import AppointmentCalendar from '../pages/AppointmentCalendar';
import NewAppointment from '../pages/scheduling/NewAppointment';
import EditAppointment from '../pages/scheduling/EditAppointment';
import CancelAppointment from '../pages/cancel-appointment/[token]';

export const schedulingRoutes: RouteObject[] = [
  {
    path: 'scheduling',
    element: <Scheduling />,
  },
  {
    path: 'calendar',
    element: <AppointmentCalendar />,
  },
  {
    path: 'scheduling/new',
    element: <NewAppointment />,
  },
  {
    path: 'scheduling/:id',
    element: <EditAppointment />,
  },
];

// Define the public routes separately, as they don't require authentication
export const schedulingPublicRoutes: RouteObject[] = [
  {
    path: '/cancel-appointment/:token',
    element: <CancelAppointment />,
  },
];
