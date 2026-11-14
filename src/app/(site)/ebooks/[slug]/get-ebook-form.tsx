'use client';

import { useActionState } from 'react';
import { Download, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/admin/submit-button';
import { getEbookAction } from '../actions';

export function GetEbookForm({ slug, priceLabel, isFree }: { slug: string; priceLabel: string; isFree: boolean }) {
  const [state, action] = useActionState(getEbookAction, undefined);

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
      <input type="hidden" name="slug" value={slug} />
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Price</span>
        <span className="font-display text-3xl font-bold">{priceLabel}</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Your email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <p className="text-xs text-muted-foreground">
          {isFree ? 'We send your download link here.' : 'Your receipt and download link are sent here.'} No account
          needed.
        </p>
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <SubmitButton size="lg" className="w-full" pendingText={isFree ? 'Preparing…' : 'Opening secure checkout…'}>
        {isFree ? (
          <>
            <Download className="h-4 w-4" /> Get free ebook
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Buy for {priceLabel}
          </>
        )}
      </SubmitButton>
      {!isFree && (
        <p className="text-center text-xs text-muted-foreground">
          Pay securely with Mobile Money or card through Paystack.
        </p>
      )}
    </form>
  );
}
