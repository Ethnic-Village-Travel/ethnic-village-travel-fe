'use client';

import Image from 'next/image';
import { cn } from '@/utils';

import { FilterBar } from './filter-bar';
import { SearchBar } from './search-bar';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn('relative h-[600px] w-full overflow-hidden', className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/images/homepage_hero.jpg" alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto flex h-full w-full flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:px-8 md:text-5xl lg:px-16 lg:text-6xl xl:px-28">
            Khám phá vẻ đẹp văn hóa dân tộc
          </h1>
          <p className="text-white/90 text-lg text-gray-400 md:text-xl">
            Trải nghiệm những chuyến du lịch độc đáo đến các làng dân tộc thiểu số
          </p>
        </div>

        <div className="flex w-full max-w-6xl flex-col gap-4 md:px-8 lg:px-16 xl:px-28">
          <SearchBar className="w-full" />
          <div className="flex w-full">
            <FilterBar />
          </div>
        </div>
      </div>
    </section>
  );
}
