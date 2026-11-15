'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { setPassword } from '../actions';

// Reached from an invite/reset email (via /auth/confirm), or after signing in with a temporary
// password from a super admin (requireStaff redirects here until a new password is set).
export default function SetPasswordPage() {
  const [state, formAction] = useActionState(setPassword, undefined);

  return (
    <>
      <h1 className="text-xl font-semibold">Choose your password</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Pick a new password that only you know (at least 8 characters). The temporary one you were given stops working.
      </p>
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
