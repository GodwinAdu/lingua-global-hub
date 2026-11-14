import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/roles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordForm, ProfileForm } from './account-forms';

export const metadata: Metadata = { title: 'Account' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

export default async function AccountPage() {
  const user = await requireStaff();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          {user.email} · {ROLE_LABELS[user.role]}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Shown as the author on posts you write.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm fullName={user.fullName ?? ''} jobTitle={user.jobTitle ?? ''} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
