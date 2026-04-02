import { describe, expect, it, beforeEach } from 'bun:test';
import { app } from '../src/index';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';
import { eq } from 'drizzle-orm';

describe('User Authentication API', () => {
  // Clear database before each test
  beforeEach(async () => {
    await db.delete(sessions);
    await db.delete(users);
  });

  describe('POST /api/users (Registration)', () => {
    it('should register a new user successfully', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi Utomo',
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toBe('ok');
    });

    it('should fail if email is already registered', async () => {
      // First registration
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi',
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );

      // Duplicate registration
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi Baru',
            email: 'budi@example.com',
            password: 'newpassword'
          })
        })
      );

      const body = await response.json();
      expect(body.data).toBe('email sudah terdaftar');
    });

    it('should fail if name is too short', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Bu',
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(400);
    });

    it('should fail if email format is invalid', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi',
            email: 'budi-bukan-email',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(400);
    });

    it('should fail if password is too short', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi',
            email: 'budi@example.com',
            password: '123'
          })
        })
      );

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi',
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );
    });

    it('should login successfully with correct credentials', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toBeDefined(); // Token UUID
    });

    it('should fail with wrong password', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'budi@example.com',
            password: 'salah-password'
          })
        })
      );

      const body = await response.json();
      expect(body.data).toBe('email atau password salah');
    });
  });

  describe('Current User & Logout Flow', () => {
    let token: string;

    beforeEach(async () => {
      // 1. Register
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: 'Budi',
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );

      // 2. Login to get token
      const loginRes = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'budi@example.com',
            password: 'password123'
          })
        })
      );
      const loginBody = await loginRes.json();
      token = loginBody.data;
    });

    it('should get current user profile using valid token', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/current', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data.email).toBe('budi@example.com');
    });

    it('should fail logout with invalid token', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/logout', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer token-palsu` }
        })
      );

      expect(response.status).toBe(401);
    });

    it('should logout successfully and invalidate token', async () => {
      // 1. Logout
      const logoutRes = await app.handle(
        new Request('http://localhost/api/users/logout', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      expect(logoutRes.status).toBe(200);

      // 2. Try to get profile again (should fail)
      const profileRes = await app.handle(
        new Request('http://localhost/api/users/current', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      expect(profileRes.status).toBe(401);
    });
  });
});
