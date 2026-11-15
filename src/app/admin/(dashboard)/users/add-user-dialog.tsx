'use client';

import { useActionState, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, type Role } from '@/lib/roles';
import { createUser, type CredentialsState } from './actions';
import { CredentialsPanel } from './credentials-panel';

export function AddUserDialog({ disabled, loginUrl }: { disabled?: boolean; loginUrl: string }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function onOpenChange(next: boolean) {
    setOpen(next);
    // A fresh form each time: the previous person's password is never shown again.
    if (!next) setFormKey((k) => k + 1);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <UserPlus className="h-4 w-4" /> Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AddUserForm key={formKey} loginUrl={loginUrl} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AddUserForm({ loginUrl, onDone }: { loginUrl: string; onDone: () => void }) {
  const [role, setRole] = useState<Role>('author');
  const [state, action] = useActionState<CredentialsState, FormData>(createUser, undefined);

  if (state?.password) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Account created</DialogTitle>
          <DialogDescription>Send these details to {state.name}.</DialogDescription>
        </DialogHeader>
        <CredentialsPanel name={state.name!} email={state.email!} password={state.password} loginUrl={loginUrl} />
        <Button type="button" variant="ghost" onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add a staff member</DialogTitle>
        <DialogDescription>A temporary password is generated for you to send them. No email is needed.</DialogDescription>
      </DialogHeader>
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="add-name">Full name</Label>
          <Input id="add-name" name="fullName" maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="add-email">Email</Label>
          <Input id="add-email" name="email" type="email" required />
          <p className="text-xs text-muted-foreground">They sign in with this email.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="add-role">Role</Label>
          <input type="hidden" name="role" value={role} />
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger id="add-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
        </div>
        {state?.error && <FormMessage state={state} />}
        <SubmitButton className="w-full" pendingText="Creating…">
          Create account
        </SubmitButton>
      </form>
    </>
  );
}
