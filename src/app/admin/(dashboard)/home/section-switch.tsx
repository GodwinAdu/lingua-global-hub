'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { setHomeSectionVisible } from '../site/actions';

export function SectionSwitch({ sectionKey, name, visible }: { sectionKey: string; name: string; visible: boolean }) {
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <Switch
        checked={visible}
        disabled={pending}
        aria-label={`Show ${name} on the home page`}
        onCheckedChange={(checked) =>
          start(async () => {
            const r = await setHomeSectionVisible(sectionKey, checked);
            if (r?.error) toast.error(r.error);
            else if (r?.success) toast.success(r.success);
          })
        }
      />
      <span className="w-12">{visible ? 'Shown' : 'Hidden'}</span>
    </label>
  );
}
