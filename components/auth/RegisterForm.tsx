'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Store } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterForm() {
  const { register } = useAuth();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');

      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,

        email: form.email,

        password: form.password,

        role: 'admin',
      });

      router.push('/login');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-[#25D366]/10 px-6 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg">
            <Store size={32} className="text-[#111111]" />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-[#111111]">Create Account</h1>

          <p className="mt-2 text-neutral-500">Setup your POS administrator account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold">Full Name</label>

            <input
              required

              value={form.name}

              onChange={(e) => updateField('name', e.target.value)}

              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/20"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-semibold">Email Address</label>

            <input
              type="email"

              required

              value={form.email}

              onChange={(e) => updateField('email', e.target.value)}

              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/20"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}

                required

                value={form.password}

                onChange={(e) => updateField('password', e.target.value)}

                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 pr-12 outline-none focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/20"
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

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-semibold">Confirm Password</label>

            <input
              type="password"

              required

              value={form.confirmPassword}

              onChange={(e) => updateField('confirmPassword', e.target.value)}

              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/20"
            />
          </div>

          <button
            disabled={loading}

            type="submit"

            className="w-full rounded-2xl bg-[#25D366] py-3 font-bold text-[#111111] shadow-lg shadow-[#25D366]/30 transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-neutral-600">
            Already have an account?
            <Link href="/login" className="ml-1 font-bold text-[#25D366]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
