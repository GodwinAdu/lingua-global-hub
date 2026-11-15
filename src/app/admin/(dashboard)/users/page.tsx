import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isRole, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, type Role } from '@/lib/roles';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddUserDialog } from './add-user-dialog';
import { UserActions } from './user-actions';
import { absoluteUrl } from '@/lib/site';
import { RoleSelect } from './role-select';

export const metadata: Metadata = { title: 'Users & roles' };

// Per-user, permission-checked data on every visit: render on request rather than
// validating for instant client navigation (see the Next.js instant navigation guide).
export const instant = false;

type AuthInfo = { invitedAt: string | null; lastSignInAt: string | null };

export default async function UsersPage() {
  const me = await requireStaff('super_admin');
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, job_title, role, created_at, must_change_password')
    .order('created_at', { ascending: true });

  // Sign-in status comes from the Auth admin API, which needs the secret key.
  let authInfo = new Map<string, AuthInfo>();
  let adminReady = true;
  try {
    const { data, error: listError } = await createAdminClient().auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;
    authInfo = new Map(
      data.users.map((u): [string, AuthInfo] => [u.id, { invitedAt: u.invited_at ?? null, lastSignInAt: u.last_sign_in_at ?? null }]),
    );
  } catch {
    adminReady = false;
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users &amp; roles</h1>
          <p className="text-muted-foreground">Add staff, reset passwords and control what each person can do.</p>
        </div>
        <AddUserDialog disabled={!adminReady} loginUrl={absoluteUrl('/admin/login')} />
      </div>

      {!adminReady && (
        <Alert>
          <AlertTitle>Secret key not configured</AlertTitle>
          <AlertDescription>
            Add <code>SUPABASE_SECRET_KEY</code> to <code>.env.local</code> (and Vercel) to add users, reset passwords and change
            roles.
          </AlertDescription>
        </Alert>
      )}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load users</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-48">Role</TableHead>
                <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(profiles ?? []).map((p) => {
                const info = authInfo.get(p.id);
                const role: Role | null = isRole(p.role) ? p.role : null;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">
                        {p.full_name || p.email}
                        {p.id === me.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                      </div>
                      {p.full_name && <div className="text-sm text-muted-foreground">{p.email}</div>}
                    </TableCell>
                    <TableCell>
                      <StatusBadge info={info} mustChange={p.must_change_password} />
                    </TableCell>
                    <TableCell>
                      {p.id === me.id ? (
                        <Badge variant="secondary">{role ? ROLE_LABELS[role] : 'No access'}</Badge>
                      ) : (
                        <RoleSelect userId={p.id} role={role} disabled={!adminReady} />
                      )}
                    </TableCell>
                    <TableCell>
                      {p.id !== me.id && (
                        <UserActions
                          userId={p.id}
                          name={p.full_name || p.email}
                          email={p.email}
                          loginUrl={absoluteUrl('/admin/login')}
                          disabled={!adminReady}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {ROLES.map((r) => (
          <div key={r} className="rounded-lg border p-4">
            <div className="font-medium">{ROLE_LABELS[r]}</div>
            <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ info, mustChange }: { info?: AuthInfo; mustChange?: boolean }) {
  if (!info) return <span className="text-sm text-muted-foreground">—</span>;
  if (mustChange) return <Badge variant="outline">Temporary password</Badge>;
  if (info.lastSignInAt) {
    const date = new Date(info.lastSignInAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return <span className="text-sm text-muted-foreground">Last sign-in {date}</span>;
  }
  if (info.invitedAt) return <Badge variant="outline">Invite pending</Badge>;
  return <span className="text-sm text-muted-foreground">Never signed in</span>;
}
