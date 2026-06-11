export interface Book {
  id: string | number;

  title: string;

  author: string; // ALWAYS STRING (important)

  cover?: string;

  category?: string;

  description?: string;

  progress?: number;

  language?: string;

  subjects?: string[];

  downloadCount?: number;
}