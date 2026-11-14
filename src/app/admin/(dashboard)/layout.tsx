import { Suspense } from 'react';
import { requireStaff } from '@/lib/auth';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

// The dashboard reads the session on every request, so it is never prerendered.
export const instant = false;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  return (
    <SidebarProvider>
      <AdminSidebar
        user={{ email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role }}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">First Grade Lingua Consult</span>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 border-r bg-sidebar p-4 md:block">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
