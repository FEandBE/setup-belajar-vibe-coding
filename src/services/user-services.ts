import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface RegisterUserParams {
  nama: string;
  email: string;
  password: string;
}

export const registerUser = async (params: RegisterUserParams) => {
  const { nama, email, password } = params;

  // 1. Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existingUser) {
    throw new Error('email sudah terdaftar');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert user
  // Map 'nama' from request to 'username' in database
  await db.insert(users).values({
    username: nama,
    email: email,
    password: hashedPassword,
  });

  return { status: 'ok' };
};
export interface LoginUserParams {
  email: string;
  password: string;
}

export const loginUser = async (params: LoginUserParams) => {
  const { email, password } = params;

  // 1. Find user by email
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    throw new Error('email atau passwor salah');
  }

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('email atau passwor salah');
  }

  // 3. Generate session token (UUID)
  const token = crypto.randomUUID();

  // 4. Store session in database
  await db.insert(sessions).values({
    token: token,
    userId: user.id,
  });

  return token;
};
