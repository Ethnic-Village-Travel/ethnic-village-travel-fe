'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';
import { Bookmark, LogOut, ScrollText, Settings } from 'lucide-react';

import { logout } from '@/lib/auth';
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
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push(RouteConstant.home);
  };

  return (
    <Card className="h-fit w-full rounded-lg border shadow-md">
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </CardHeader>
      <CardContent className="space-y-2">
        {navigationItems.map(item => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 font-semibold text-gray-700 transition-colors',
                  'hover:bg-primary-5 hover:text-primary-button',
                  {
                    'bg-primary-5 text-primary-button': isActive,
                  },
                )}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="!h-5 !w-5" />
                  <span className="text-base">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="outline" className="h-5 w-5 rounded-full p-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}

        <Button
          variant="ghost"
          className={cn(
            'flex items-center justify-start rounded-lg px-3 py-2 font-semibold text-gray-700 transition-colors',
            'hover:bg-primary-5 hover:text-primary-button',
          )}
          onClick={handleLogout}
        >
          <LogOut className="!h-5 !w-5" />
          <span className="text-base">Logout</span>
        </Button>
      </CardContent>
    </Card>
  );
}
