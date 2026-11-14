'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Receipt, Briefcase, FolderOpen, Quote, Settings, UsersRound, ChevronsUpDown, ExternalLink, Globe, LayoutDashboard, LogOut, Newspaper, Tags, UserCog, Users, type LucideIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { hasRole, ROLE_LABELS, type Role } from '@/lib/roles';
import { signOut } from '@/app/admin/(auth)/actions';

type NavItem = { title: string; href: string; icon: LucideIcon; minRole: Role };

// Visibility only. Every page and Server Action re-checks the role on the server.
const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ title: 'Dashboard', href: '/admin', icon: LayoutDashboard, minRole: 'author' }],
  },
  {
    label: 'Content',
    items: [
      { title: 'Posts & news', href: '/admin/posts', icon: Newspaper, minRole: 'author' },
      { title: 'Categories', href: '/admin/categories', icon: Tags, minRole: 'editor' },
    ],
  },
  {
    label: 'Website',
    items: [
      { title: 'Services', href: '/admin/services', icon: Briefcase, minRole: 'editor' },
      { title: 'Team', href: '/admin/team', icon: UsersRound, minRole: 'editor' },
      { title: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen, minRole: 'editor' },
      { title: 'Testimonials', href: '/admin/testimonials', icon: Quote, minRole: 'editor' },
    ],
  },
  {
    label: 'Shop',
    items: [
      { title: 'Ebooks', href: '/admin/ebooks', icon: BookOpen, minRole: 'admin' },
      { title: 'Orders', href: '/admin/orders', icon: Receipt, minRole: 'admin' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { title: 'Users & roles', href: '/admin/users', icon: Users, minRole: 'super_admin' },
      { title: 'Site settings', href: '/admin/settings', icon: Settings, minRole: 'super_admin' },
    ],
  },
];

export type SidebarUser = { email: string; fullName: string | null; avatarUrl: string | null; role: Role };

export function AdminSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const name = user.fullName || user.email;
  const initials = name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Globe className="size-4" />
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">First Grade Lingua</span>
                  <span className="truncate text-xs text-muted-foreground">Content dashboard</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => {
          const items = group.items.filter((item) => hasRole(user.role, item.minRole));
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/account">
                    <UserCog /> Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink /> View website
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full">
                      <LogOut /> Sign out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
