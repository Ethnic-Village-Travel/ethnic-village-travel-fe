'use client';

import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';

import FooterCopyright from './FooterCopyright';
import FooterLogo from './FooterLogo';
import FooterNavLinks from './FooterNavLinks';
import FooterNewsletter from './FooterNewsletter';

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer className="relative mt-[70px] w-full bg-[#1C2930] text-white">
      <div
        className={cn('mt-[168px] flex flex-col items-center sm:mt-[130px]', {
          'mt-[48px] sm:mt-[48px]': pathname !== RouteConstant.home,
        })}
      >
        <div className="flex w-full max-w-screen-2xl flex-col justify-center gap-4 px-4 pb-6 md:flex-row md:gap-8 md:px-8 lg:gap-[70px] lg:px-[110px] 2xl:px-0">
          <FooterLogo />

          <FooterNavLinks />
        </div>

        <FooterCopyright />
      </div>

      <FooterNewsletter />
    </footer>
  );
};

export default Footer;
