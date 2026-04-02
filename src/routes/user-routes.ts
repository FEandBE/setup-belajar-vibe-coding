import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/user-services';

export const userRoutes = new Elysia({ prefix: '/api' })
  .onError(({ code, error, set }) => {
    const message = (error as any).message;

    if (message === 'email sudah terdaftar') {
      return { data: 'email sudah terdaftar' };
    }
    if (message === 'email atau password salah') {
      return { data: 'email atau password salah' };
    }
    if (message === 'unauthorized') {
      set.status = 401;
      return { data: 'unauthorized' };
    }

    console.error(error);
    set.status = 500;
    return { data: 'Internal Server Error' };
  })
  .derive(({ headers }) => {
    const auth = headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return { token: null };
    }

    return { 
      token: auth.split(' ')[1] 
    };
  })
  .post('/users', async ({ body }) => {
    await registerUser(body);
    return { data: 'ok' };
  }, {
    body: t.Object({
      nama: t.String(),
      email: t.String(),
      password: t.String()
    }),
    detail: {
      summary: 'Registrasi Pengguna Baru',
      tags: ['Authentication']
    }
  })
  .post('/users/login', async ({ body }) => {
    const token = await loginUser(body);
    return { data: token };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    }),
    detail: {
      summary: 'Login Pengguna (Mendapatkan Token)',
      tags: ['Authentication']
    }
  })
  .get('/users/current', async ({ token }) => {
    if (!token) {
      throw new Error('unauthorized');
    }

    const user = await getCurrentUser(token);
    return { data: user };
  }, {
    detail: {
      summary: 'Dapatkan Profil Pengguna Saat Ini',
      tags: ['Authentication']
    }
  })
  .delete('/users/logout', async ({ token }) => {
    if (!token) {
      throw new Error('unauthorized');
    }

    await logoutUser(token);
    return { data: 'ok' };
  }, {
    detail: {
      summary: 'Logout (Menghapus Sesi)',
      tags: ['Authentication']
    }
  });
