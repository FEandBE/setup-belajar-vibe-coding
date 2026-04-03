import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/user-services';

export const userRoutes = new Elysia({ prefix: '/api' })
  .onError(({ code, error, set }) => {
    const message = (error as any).message;

    if (code === 'VALIDATION') {
      set.status = 400;
      return { 
        data: 'validasi gagal', 
        message: error.message // Lebih aman menggunakan .message dasar
      };
    }
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
      nama: t.String({ minLength: 3, maxLength: 100 }),
      email: t.String({ format: 'email', maxLength: 150 }),
      password: t.String({ minLength: 6, maxLength: 255 })
    }),
    detail: {
      summary: 'Registrasi Pengguna Baru',
      tags: ['Authentication']
    },
    response: {
      200: t.Object({ data: t.String() }, { description: 'Status Berhasil' }),
      400: t.Object({ data: t.String() }, { description: 'Gagal Validasi' })
    }
  })
  .post('/users/login', async ({ body }) => {
    const token = await loginUser(body);
    return { data: token };
  }, {
    body: t.Object({
      email: t.String({ maxLength: 150 }),
      password: t.String({ maxLength: 255 })
    }),
    detail: {
      summary: 'Login Pengguna (Mendapatkan Token)',
      tags: ['Authentication']
    },
    response: {
      200: t.Object({ data: t.String() }, { description: 'Session Token (UUID)' }),
      400: t.Object({ data: t.String() }, { description: 'Email atau Password Salah' })
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
    },
    response: {
      200: t.Object({
        data: t.Object({
          id: t.Number(),
          nama: t.String(),
          email: t.String(),
          created_at: t.String()
        })
      }, { description: 'Data Profil Pengguna' }),
      401: t.Object({ data: t.String() }, { description: 'Unauthorized / Token Invalid' })
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
    },
    response: {
      200: t.Object({ data: t.String() }, { description: 'Sesi Berhasil Dihapus' }),
      401: t.Object({ data: t.String() }, { description: 'Unauthorized / Token Invalid' })
    }
  });
