export interface Todo {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  completed_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}