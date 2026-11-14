# Supabase setup (dashboard, auth and roles)

One-time steps in the Supabase dashboard. Do them in order.

## 1. Environment variables

In `.env.local` (and later in Vercel > Settings > Environment Variables):

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings > API Keys > Publishable key (`sb_publishable_...`) |
| `SUPABASE_SECRET_KEY` | Project Settings > API Keys > Secret keys (`sb_secret_...`). **Server-only.** Needed to invite users and change roles. |

Never put real values in `.env.example`; that file is committed.

## 2. Run the database migration

SQL Editor > New query > paste the contents of
`supabase/migrations/20261114000001_auth_roles.sql` > Run.

It creates the `app_role` enum, the `profiles` table, row-level security policies and the triggers that create a profile for every new user.

Check it worked by running this in a new query. You should see one row per existing user, with `role` empty:

```sql
select email, role from public.profiles;
```

Then open Advisors > Security Advisor and confirm it reports no errors for `profiles`.

## 3. Auth URL settings

Authentication > URL Configuration:

- **Site URL**: your production URL, e.g. `https://firstgradelingua.com`
- **Redirect URLs**: add
  - `http://localhost:3000/**`
  - `https://<your-production-domain>/**`
  - `https://*-<your-vercel-team>.vercel.app/**` (optional, for preview deploys)

## 4. Turn off public sign-up

Authentication > Sign In / Providers > **Allow new users to sign up: off**.

Staff are added by invitation from the dashboard, which still works with sign-up off. New accounts get no role (no access) until a super admin grants one.

## 5. Custom SMTP, then email templates

**Set up custom SMTP first.** Since June 2026, new Free-plan projects on Supabase's default email service can't edit email templates, and the default service only sends a few emails per hour. Authentication > Emails > SMTP Settings:

- Host `smtp.gmail.com`, port `587`
- Username: the Gmail address, password: a Gmail [app password](https://myaccount.google.com/apppasswords) (the same one as `EMAIL_PASS`)
- Sender email: the Gmail address, sender name: `First Grade Lingua Consult`

Then Authentication > Emails > Templates. Replace the link in these two templates so it goes through the app's `/auth/confirm` route. Invites won't work without this: the default invite link puts the session in the URL fragment, which the server can't read.

**Invite user**

```html
<h2>You have been invited</h2>
<p>You have been invited to the First Grade Lingua Consult dashboard.</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/admin/set-password">Accept the invite and set your password</a></p>
```

**Reset password**

```html
<h2>Reset your password</h2>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/set-password">Set a new password</a></p>
```

## 6. Create the first super admin

1. Authentication > Users > **Add user > Create new user**. Enter the email and a password, and tick **Auto confirm user**.
2. SQL Editor, replacing the email:

   ```sql
   update public.profiles set role = 'super_admin' where email = 'you@example.com';
   ```

3. Sign in at `/admin/login`. Invite everyone else from **Users & roles**.

## Roles

| Role | Can do |
|---|---|
| Super admin | Everything, including users, roles and site settings |
| Admin | All content, ebooks, pricing and orders |
| Editor | Create, edit and publish all posts, news and site pages |
| Author | Write drafts and edit only their own posts |

Rules enforced in code: you can't change your own role, and the last super admin can't be demoted.
