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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';

const studentMenuItems = [
    { href: '/student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { href: '/outpass', label: 'My Outpasses', icon: Ticket },
    { href: '/fees', label: 'My Fees', icon: CircleDollarSign },
    { href: '/complaints', label: 'My Complaints', icon: FilePenLine },
    { href: '/feedback/submit', label: 'Submit Feedback', icon: Megaphone },
];
  
const securityMenuItems = [
    { href: '/security-dashboard', label: 'Security Dashboard', icon: LayoutDashboard },
    { href: '/security', label: 'Security Desk', icon: Shield },
];
  
const adminMenuItems = [
    { href: '/admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { href: '/rooms', label: 'Rooms', icon: BedDouble },
    { href: '/outpass', label: 'All Outpasses', icon: Ticket },
    { href: '/fees', label: 'All Fees', icon: CircleDollarSign },
    { href: '/security', label: 'Security Desk', icon: Shield },
    { href: '/complaints', label: 'All Complaints', icon: FilePenLine },
    { href: '/feedback', label: 'Feedback', icon: Megaphone },
    { href: '/announcements', label: 'Announcements', icon: Bell },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent className="p-0 flex flex-col">
        <SidebarGroup className="p-2">
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            {adminMenuItems.map((item) => (
              <SidebarMenuItem key={`admin-${item.href}`}>
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
        </SidebarGroup>
        <SidebarSeparator />
         <SidebarGroup className="p-2">
          <SidebarGroupLabel>Student</SidebarGroupLabel>
          <SidebarMenu>
            {studentMenuItems.map((item) => (
              <SidebarMenuItem key={`student-${item.href}`}>
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
        </SidebarGroup>
        <SidebarSeparator />
         <SidebarGroup className="p-2">
          <SidebarGroupLabel>Security</SidebarGroupLabel>
          <SidebarMenu>
            {securityMenuItems.map((item) => (
              <SidebarMenuItem key={`security-${item.href}`}>
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <p className="text-xs text-muted-foreground p-4 text-center">CampusPulse</p>
      </SidebarFooter>
    </Sidebar>
  );
}
