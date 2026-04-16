import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { usersRoute } from "./routes/users-route";
import { todosRoute } from "./routes/todos-route";

export const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "Belajar Vibe Coding API",
        version: "1.0.0",
        description: "API documentation for the User Management system",
      },
      tags: [
        { name: "Users", description: "Endpoints for user management and authentication" },
      ],
    },
  }))
  .use(usersRoute)
  .use(todosRoute)
  .get("/", () => "Hello World");

if (process.env.NODE_ENV !== "test") {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
