// Shared by server and client code. Order matches the `app_role` enum in Postgres.
export const ROLES = ['author', 'editor', 'admin', 'super_admin'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  author: 'Author',
  editor: 'Editor',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  author: 'Writes drafts and edits their own posts. An editor publishes them.',
  editor: 'Creates, edits and publishes all posts, news and site pages.',
  admin: 'All content, plus ebooks, pricing and orders.',
  super_admin: 'Everything, including users, roles and site settings.',
};

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

/** True when `role` is at least `required` in the hierarchy. */
export function hasRole(role: Role | null | undefined, required: Role): boolean {
  if (!role) return false;
  return ROLES.indexOf(role) >= ROLES.indexOf(required);
}
