import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser } from '../services/user-services';

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
  })
  .post('/users/login', async ({ body, set }) => {
    try {
      const token = await loginUser(body);
      return { data: token };
    } catch (error: any) {
      if (error.message === 'email atau passwor salah') {
        return { data: 'email atau passwor salah' };
      }
      set.status = 500;
      return { data: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .get('/users/current', async ({ headers, set }) => {
    const auth = headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      set.status = 401;
      return { data: 'unauthorized' };
    }

    const token = auth.split(' ')[1];

    try {
      const user = await getCurrentUser(token);
      return { data: user };
    } catch (error: any) {
      if (error.message === 'unauthorized') {
        set.status = 401;
        return { data: 'unauthorized' };
      }
      set.status = 500;
      return { data: 'Internal Server Error' };
    }
  });
