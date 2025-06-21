
export type ClientGender = 'male' | 'female' | 'other';

export type ClientStatus = 'active' | 'inactive' | 'lead';

export type ActivityType = 'call' | 'message' | 'purchase' | 'visit';

export interface ClientService {
  id: string;
  client_id: string;
  service_date: string;
  description: string;
  price: number;
  created_at: string;
  created_by?: string;
}

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
  preferred_treatment?: string;
  visit_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ClientActivity {
  id: string;
  client_id: string;
  type: ActivityType;
  description: string;
  date?: string;
  created_at: string;
  created_by: string;
  created_by_user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}
