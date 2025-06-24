'use client';

import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';
import {
  Bell,
  Book,
  FileText,
  LayoutGrid,
  LogOut,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  User,
} from 'lucide-react';

import { logout } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/sidebar';

const NAV_ITEMS = {
  General: [
    { label: 'Dashboard', icon: LayoutGrid, href: RouteConstant.admin_dashboard },
    { label: 'User', icon: User, href: RouteConstant.admin_user },
    { label: 'Role', icon: ShieldCheck, href: RouteConstant.admin_role },
  ],
  Functions: [
    { label: 'Tour', icon: MapPin, href: RouteConstant.admin_tour },
    { label: 'Order', icon: ShoppingCart, href: RouteConstant.admin_order },
    { label: 'Article', icon: Book, href: RouteConstant.admin_article },
    { label: 'Notification', icon: Bell, href: RouteConstant.admin_notification },
    { label: 'Report', icon: FileText, href: RouteConstant.admin_report },
    { label: 'Chatbot', icon: MessageCircle, href: RouteConstant.admin_chatbot },
  ],
} as const;

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const userName = 'dirtylesc';
  const userEmail = 'dirtylesc@gmail.com';

  const handleLogout = () => {
    logout();
    router.push(RouteConstant.home);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-fit !py-2 group-data-[collapsible=icon]:!px-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/avatar.jpg" alt={userName} />
                <AvatarFallback>SN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(NAV_ITEMS).map(([section, items]) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>
            <SidebarGroupContent className="flex list-none flex-col gap-2">
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      className={cn({
                        'bg-primary-500 text-sidebar-primary-foreground hover:bg-primary-500 hover:text-sidebar-primary-foreground':
                          pathname === item.href,
                      })}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenuItem className="cursor-pointer list-none">
          <SidebarMenuButton onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
