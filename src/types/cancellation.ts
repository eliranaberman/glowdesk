
export interface CancellationToken {
  id: string;
  token: string;
  appointment_id: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}
