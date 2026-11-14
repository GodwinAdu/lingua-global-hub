'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { changePassword, updateProfile } from './actions';

export function ProfileForm({ fullName, jobTitle }: { fullName: string; jobTitle: string }) {
  const [state, formAction] = useActionState(updateProfile, undefined);
  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName} maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job title</Label>
        <Input id="jobTitle" name="jobTitle" defaultValue={jobTitle} maxLength={120} placeholder="e.g. Senior Editor" />
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Save profile</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Change password</SubmitButton>
    </form>
  );
}
