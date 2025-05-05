
export interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram';
  account_id: string;
  account_name: string;
  access_token: string;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface SocialMediaPost {
  id: string;
  account_id: string;
  platform: 'facebook' | 'instagram';
  caption: string | null;
  image_url: string | null;
  external_post_id: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface PostFormData {
  platform: 'facebook' | 'instagram';
  account_id: string;
  caption: string;
  image: File | null;
  scheduled_for: Date | null;
}

export interface ConnectAccountResponse {
  success: boolean;
  account?: SocialMediaAccount;
  error?: string;
}

export interface FetchPostsResponse {
  success: boolean;
  posts?: SocialMediaPost[];
  error?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post?: SocialMediaPost;
  error?: string;
}
