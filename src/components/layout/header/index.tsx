'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';
import { ClassNameValue } from 'tailwind-merge';

import { Button } from '@/components/ui/button';

import LanguageSwitcher from '../../shared/language-switcher';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
];

interface HeaderProps {
  navItemClassName?: ClassNameValue;
}

const Header = ({ navItemClassName }: HeaderProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasBackdrop, setHasBackdrop] = useState(false);

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

  return (
    <header
      className={cn('fixed left-0 right-0 top-0 z-50 flex items-center justify-center bg-transparent py-4', {
        'backdrop-blur-lg': hasBackdrop,
      })}
    >
      <div className="flex w-full max-w-screen-2xl items-center justify-between px-28">
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
                      'text-white': pathname.includes(RouteConstant.home),
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

        <div className="flex items-center gap-4 text-sm">
          <LanguageSwitcher />
          <Button variant="outline" asChild className="border-primary-500 text-primary-500 hover:text-primary-500">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild className="bg-primary-500 text-white">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
