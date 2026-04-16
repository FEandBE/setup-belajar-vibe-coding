import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { todos } from "../db/schema";

export const TodosService = {
  async getTodos(userId: number) {
    return await db.query.todos.findMany({
      where: eq(todos.userId, userId),
      orderBy: [desc(todos.createdAt)],
    });
  },

  async createTodo(userId: number, payload: { title: string; description?: string }) {
    const [result] = await db.insert(todos).values({
      title: payload.title,
      description: payload.description || null,
      userId: userId,
      isCompleted: false
    });
    
    return {
      id: result.insertId,
      title: payload.title,
      description: payload.description || null,
      userId,
      isCompleted: false
    };
  },

  async updateTodo(userId: number, todoId: number, payload: { title?: string; description?: string; isCompleted?: boolean }) {
    await db.update(todos)
      .set({
        ...payload,
        description: payload.description !== undefined ? payload.description : undefined
      })
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
    
    const updated = await db.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId))
    });
    
    if (!updated) {
      throw new Error("Todo not found");
    }
    
    return updated;
  },

  async deleteTodo(userId: number, todoId: number) {
    const [result] = await db.delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
      
    if (result.affectedRows === 0) {
      throw new Error("Todo not found");
    }
    
    return { id: todoId };
  }
};
