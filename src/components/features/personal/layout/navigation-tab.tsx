'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';
import { Bookmark, LogOut, ScrollText, Settings } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const navigationItems = [
  {
    href: RouteConstant.personal_bookmark,
    label: 'Bookmark',
    icon: Bookmark,
    badge: 5,
  },
  {
    href: RouteConstant.personal_transaction,
    label: 'Transaction',
    icon: ScrollText,
    badge: 2,
  },
  {
    href: RouteConstant.personal_account,
    label: 'Account',
    icon: Settings,
  },
];

export default function PersonalNavigationTab() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.clear();
  };

  return (
    <Card className="flex h-fit min-w-[320px] flex-col gap-6 rounded-lg bg-white pb-4 pt-5">
      <CardHeader className="px-4 py-0">
        <div className="relative flex items-center gap-3">
          <div className="relative h-[40px] w-[40px] rounded-full bg-[url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center">
            <span className="absolute bottom-0 right-0 h-[12px] w-[12px] rounded-full border-2 border-white bg-green-500"></span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700">Đinh Minh Tú</h3>
            <h3 className="text-sm text-gray-500">saigonito@gmail.com</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4 py-0">
        {navigationItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center justify-between rounded-lg border border-none px-3 py-2 font-semibold transition-colors',
              'hover:bg-primary-5 hover:text-primary-button',
              {
                'bg-primary-5 text-primary-button': pathname === item.href,
                'text-gray-700': pathname !== item.href,
              },
            )}
          >
            <div className="flex items-center gap-2">
              <item.icon className="h-5 w-5" />
              <span className="text-base">{item.label}</span>
            </div>
            {item.badge && (
              <Badge variant="blue" size="sm" shape="rounded" className="bg-primary-20 text-primary-button">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
        <Button
          variant="ghost"
          className={cn(
            'flex items-center justify-start rounded-lg px-3 py-2 font-semibold text-gray-700 transition-colors',
            'hover:bg-primary-5 hover:text-primary-button',
          )}
        >
          <LogOut className="!h-5 !w-5" />
          <span className="text-base" onClick={handleLogout}>
            Logout
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
