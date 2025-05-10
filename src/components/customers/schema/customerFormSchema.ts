
import * as z from 'zod';
import { CustomerStatus, LoyaltyLevel } from '@/services/customers/constants';

// Form schema validation
export const customerSchema = z.object({
  full_name: z.string().min(2, { message: "שם חייב להיות לפחות 2 תווים" }),
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  phone_number: z.string().min(9, { message: "מספר טלפון חייב להיות לפחות 9 ספרות" }),
  status: z.enum([CustomerStatus.ACTIVE, CustomerStatus.INACTIVE, CustomerStatus.LEAD]),
  loyalty_level: z.enum([LoyaltyLevel.BRONZE, LoyaltyLevel.SILVER, LoyaltyLevel.GOLD, LoyaltyLevel.NONE]),
  notes: z.string().optional(),
  registration_date: z.date(),
  last_appointment: z.date().optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerSchema> & { tags: string[] };
