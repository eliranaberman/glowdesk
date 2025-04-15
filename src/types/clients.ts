
export type ClientGender = 'male' | 'female' | 'other';

export type ClientStatus = 'active' | 'inactive' | 'lead';

export type ActivityType = 'call' | 'message' | 'purchase' | 'visit';

export interface Client {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  birthday?: string;
  gender?: ClientGender;
  status: ClientStatus;
  registration_date: string;
  tags?: string[];
  notes?: string;
  assigned_rep?: string;
  assigned_rep_user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ClientActivity {
  id: string;
  client_id: string;
  type: ActivityType;
  description: string;
  date?: string;  // Made optional since it might not exist
  created_at: string; // Added this field as it's likely to be present
  created_by: string;
  created_by_user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}
