export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string | null;
}
