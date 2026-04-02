import { Elysia, t } from 'elysia';
import { registerUser } from '../services/user-services';

export const userRoutes = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body, set }) => {
    try {
      const result = await registerUser(body);
      return { data: 'ok' };
    } catch (error: any) {
      if (error.message === 'email sudah terdaftar') {
        return { data: 'email sudah terdaftar' };
      }
      set.status = 500;
      return { data: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      nama: t.String(),
      email: t.String(),
      password: t.String()
    })
  });
