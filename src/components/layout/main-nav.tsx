'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  Ticket,
  CircleDollarSign,
  Shield,
  FilePenLine,
  Megaphone,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
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
import { AppLogo } from '@/components/app-logo';
import { useAuth } from '@/firebase';
import { useUserRole } from '@/hooks/use-user-role';

const studentMenuItems = [
    { href: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/outpass', label: 'Outpass', icon: Ticket },
    { href: '/fees', label: 'Fees', icon: CircleDollarSign },
    { href: '/complaints', label: 'My Complaints', icon: FilePenLine },
    { href: '/feedback/submit', label: 'Submit Feedback', icon: Megaphone },
];
  
const securityMenuItems = [
    { href: '/security-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/security', label: 'Security Desk', icon: Shield },
];
  
const adminMenuItems = [
    { href: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/rooms', label: 'Rooms', icon: BedDouble },
    { href: '/outpass', label: 'Outpass', icon: Ticket },
    { href: '/fees', label: 'Fees', icon: CircleDollarSign },
    { href: '/security', label: 'Security', icon: Shield },
    { href: '/complaints', label: 'Complaints', icon: FilePenLine },
    { href: '/feedback', label: 'Feedback', icon: Megaphone },
    { href: '/announcements', label: 'Announcements', icon: Bell },
];

export function MainNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, role } = useUserRole();

  let menuItems = [];
  if (role === 'admin') {
    menuItems = adminMenuItems;
  } else if (role === 'security') {
    menuItems = securityMenuItems;
  } else if (role === 'student') {
    menuItems = studentMenuItems;
  }


  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-md p-2 w-full text-left hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                <AvatarFallback>{user?.displayName?.[0] ?? user?.email?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="font-medium text-sm truncate">{user?.displayName ?? 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName ?? 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
