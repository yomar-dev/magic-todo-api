import type { Priority, Category, Tag } from '@prisma/client';

export interface TodoResponse {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: Pick<Category, 'id' | 'name'> | null;
  tags: Pick<Tag, 'id' | 'name'>[];
}
