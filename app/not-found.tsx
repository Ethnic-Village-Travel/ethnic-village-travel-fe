'use client';

import Link from 'next/link';
import { cn } from '@/utils/general';
import { ArrowLeft, Home } from 'lucide-react';

import { useGlitchAndParallax } from '@/hooks/useGlitchAndParallax';
import { Button } from '@/components/ui/button';
import { BackgroundEffects } from '@/components/common/background-effects';

import '../styles/globals.css';

export default function NotFoundPage() {
  const { isGlitching, mousePosition } = useGlitchAndParallax();

  return (
    <div className="overflow aput-hidden relative flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <BackgroundEffects glowColor="bg-fuchsia-500/20" mousePosition={mousePosition} />

      <main className="relative z-10 flex w-full max-w-screen-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="relative font-mono text-[150px] leading-none font-bold tracking-tighter sm:text-[250px]">
          <span
            className={cn(
              'relative inline-block transition-transform',
              isGlitching && 'animate-[shake_0.2s_ease-in-out_infinite]',
            )}
            style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
          >
            4
          </span>
          <span
            className={cn(
              'relative inline-block text-fuchsia-500 transition-transform',
              isGlitching && 'animate-[shake_0.3s_ease-in-out_infinite]',
            )}
            style={{ transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)` }}
          >
            0
          </span>
          <span
            className={cn(
              'relative inline-block transition-transform',
              isGlitching && 'animate-[shake_0.1s_ease-in-out_infinite]',
            )}
            style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
          >
            4
          </span>
          {isGlitching && (
            <>
              <span className="absolute top-1/4 left-0 h-[5px] w-full bg-fuchsia-500 opacity-70"></span>
              <span className="absolute top-2/4 left-0 h-[2px] w-full bg-cyan-400 opacity-70"></span>
              <span className="absolute top-3/4 left-0 h-[3px] w-full bg-yellow-400 opacity-70"></span>
            </>
          )}
        </h1>

        <div className="mt-4 mb-8 max-w-lg space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Oops! Trang không tồn tại</h2>
          <p className="text-gray-400">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Trang chủ
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </Button>
          <Button
            aria-label="Go back to previous page"
            variant="secondary"
            size="lg"
            className="group relative overflow-hidden border-fuchsia-500/40 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/30 hover:text-fuchsia-400"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full"></span>
          </Button>
        </div>
      </main>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black to-transparent"></div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        @keyframes shake {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(1px, 1px) rotate(0.5deg);
          }
          50% {
            transform: translate(-1px, -1px) rotate(-0.5deg);
          }
          75% {
            transform: translate(2px, -1px) rotate(1deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
