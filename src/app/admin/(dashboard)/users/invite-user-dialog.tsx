'use client';

import { useActionState, useState } from "react";
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormMessage, SubmitButton } from '@/components/admin/submit-button';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, type Role } from '@/lib/roles';
import { inviteUser } from './actions';

export function InviteUserDialog({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("author");
  const [state, formAction] = useActionState(async (prev: Awaited<ReturnType<typeof inviteUser>>, formData: FormData) => {
    const result = await inviteUser(prev, formData);
    if (result?.success) {
      toast.success(result.success);
      setOpen(false);
    }
    return result;
  }, undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <UserPlus className="h-4 w-4" /> Invite user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a staff member</DialogTitle>
          <DialogDescription>They&apos;ll get an email with a link to set their password.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-name">Full name</Label>
            <Input id="invite-name" name="fullName" maxLength={120} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input id="invite-email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select name="role" value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="invite-role">
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
            <p className="text-xs text-muted-foreground">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>
          {state?.error && <FormMessage state={state} />}
          <SubmitButton className="w-full" pendingText="Sending invite…">
            Send invite
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
