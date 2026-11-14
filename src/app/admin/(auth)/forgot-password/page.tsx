'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { requestPasswordReset } from '../actions';

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, undefined);

  return (
    <>
      <h1 className="text-xl font-semibold">Reset your password</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">We&apos;ll email you a link to set a new one.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <FormMessage state={state} />
        <SubmitButton className="w-full" pendingText="Sending…">
          Send reset link
        </SubmitButton>
      </form>
      <Link href="/admin/login" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">
        Back to sign in
      </Link>
    </>
  );
}
