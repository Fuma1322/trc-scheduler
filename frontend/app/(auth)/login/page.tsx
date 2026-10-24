'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LockKeyhole, Mail, Eye, EyeOff } from 'lucide-react';

type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      ).replace(/\/+$/, '');

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.message || 'Login failed. Check your credentials.');
      }

      // Store the token for subsequent authenticated admin requests.
      localStorage.setItem('trc_admin_token', result.token);

      if (result.admin) {
        localStorage.setItem('trc_admin', JSON.stringify(result.admin));
      }

      router.replace('/dashboard');
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Unable to connect to the server. Check that the backend is running and the API URL is correct.'
          : err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064E3B] text-white">
            <LockKeyhole size={26} />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">
            TRC Hall
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#17201C]">
            Admin sign in
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#66736C]">
            Sign in with your authorised administrator account to manage hall
            bookings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E4E9E4] bg-white p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#17201C]"
            >
              Email address
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A958F]"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-[#DDE5DF] py-3 pl-10 pr-4 text-sm text-[#17201C] outline-none transition focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#17201C]"
            >
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A958F]"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#DDE5DF] py-3 pl-10 pr-12 text-sm text-[#17201C] outline-none transition focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736C]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#075F48] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-[#8A958F]">
            Administrator access only. Public booking customers do not need to
            sign in here.
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#047857] hover:underline"
          >
            Return to the website
          </Link>
        </div>
      </div>
    </main>
  );
}
