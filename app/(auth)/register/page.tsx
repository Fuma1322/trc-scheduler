import RegisterForm from '@/components/auth/RegisterForm';
import React from 'react';

export default function page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <RegisterForm />
    </div>
  );
}
