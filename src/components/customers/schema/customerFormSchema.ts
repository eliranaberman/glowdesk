
import * as z from 'zod';

// Form schema validation
export const customerSchema = z.object({
  full_name: z.string().min(2, { message: "שם חייב להיות לפחות 2 תווים" }),
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  phone_number: z.string().min(9, { message: "מספר טלפון חייב להיות לפחות 9 ספרות" }),
  status: z.enum(["active", "inactive", "lead"]),
  loyalty_level: z.enum(["bronze", "silver", "gold", "none"]),
  notes: z.string().optional(),
  registration_date: z.date(),
  last_appointment: z.date().optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerSchema> & { tags: string[] };
