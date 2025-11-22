'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { BookmarkStatus } from '@/core/enum/bookmark.enum';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { cn, getInitialName } from '@/utils';
import { Bookmark, LogOut, ScrollText, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { logout } from '@/libs/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PersonalNavigationTab() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('personal.navigation');
  const { user } = useAuthStore();
  const { details } = useUserStore();

  const firstName = useMemo(() => user?.personal?.firstName || '', [user]);
  const lastName = useMemo(() => user?.personal?.lastName || '', [user]);

  const navigationItems = useMemo(
    () => [
      {
        href: RouteConstant.personal_bookmark,
        label: t('bookmark'),
        icon: Bookmark,
        badge: details?.bookmarks?.filter(b => b.status === BookmarkStatus.ACTIVE).length || 0,
      },
      {
        href: RouteConstant.personal_transaction,
        label: t('transaction'),
        icon: ScrollText,
        badge: details?.pendingPaymentBookingsCount || 0,
      },
      {
        href: RouteConstant.personal_account,
        label: t('account'),
        icon: Settings,
      },
    ],
    [details?.bookmarks, details?.pendingPaymentBookingsCount],
  );

  const handleLogout = () => {
    logout();
    router.push(RouteConstant.home);
  };

  return (
    <Card className="sticky top-24 w-full rounded-lg border shadow-md">
      <CardHeader className="flex flex-row gap-4 space-y-0">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={user?.personal?.avatar} alt={[firstName, lastName].filter(Boolean).join(' ') || 'User'} />
          <AvatarFallback className="rounded-lg text-primary">
            {getInitialName(firstName, lastName) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-gray-900">{`${firstName} ${lastName}`}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
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
                  'mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 font-semibold text-gray-700 transition-colors',
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
                  <Badge
                    variant="outline"
                    className="flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
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
            'flex w-full items-center justify-start rounded-lg px-3 py-2 font-semibold text-gray-700 transition-colors',
            'hover:bg-primary-5 hover:text-primary-button',
          )}
          onClick={handleLogout}
        >
          <LogOut className="mr-3 !h-5 !w-5" />
          <span className="text-base">{t('logout')}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
