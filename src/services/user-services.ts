import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema';
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
