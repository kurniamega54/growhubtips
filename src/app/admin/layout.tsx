import { cookies } from 'next/headers';
import { ironSession } from 'iron-session';
import { redirect } from 'next/navigation';

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_here',
  cookieName: 'growhubtips_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
};

export default async function AdminLayout({ children }) {
  const session = await ironSession(cookies(), sessionOptions);
  const user = session.get('user');
  if (!user) {
    redirect('/admin/login');
  }
  return <>{children}</>;
}
