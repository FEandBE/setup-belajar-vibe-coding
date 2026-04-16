import { Elysia, t } from "elysia";
import { TodosService } from "../services/todos-service";
import { UsersService } from "../services/users-service";

export const todosRoute = new Elysia({ prefix: "/api/todos" })
  .guard({
    beforeHandle: ({ headers, set }) => {
      const auth = headers["authorization"];
      if (!auth || !auth.startsWith("Bearer ")) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
    }
  })
  .derive(async ({ headers, set }) => {
    const auth = headers["authorization"];
    const token = auth?.split(" ")[1] ?? "";
    try {
      const user = await UsersService.getCurrentUser(token);
      return { user };
    } catch {
      // Just return null user, handled in next beforeHandle or directly
      return { user: null };
    }
  })
  .onBeforeHandle(({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized: Invalid Session" };
    }
  })
  .get("/", async ({ user }) => {
    const todos = await TodosService.getTodos(user!.id);
    return { data: todos };
  }, {
    detail: {
      tags: ["Todos"],
      summary: "Get All Todos",
      description: "Mengambil daftar semua todos milik user yang login",
      security: [{ bearerAuth: [] }],
    }
  })
  .post("/", async ({ body, user, set }) => {
    try {
      const newTodo = await TodosService.createTodo(user!.id, body);
      set.status = 201;
      return { data: newTodo };
    } catch (error: any) {
      set.status = 400;
      return { error: error.message };
    }
  }, {
    body: t.Object({
      title: t.String({ minLength: 1, maxLength: 255 }),
      description: t.Optional(t.String({ maxLength: 1000 })),
    }),
    detail: {
      tags: ["Todos"],
      summary: "Create Todo",
      description: "Membuat todo baru milik user yang sedang login",
      security: [{ bearerAuth: [] }],
    }
  })
  .put("/:id", async ({ params: { id }, body, user, set }) => {
    try {
      const updated = await TodosService.updateTodo(user!.id, Number(id), body);
      return { data: updated };
    } catch (error: any) {
      set.status = 404;
      return { error: error.message };
    }
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
      description: t.Optional(t.String({ maxLength: 1000 })),
      isCompleted: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ["Todos"],
      summary: "Update Todo",
      description: "Memperbarui data todo spesifik milik user",
      security: [{ bearerAuth: [] }],
    }
  })
  .delete("/:id", async ({ params: { id }, user, set }) => {
    try {
      await TodosService.deleteTodo(user!.id, Number(id));
      return { data: `Todo ${id} deleted` };
    } catch (error: any) {
      set.status = 404;
      return { error: error.message };
    }
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ["Todos"],
      summary: "Delete Todo",
      description: "Menghapus todo spesifik milik user",
      security: [{ bearerAuth: [] }],
    }
  });
