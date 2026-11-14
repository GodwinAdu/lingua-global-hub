'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { setPassword } from '../actions';

// Reached from an invite or password-reset email via /auth/confirm, which signs the user in first.
export default function SetPasswordPage() {
  const [state, formAction] = useActionState(setPassword, undefined);

  return (
    <>
      <h1 className="text-xl font-semibold">Set your password</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Use at least 8 characters.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        <FormMessage state={state} />
        <SubmitButton className="w-full" pendingText="Saving…">
          Save password
        </SubmitButton>
      </form>
    </>
  );
}
