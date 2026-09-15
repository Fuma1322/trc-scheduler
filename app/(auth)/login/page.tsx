import LoginForm from '@/components/auth/LoginForm';
import React from 'react';

export default function page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <LoginForm />
    </div>
  );
}
