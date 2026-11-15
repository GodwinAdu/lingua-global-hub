'use client';

import { useActionState, useEffect, useState } from 'react';
import { ImageField } from '@/components/admin/image-field';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/admin/submit-button';
import type { SiteSettings } from '@/lib/content/site-types';
import { saveSettings } from '../site/actions';

type FieldProps = {
  name: keyof SiteSettings;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, undefined);
  const [shareImage, setShareImage] = useState(settings.default_share_image_url ?? '');
  const err = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact details</CardTitle>
          <CardDescription>Shown in the footer and on the Contact page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <SettingField settings={settings} errors={err} name="email" label="Email" type="email" />
          <SettingField settings={settings} errors={err} name="whatsapp" label="WhatsApp number" placeholder="233242178378" hint="Country code and number, digits only. Used by the WhatsApp buttons." />
          <SettingField settings={settings} errors={err} name="phone_primary" label="Main phone" placeholder="+233 24 217 8378" />
          <SettingField settings={settings} errors={err} name="phone_secondary" label="Second phone" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Office</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SettingField settings={settings} errors={err} name="address" label="Address" textarea />
          </div>
          <SettingField settings={settings} errors={err} name="po_box" label="P.O. Box" />
          <SettingField settings={settings} errors={err} name="digital_address" label="Ghana Post digital address" placeholder="GM-244-5169" />
          <div className="sm:col-span-2">
            <SettingField settings={settings} errors={err} name="working_hours" label="Working hours" textarea hint="One line per day range, e.g. Monday - Friday: 9AM - 6PM" />
          </div>
          <SettingField settings={settings} errors={err} name="map_lat" label="Map latitude" placeholder="5.7507" hint="From Google Maps: right-click your office and copy the numbers." />
          <SettingField settings={settings} errors={err} name="map_lng" label="Map longitude" placeholder="-0.0977" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social media</CardTitle>
          <CardDescription>Icons appear in the footer only for links you fill in.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <SettingField settings={settings} errors={err} name="facebook_url" label="Facebook" type="url" placeholder="https://facebook.com/…" />
          <SettingField settings={settings} errors={err} name="instagram_url" label="Instagram" type="url" placeholder="https://instagram.com/…" />
          <SettingField settings={settings} errors={err} name="twitter_url" label="X (Twitter)" type="url" placeholder="https://x.com/…" />
          <SettingField settings={settings} errors={err} name="linkedin_url" label="LinkedIn" type="url" placeholder="https://linkedin.com/company/…" />
          <SettingField settings={settings} errors={err} name="youtube_url" label="YouTube" type="url" placeholder="https://youtube.com/@…" />
          <SettingField settings={settings} errors={err} name="tiktok_url" label="TikTok" type="url" placeholder="https://tiktok.com/@…" />
        </CardContent>
      </Card>

      <Card id="search">
        <CardHeader>
          <CardTitle className="text-base">Search engines</CardTitle>
          <CardDescription>Helps Google show the business correctly and lets you prove you own the site.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SettingField settings={settings} errors={err} name="business_description" label="Business description" textarea hint="One or two sentences about what the business does and where. Used in Google's business information." />
          </div>
          <SettingField settings={settings} errors={err} name="google_site_verification" label="Google Search Console code" hint="Search Console → Add property → HTML tag. Paste the code or the whole tag." />
          <SettingField settings={settings} errors={err} name="bing_site_verification" label="Bing Webmaster code" hint="Optional. Paste the code or the whole tag." />
          <SettingField settings={settings} errors={err} name="founded_year" label="Year founded" placeholder="e.g. 2015" />
          <div className="space-y-2 sm:col-span-2">
            <Label>Default share image</Label>
            <input type="hidden" name="default_share_image_url" value={shareImage} />
            <ImageField value={shareImage} onChange={setShareImage} folder="seo" aspect="aspect-[1200/630]" className="max-w-md" label="Upload 1200×630 image" />
            <p className="text-xs text-muted-foreground">Used for pages without their own image. Without one, a branded card is generated.</p>
            {err.default_share_image_url && <p className="text-sm text-destructive">{err.default_share_image_url}</p>}
          </div>
        </CardContent>
      </Card>

      <SubmitButton pendingText="Saving…">Save settings</SubmitButton>
    </form>
  );
}

function SettingField({
  name,
  label,
  hint,
  placeholder,
  type = 'text',
  textarea,
  settings,
  errors,
}: FieldProps & { settings: SiteSettings; errors: Record<string, string> }) {
  const error = errors[name];
  const raw = settings[name];
  const value = Array.isArray(raw) ? raw.join('\n') : raw == null ? '' : String(raw);
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {textarea ? (
        <Textarea id={name} name={name} defaultValue={value} rows={3} placeholder={placeholder} />
      ) : (
        <Input id={name} name={name} type={type} defaultValue={value} placeholder={placeholder} />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
