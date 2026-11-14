import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { signOut } from '../actions';

export const metadata: Metadata = { title: 'No access' };

export default function NoAccessPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">No dashboard access</h1>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">
        You&apos;re signed in, but your account hasn&apos;t been given a role yet. Ask a super admin to grant you
        access, then sign in again.
      </p>
      <form action={signOut}>
        <Button type="submit" variant="outline" className="w-full">
          Sign out
        </Button>
      </form>
    </>
  );
}
