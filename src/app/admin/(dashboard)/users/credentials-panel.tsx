'use client';

import { useState } from 'react';
import { Check, Copy, KeyRound, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Shows a generated password once, with copy buttons. Nothing is stored: after closing,
 * the only way to get a working password is "Reset password".
 */
export function CredentialsPanel({ name, email, password, loginUrl }: { name: string; email: string; password: string; loginUrl: string }) {
  const [copied, setCopied] = useState<'password' | 'message' | null>(null);
  const message = `Hello ${name},\n\nYour First Grade Lingua dashboard account is ready.\n\nSign in: ${loginUrl}\nEmail: ${email}\nTemporary password: ${password}\n\nYou'll be asked to choose your own password when you first sign in.`;

  const copy = async (what: 'password' | 'message') => {
    await navigator.clipboard.writeText(what === 'password' ? password : message);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/40 p-4">
        <div className="text-xs text-muted-foreground">Email</div>
        <div className="font-medium break-all">{email}</div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5" /> Temporary password
        </div>
        <div className="flex items-center justify-between gap-2">
          <code className="select-all break-all font-mono text-lg tracking-wide" data-testid="generated-password">
            {password}
          </code>
          <Button type="button" size="sm" variant="outline" onClick={() => copy('password')}>
            {copied === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => copy('message')}>
          {copied === 'message' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy message to send
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" /> Send on WhatsApp
          </a>
        </Button>
      </div>
      <p className="text-sm text-amber-700">
        Copy it now: this password won&apos;t be shown again. They&apos;ll choose their own password the first time they sign in.
      </p>
    </div>
  );
}
