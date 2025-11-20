'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import {
  Bell,
  Book,
  FileText,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingCart,
  User,
} from 'lucide-react';

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

const COMMAND_ITEMS = {
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
  Create: [
    { label: 'User Create', icon: Book, href: RouteConstant.admin_user_create },
    { label: 'Role Create', icon: Book, href: RouteConstant.admin_role_create },
    { label: 'Tour Create', icon: MapPin, href: RouteConstant.admin_tour_create },
    { label: 'Article Create', icon: ShoppingCart, href: RouteConstant.admin_article_create },
    { label: 'Notification Create', icon: Bell, href: RouteConstant.admin_notification_create },
    { label: 'Chatbot Information Create', icon: MessageCircle, href: RouteConstant.admin_chatbot_create },
  ],
} as const;

export default function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
          Search
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
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(COMMAND_ITEMS).map(([section, items]) => (
              <CommandGroup className="border-b py-2" heading={section} key={section}>
                {items.map(item => (
                  <CommandItem key={item.label} onSelect={() => router.push(item.href)}>
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
