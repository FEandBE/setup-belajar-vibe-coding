import { Elysia } from 'elysia';
import { userRoutes } from './routes/user-routes';

const app = new Elysia()
  .get('/', () => ({ 
    status: 'ok', 
    message: 'Backend server is running correctly!' 
  }))
  .use(userRoutes) // Integrate new routes
  .listen(3000);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
