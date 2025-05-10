
import { CustomerStatus, LoyaltyLevel } from './constants';

// Customer-related type definitions

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  phone_number?: string;
  status: CustomerStatus;
  loyalty_level?: LoyaltyLevel;
  tags?: string[];
  created_at: string;
  updated_at: string;
  notes?: string;
  registration_date?: string;
  last_appointment?: string;
}

export interface CustomerFormData {
  full_name: string;
  email: string;
  phone_number: string;
  status: CustomerStatus;
  loyalty_level: LoyaltyLevel;
  notes?: string;
  registration_date: Date;
  last_appointment?: Date | null;
  tags?: string[];
}

// Mock data - moved from customerService.ts
export const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    full_name: 'שרה כהן',
    email: 'sarah@example.com',
    phone: '050-1234567',
    phone_number: '050-1234567',
    status: CustomerStatus.ACTIVE,
    loyalty_level: LoyaltyLevel.GOLD,
    tags: ['vip', 'regular'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה ותיקה',
    registration_date: new Date('2023-01-15').toISOString(),
    last_appointment: new Date('2023-05-20').toISOString()
  },
  {
    id: 'cust2',
    full_name: 'אמילי לוי',
    email: 'emily@example.com',
    phone: '050-2345678',
    phone_number: '050-2345678',
    status: CustomerStatus.ACTIVE,
    loyalty_level: LoyaltyLevel.SILVER,
    tags: ['new'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: '',
    registration_date: new Date('2023-03-10').toISOString(),
    last_appointment: new Date('2023-06-05').toISOString()
  },
  {
    id: 'cust3',
    full_name: 'ליאת ונג',
    email: 'liat@example.com',
    phone: '050-3456789',
    phone_number: '050-3456789',
    status: CustomerStatus.INACTIVE,
    loyalty_level: LoyaltyLevel.BRONZE,
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה לא פעילה',
    registration_date: new Date('2023-02-20').toISOString(),
    last_appointment: new Date('2023-04-15').toISOString()
  },
  {
    id: 'cust4',
    full_name: 'מיכל אברהם',
    email: 'michal@example.com',
    phone: '050-4567890',
    phone_number: '050-4567890',
    status: CustomerStatus.LEAD,
    loyalty_level: LoyaltyLevel.NONE,
    tags: ['interested'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה פוטנציאלית',
    registration_date: new Date('2023-05-01').toISOString()
  },
  {
    id: 'cust5',
    full_name: 'רחל גולן',
    email: 'rachel@example.com',
    phone: '050-5678901',
    phone_number: '050-5678901',
    status: CustomerStatus.ACTIVE,
    loyalty_level: LoyaltyLevel.GOLD,
    tags: ['vip'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה ותיקה ו-VIP',
    registration_date: new Date('2022-11-15').toISOString(),
    last_appointment: new Date('2023-06-25').toISOString()
  }
];
