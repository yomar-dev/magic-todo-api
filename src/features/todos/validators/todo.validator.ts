import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional().default([]),
});

export const listTodoSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
  completed: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type ListTodoInput = z.infer<typeof listTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
