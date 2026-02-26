import { db } from '@/lib/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { ironSession } from 'iron-session';

// Session config
const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_here',
  cookieName: 'growhubtips_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
};

export async function registerAdminAction({ name, email, password }: { name: string; email: string; password: string }) {
  // Check if ADMIN exists
  const adminExists = await db.select().from(users).where(users.role.eq('ADMIN')).limit(1);
  if (adminExists.length > 0) {
    throw new Error('Admin already exists');
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  // Insert user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: 'ADMIN',
  });
}

export async function loginAction({ email, password }: { email: string; password: string }) {
  // Fetch user
  const user = await db.select().from(users).where(users.email.eq(email)).limit(1);
  if (!user.length) {
    throw new Error('User not found');
  }
  // Compare password
  const valid = await bcrypt.compare(password, user[0].password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  // Set session cookie
  const session = await ironSession(cookies(), sessionOptions);
  session.set('user', { id: user[0].id, role: user[0].role });
  await session.save();
  // Redirect
  return { redirect: '/admin/dashboard' };
}
