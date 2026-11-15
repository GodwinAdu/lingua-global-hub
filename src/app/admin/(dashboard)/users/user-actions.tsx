'use client';

import { useState, useTransition } from 'react';
import { KeyRound, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteUser, resetUserPassword, type CredentialsState } from './actions';
import { CredentialsPanel } from './credentials-panel';

/** Per-user menu: reset password (shows the new one once) and delete. */
export function UserActions({ userId, name, email, loginUrl, disabled }: { userId: string; name: string; email: string; loginUrl: string; disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState<'reset' | 'delete' | null>(null);
  const [credentials, setCredentials] = useState<CredentialsState>(undefined);

  const runReset = () =>
    start(async () => {
      const r = await resetUserPassword(userId);
      setConfirm(null);
      if (r?.error) toast.error(r.error);
      else setCredentials(r);
    });

  const runDelete = () =>
    start(async () => {
      const r = await deleteUser(userId);
      setConfirm(null);
      if (r?.error) toast.error(r.error);
      else if (r?.success) toast.success(r.success);
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={disabled || pending} aria-label={`Actions for ${name}`}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setConfirm('reset')}>
            <KeyRound className="h-4 w-4" /> Reset password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirm('delete')} className="text-destructive focus:text-destructive">
            <Trash2 className="h-4 w-4" /> Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm === 'delete' ? `Delete ${name}?` : `Reset ${name}'s password?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === 'delete'
                ? `${email} will no longer be able to sign in. Posts they wrote stay on the site. This can't be undone.`
                : 'Their current password stops working. You get a new temporary password to send them, and they must choose their own when they sign in.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                if (confirm === 'delete') runDelete();
                else runReset();
              }}
              className={confirm === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : undefined}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {confirm === 'delete' ? 'Delete user' : 'Reset password'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={Boolean(credentials?.password)} onOpenChange={(o) => !o && setCredentials(undefined)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New password for {name}</DialogTitle>
            <DialogDescription>Send these details to them.</DialogDescription>
          </DialogHeader>
          {credentials?.password && (
            <CredentialsPanel name={credentials.name!} email={credentials.email!} password={credentials.password} loginUrl={loginUrl} />
          )}
          <Button type="button" variant="ghost" onClick={() => setCredentials(undefined)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
