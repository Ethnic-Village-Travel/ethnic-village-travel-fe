'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { BookmarkStatus } from '@/core/enum/bookmark.enum';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { cn, getInitialName } from '@/utils';
import {
  Heart,
  LogOut,
  Receipt,
  UserCircle,
  ChevronRight,
  Headphones,
  Menu,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { logout } from '@/libs/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PersonalNavigationTab() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('personal.navigation');
  const { user } = useAuthStore();
  const { details } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const firstName = useMemo(() => user?.personal?.firstName || '', [user]);
  const lastName = useMemo(() => user?.personal?.lastName || '', [user]);
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'User';

  const navigationItems = useMemo(
    () => [
      {
        href: RouteConstant.personal_bookmark,
        label: t('bookmark'),
        icon: Heart,
        badge: details?.bookmarks?.filter(b => b.status === BookmarkStatus.ACTIVE).length || null,
      },
      {
        href: RouteConstant.personal_transaction,
        label: t('transaction'),
        icon: Receipt,
        badge: details?.pendingPaymentBookingsCount || null,
      },
      {
        href: RouteConstant.personal_account,
        label: t('account'),
        icon: UserCircle,
      },
    ],
    [details?.bookmarks, details?.pendingPaymentBookingsCount, t],
  );

  const handleLogout = () => {
    router.push(RouteConstant.home);
    setTimeout(() => {
      logout();
    }, 0);
  };

  const isPathActive = (href: string) => {
    const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, '');
    return pathnameWithoutLocale === href || pathname === href;
  };

  // Sidebar content
  const SidebarContent = () => (
    <div className="space-y-3">
      {/* Profile Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="bg-primary p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white/30">
              <AvatarImage src={user?.personal?.avatar} alt={fullName} className="object-cover" />
              <AvatarFallback className="bg-white text-sm font-semibold text-primary">
                {getInitialName(firstName, lastName) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-white">{fullName}</h2>
              <p className="truncate text-xs text-white/70">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex divide-x divide-border">
          <div className="flex-1 px-4 py-2.5 text-center">
            <p className="text-base font-bold text-primary">
              {details?.bookmarks?.filter(b => b.status === BookmarkStatus.ACTIVE).length || 0}
            </p>
            <p className="text-[11px] text-muted-foreground">{t('saved') || 'Saved'}</p>
          </div>
          <div className="flex-1 px-4 py-2.5 text-center">
            <p className="text-base font-bold text-secondary">
              {details?.pendingPaymentBookingsCount || 0}
            </p>
            <p className="text-[11px] text-muted-foreground">{t('pending') || 'Pending'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <nav className="p-1.5">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isPathActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-md transition-all',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:text-foreground',
                      )}
                    >
                      <IconComponent className="h-4 w-4" strokeWidth={2} />
                    </div>

                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>

                    {item.badge ? (
                      <span
                        className={cn(
                          'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                          isActive ? 'bg-primary text-white' : 'bg-secondary/20 text-secondary',
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-1.5 h-px bg-border" />

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted transition-all group-hover:bg-destructive/20">
              <LogOut className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium">{t('logout')}</span>
          </button>
        </nav>
      </div>

      {/* Help Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green">
            <Headphones className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground">{t('help_title') || 'Need help?'}</h3>
            <p className="text-xs text-muted-foreground">{t('help_desc') || 'Contact support'}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-24 hidden w-full lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl lg:hidden"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-4 shadow-2xl transition-transform duration-300 lg:hidden',
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
        <SidebarContent />
        <div className="h-16" />
      </aside>
    </>
  );
}
