
export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_by: string;
  created_at: string;
}

export interface PortfolioItemFormData {
  title: string;
  description: string;
  image: File | null;
}
