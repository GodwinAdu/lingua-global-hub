'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROLE_LABELS, ROLES, type Role } from '@/lib/roles';
import { updateUserRole } from './actions';

export function RoleSelect({ userId, role, disabled }: { userId: string; role: Role | null; disabled?: boolean }) {
  const [pending, startTransition] = useTransition();

  function onChange(value: string) {
    startTransition(async () => {
      const result = await updateUserRole(userId, value);
      if (result?.error) toast.error(result.error);
      else if (result?.success) toast.success(result.success);
    });
  }

  return (
    <Select value={role ?? 'none'} onValueChange={onChange} disabled={disabled || pending}>
      <SelectTrigger aria-label="Role">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value="none">No access</SelectItem>
      </SelectContent>
    </Select>
  );
}
