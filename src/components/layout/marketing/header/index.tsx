'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import { ClassNameValue } from 'tailwind-merge';

import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
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
  const [hasBackdrop, setHasBackdrop] = useState(false);
  const { user, setLoginOpen, setSignupOpen } = useAuthStore();

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.destinations'), href: '/destinations' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setHasBackdrop(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignInClick = () => {
    setLoginOpen(true);
  };

  const handleSignUpClick = () => {
    setSignupOpen(true);
  };

  return (
    <Container className={cn('fixed left-0 right-0 top-0 z-50')}>
      <header
        className={cn('flex w-full items-center justify-center bg-transparent py-4', {
          'backdrop-blur-lg': hasBackdrop,
        })}
      >
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-in-out hover:scale-110">
              <Image
                src="/icons/logo.svg"
                alt="Ethnic Village Travel"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>

          <nav className="flex">
            <ul className="flex items-center gap-6 2xl:gap-8">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative text-base font-bold text-white transition-colors',
                      'hover:text-primary-500 hover:before:w-full',
                      'before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:w-0 before:bg-primary-500 before:transition-all before:duration-300 before:ease-in-out',
                      navItemClassName,
                      {
                        'text-white': pathname === RouteConstant.home || pathname === '/en' + RouteConstant.home,
                        'text-primary-500 before:w-full': pathname.includes(link.href),
                      },
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 text-sm">
            <LanguageSwitcher />
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
        </div>
      </header>

      <AuthPopup />
    </Container>
  );
};

export default Header;
