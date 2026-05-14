import { prisma } from '../../../lib/prisma.js';
import { TodoResponse, TodoListResponse } from '../types/todo.types.js';
import {
  CreateTodoInput,
  ListTodoInput,
} from '../validators/todo.validator.js';
import { NotFoundError } from '../../../shared/exceptions/AppError.js';

export class TodoService {
  async create(userId: string, input: CreateTodoInput): Promise<TodoResponse> {
    const todo = await prisma.todo.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        completed: input.completed,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        notes: input.notes,
        categoryId: input.categoryId,
        tags: input.tagIds?.length
          ? {
              create: input.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: { select: { id: true, name: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    });

    return this.formatTodo(todo);
  }

  async list(userId: string, input: ListTodoInput): Promise<TodoListResponse> {
    const where = {
      userId,
      ...(input.completed !== undefined && { completed: input.completed }),
      ...(input.priority && { priority: input.priority }),
    };

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip: input.offset,
        take: input.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
        },
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      todos: todos.map(this.formatTodo),
      total,
      limit: input.limit,
      offset: input.offset,
    };
  }

  async getById(userId: string, id: string): Promise<TodoResponse> {
    const todo = await prisma.todo.findUnique({
      where: { id, userId },
      include: {
        category: { select: { id: true, name: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    });

    if (!todo) {
      throw new NotFoundError('Todo not found');
    }

    return this.formatTodo(todo);
  }

  private formatTodo(todo: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    category: { id: string; name: string } | null;
    tags: { tag: { id: string; name: string } }[];
  }): TodoResponse {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      dueDate: todo.dueDate,
      notes: todo.notes,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      category: todo.category,
      tags: todo.tags.map((t) => t.tag),
    };
  }
}

export const todoService = new TodoService();
