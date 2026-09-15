'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Store } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    setLoading(true);

    try {
      await login(email, password);

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (currentUser.role === 'admin') {
        router.push('/dashboard');
      } else if (currentUser.role === 'cashier') {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto px-6 py-10">
      {/* CARD */}

      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        {/* HEADER */}

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg">
            <Store size={32} className="text-[#111111]" />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-[#111111]">Welcome Back</h1>

          <p className="mt-2 text-neutral-500">Sign In To Continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* INPUT COMPONENT STYLE */}

          <div>
            <label className="mb-2 block text-sm font-semibold">Email Address</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/20"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}

                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 pr-12 outline-none transition focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {' '}
            <label className="flex items-center gap-2 text-sm">
              {' '}
              <input type="checkbox" /> Remember Me{' '}
            </label>{' '}
            <Link href="/forgot-password" className="text-sm text-[#25D366]">
              {' '}
              Forgot Password?{' '}
            </Link>{' '}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#25D366] py-3 font-bold text-[#111111] shadow-lg shadow-[#25D366]/30 transition hover:scale-[1.02]"
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
