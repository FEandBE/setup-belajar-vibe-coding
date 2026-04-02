import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { userRoutes } from './routes/user-routes';

export const app = new Elysia()
  .use(swagger({
    path: '/swagger',
    documentation: {
      info: {
        title: 'Belajar Vibe Coding API',
        version: '1.0.0',
        description: 'Dokumentasi API untuk sistem autentikasi user (Register, Login, Profil, Logout).'
      }
    }
  }))
  .get('/', () => ({ 
    status: 'ok', 
    message: 'Backend server is running correctly!' 
  }))
  .use(userRoutes) // Integrate new routes
  .listen(3000);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
