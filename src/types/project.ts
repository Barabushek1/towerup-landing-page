
export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  image_url?: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
