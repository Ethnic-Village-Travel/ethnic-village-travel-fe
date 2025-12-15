'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import {
  Bell,
  Calendar,
  CalendarCheck,
  Compass,
  FolderTree,
  LayoutGrid,
  Newspaper,
  Search,
  ShieldCheck,
  User,
  UserCog,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export default function SearchCommand() {
  const t = useTranslations('admin.search_command');
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const COMMAND_ITEMS = {
    [t('section.general')]: [
      { label: t('items.dashboard'), icon: LayoutGrid, href: RouteConstant.admin_dashboard },
      { label: t('items.user'), icon: User, href: RouteConstant.admin_user },
      { label: t('items.employee'), icon: UserCog, href: RouteConstant.admin_employee },
      { label: t('items.role'), icon: ShieldCheck, href: RouteConstant.admin_role },
    ],
    [t('section.functions')]: [
      { label: t('items.tour'), icon: Compass, href: RouteConstant.admin_tour },
      { label: t('items.tour_assignment'), icon: CalendarCheck, href: RouteConstant.admin_assigned_available_dates },
      { label: t('items.booking'), icon: Calendar, href: RouteConstant.admin_booking },
      { label: t('items.article'), icon: Newspaper, href: RouteConstant.admin_article },
      { label: t('items.notification'), icon: Bell, href: RouteConstant.admin_notification },
      { label: t('items.category'), icon: FolderTree, href: RouteConstant.admin_category },
    ],
    [t('section.create')]: [
      { label: t('items.user_create'), icon: User, href: RouteConstant.admin_user_create },
      { label: t('items.employee_create'), icon: UserCog, href: RouteConstant.admin_employee_create },
      { label: t('items.role_create'), icon: ShieldCheck, href: RouteConstant.admin_role_create },
      { label: t('items.tour_create'), icon: Compass, href: RouteConstant.admin_tour_create },
      { label: t('items.article_create'), icon: Newspaper, href: RouteConstant.admin_article_create },
      { label: t('items.notification_create'), icon: Bell, href: RouteConstant.admin_notification_create },
      { label: t('items.category_create'), icon: FolderTree, href: RouteConstant.admin_category_create },
    ],
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex w-64 cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2"
      >
        <div className="flex items-center gap-2">
          <Search className="!h-4 !w-4" />
          {t('search')}
        </div>
        <p className="text-sm text-muted-foreground">
          {' '}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {' '}
            <span className="text-xs">⌘</span>K{' '}
          </kbd>{' '}
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder={t('placeholder')} />
          <CommandList>
            <CommandEmpty>{t('no_results')}</CommandEmpty>
            {Object.entries(COMMAND_ITEMS).map(([section, items]) => (
              <CommandGroup className="border-b py-2" heading={section} key={section}>
                {items.map(item => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      router.push(item.href);
                      setOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
