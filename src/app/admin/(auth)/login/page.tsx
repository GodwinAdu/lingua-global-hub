import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Sign in to the dashboard</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Staff accounts only.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
