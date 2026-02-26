import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Call loginAction here
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side: Forest Background + Mission */}
      <div style={{ flex: 1, background: 'url(/forest-bg.jpg) center/cover', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(45,90,39,0.7)', padding: '2rem', borderRadius: '16px', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '2rem', fontWeight: 'bold' }}>مهمتنا</h1>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
            تمكين الجميع من النمو الذكي في عالم النباتات عبر المعرفة والتقنيات الحديثة.
          </p>
        </div>
      </div>
      {/* Right Side: Login Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF9F3' }}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: '#FFF9F3', borderRadius: '16px', boxShadow: '0 4px 24px rgba(45,90,39,0.08)', padding: '2rem', minWidth: '340px', fontFamily: 'Plus Jakarta Sans', color: '#2D5A27' }}
        >
          <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem' }}>تسجيل الدخول للإدارة</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} />
                البريد الإلكتروني
              </label>
              <input {...register('email')} type="email" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #2D5A27', marginTop: '0.5rem' }} />
              {errors.email && <span style={{ color: '#E2725B', fontSize: '0.9rem' }}>{errors.email.message}</span>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} />
                كلمة المرور
              </label>
              <input {...register('password')} type="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #2D5A27', marginTop: '0.5rem' }} />
              {errors.password && <span style={{ color: '#E2725B', fontSize: '0.9rem' }}>{errors.password.message}</span>}
            </div>
            <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#2D5A27', color: '#FFF9F3', fontWeight: 'bold', fontSize: '1rem', border: 'none', position: 'relative' }}>
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="spinner" style={{ marginRight: '0.5rem', border: '4px solid #E2725B', borderRadius: '50%', width: '20px', height: '20px', borderTop: '4px solid #FFF9F3', animation: 'spin 1s linear infinite', display: 'inline-block' }}></span>
                  جاري التحقق...
                </span>
              ) : 'دخول'}
            </button>
          </form>
        </motion.div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap');
        .spinner {
          border: 4px solid #E2725B;
          border-top: 4px solid #FFF9F3;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
