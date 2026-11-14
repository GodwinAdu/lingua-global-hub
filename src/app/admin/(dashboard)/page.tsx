import type { Metadata } from 'next';
import { ShieldAlert } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/lib/roles';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Overview' };

export default async function DashboardPage({ searchParams }: PageProps<'/admin'>) {
  const [user, params] = await Promise.all([requireStaff(), searchParams]);
  const firstName = user.fullName?.split(' ')[0];

  return (
    <div className="max-w-4xl space-y-6">
      {params.denied && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Not allowed</AlertTitle>
          <AlertDescription>Your role doesn&apos;t give you access to that page.</AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-2xl font-bold">Welcome{firstName ? `, ${firstName}` : ''}</h1>
        <p className="text-muted-foreground">Manage the First Grade Lingua Consult website from here.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Your role</CardTitle>
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          </div>
          <CardDescription>{ROLE_DESCRIPTIONS[user.role]}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
