'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/general';
import { Menu, X } from 'lucide-react';
import { ClassNameValue } from 'tailwind-merge';

import { Button } from '@/components/ui/button';

import LanguageSwitcher from './language-switcher';

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
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex items-center justify-center bg-transparent px-4 py-4 md:px-8 lg:px-16 2xl:px-32',
        {
          'backdrop-blur-md': hasBackdrop,
        },
      )}
    >
      <div className="container flex max-w-[1220px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="bg-white flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 ease-in-out hover:scale-110">
            <Image
              src="/images/logo.svg"
              alt="Ethnic Village Travel"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6 2xl:gap-8">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-white relative text-sm font-bold transition-colors lg:text-base',
                    'hover:text-primary-500 hover:before:w-full',
                    'before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:w-0 before:bg-primary-500 before:transition-all before:duration-300 before:ease-in-out',
                    navItemClassName,
                    {
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

        <div className="text-body-2 hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button variant="outline" asChild className="border-primary-500 text-primary-500 hover:text-primary-500">
            <Link href="/sign-in">Sign in</Link>
          </Button>

          <Button asChild className="text-white bg-primary-500">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity md:hidden',
            isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <div
            className={cn(
              'fixed right-0 top-0 h-full w-64 transform bg-[#1F2937] transition-transform duration-300 ease-in-out',
              isMenuOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" className="text-white" onClick={toggleMenu} aria-label="Close menu">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <ul className="flex flex-col gap-4 p-4">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-white relative block font-bold transition-colors before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:w-0 before:bg-primary-500 before:transition-all before:duration-300 before:ease-in-out hover:text-primary-500 hover:before:w-full',
                      {
                        'text-primary-500 before:w-full': pathname === link.href,
                      },
                    )}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="mt-4">
                <Button
                  variant="outline"
                  className="hover:text-white w-full border-primary-500 text-primary-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-primary-500 hover:shadow-[0_4px_12px_var(--primary-primary-10)]"
                  asChild
                  onClick={toggleMenu}
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </li>
              <li className="mt-2">
                <Button
                  className="text-white w-full bg-primary-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-[0_4px_12px_var(--primary-primary-20)]"
                  asChild
                  onClick={toggleMenu}
                >
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
