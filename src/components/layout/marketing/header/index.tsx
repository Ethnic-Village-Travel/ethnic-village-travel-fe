'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ClassNameValue } from 'tailwind-merge';

import { useIsHomePage } from '@/hooks/use-is-home-page';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AuthPopup } from '@/components/features/auth';
import { UserMenu } from '@/components/features/user';
import LanguageSwitcher from '@/components/shared/language-switcher';

interface HeaderProps {
  navItemClassName?: ClassNameValue;
}

const Header = ({ navItemClassName }: HeaderProps) => {
  const t = useTranslations('layout.header');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomePage = useIsHomePage();
  const { user, setLoginOpen, setSignupOpen } = useAuthStore();

  const navLinks = [
    { name: t('nav.home'), href: RouteConstant.home },
    { name: t('nav.about'), href: RouteConstant.about },
    { name: t('nav.services'), href: RouteConstant.services },
    { name: t('nav.blog'), href: RouteConstant.blog },
    { name: t('nav.contact'), href: RouteConstant.contact },
  ];

  const handleSignInClick = () => {
    setLoginOpen(true);
    setIsMenuOpen(false);
  };

  const handleSignUpClick = () => {
    setSignupOpen(true);
    setIsMenuOpen(false);
  };

  const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => (
    <ul className={cn('flex items-center gap-6 2xl:gap-8', isMobileNav && 'flex-col items-start gap-4 space-y-2')}>
      {navLinks.map(link => (
        <li key={link.name}>
          <Link
            href={link.href}
            onClick={() => isMobileNav && setIsMenuOpen(false)}
            className={cn(
              'relative text-base font-bold transition-colors',
              'hover:text-primary-500 hover:before:w-full',
              'before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:w-0 before:bg-primary-500 before:transition-all before:duration-300 before:ease-in-out',
              navItemClassName,
              {
                'text-white': isHomePage,
                'text-primary-500 before:w-full': pathname === link.href,
              },
              isMobileNav && 'py-2 text-lg text-dark',
            )}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <Container className={cn('absolute left-0 right-0 top-0 z-50')}>
      <header className={cn('flex w-full items-center justify-center bg-transparent py-2 lg:py-4', {})}>
        <div className="flex w-full items-center justify-between gap-2 lg:gap-4">
          <Link href="/" className="flex flex-shrink-0 items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-in-out hover:scale-110 lg:h-12 lg:w-12">
              <Image
                src="/icons/logo.svg"
                alt="Ethnic Village Travel"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-1 lg:gap-2">
            <LanguageSwitcher />

            <div className="hidden items-center gap-1 text-sm lg:flex">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-primary-500 text-primary-500 hover:text-primary-500"
                    onClick={handleSignInClick}
                  >
                    {t('auth.sign_in')}
                  </Button>
                  <Button className="bg-primary-500 text-white" onClick={handleSignUpClick}>
                    {t('auth.sign_up')}
                  </Button>
                </>
              )}
            </div>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/10 h-10 w-10 text-white focus-visible:ring-0 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  <NavLinks isMobileNav />
                  {!user && (
                    <div className="flex flex-col gap-3 border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full border-primary-500 text-primary-500 hover:text-primary-500"
                        onClick={handleSignInClick}
                      >
                        {t('auth.sign_in')}
                      </Button>
                      <Button className="w-full bg-primary-500 text-white" onClick={handleSignUpClick}>
                        {t('auth.sign_up')}
                      </Button>
                    </div>
                  )}
                  {user && (
                    <div className="border-t pt-4">
                      <UserMenu />
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthPopup />
    </Container>
  );
};

export default Header;
