export interface KnowledgePoint {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  grade: string;
}

export interface CategoryProgress {
  category: string;
  learned: number;
  total: number;
}
