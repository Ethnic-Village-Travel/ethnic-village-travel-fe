'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AppConstant } from '@/constants/app';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';

import { routing } from '@/lib/i18n-navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-white-20 focus-visible:ring-0">
          <Image src={`/icons/${locale}.svg`} alt={locale} width={20} height={20} />
          <ChevronDown className={cn('h-4 w-4', { 'text-white': pathname.includes(RouteConstant.home) })} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map(loc => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn('flex items-center gap-2', {
              'bg-primary-500 font-semibold text-white focus:bg-primary-500 focus:text-white': loc === locale,
            })}
          >
            <Image src={`/icons/${loc}.svg`} alt={loc} width={20} height={20} />
            {AppConstant.locales[loc as keyof typeof AppConstant.locales]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
