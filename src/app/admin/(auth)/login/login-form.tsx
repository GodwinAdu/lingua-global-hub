'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { signIn } from '../actions';

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, undefined);
  const searchParams = useSearchParams();

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={searchParams.get('next') ?? '/admin'} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/admin/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
            Forgot password?
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <FormMessage
        state={
          state ??
          (searchParams.get('error') === 'link'
            ? { error: 'That link is invalid or has expired. Request a new one.' }
            : searchParams.get('error') === 'removed'
              ? { error: 'Your account was removed. Contact a site administrator if this is a mistake.' }
              : undefined)
        }
      />
      <SubmitButton className="w-full" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
