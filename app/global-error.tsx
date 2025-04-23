'use client';

import { useEffect } from 'react';
import { cn } from '@/utils/general';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

import { useGlitchAndParallax } from '@/hooks/useGlitchAndParallax';
import { Button } from '@/components/ui/button';
import { BackgroundEffects } from '@/components/background-effects';

import '../styles/globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { isGlitching, mousePosition } = useGlitchAndParallax();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <body className="bg-black text-white">
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <BackgroundEffects glowColor="bg-red-500/20" mousePosition={mousePosition} />

        <main className="relative z-10 flex w-full max-w-screen-xl flex-col items-center justify-center px-4 text-center">
          <div className="relative mb-6 flex items-center justify-center">
            <AlertTriangle
              className={cn(
                'h-24 w-24 text-red-500 transition-transform sm:h-32 sm:w-32',
                isGlitching && 'animate-[shake_0.2s_ease-in-out_infinite]',
              )}
              style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
            />
          </div>

          <h1 className="relative font-mono text-[80px] leading-none font-bold tracking-tighter sm:text-[120px]">
            {['E', 'R', 'R', 'O', 'R'].map((char, idx) => (
              <span
                key={idx}
                className={cn(
                  'relative inline-block transition-transform',
                  idx % 2 === 1 && 'text-red-500',
                  isGlitching && `animate-[shake_0.${2 + idx}s_ease-in-out_infinite]`,
                )}
                style={{
                  transform: `translate(${mousePosition.x * (idx % 2 ? -15 : 10)}px, ${mousePosition.y * (idx % 2 ? -15 : 10)}px)`,
                }}
              >
                {char}
              </span>
            ))}
            {isGlitching && (
              <>
                <span className="absolute top-1/4 left-0 h-[5px] w-full bg-red-500 opacity-70"></span>
                <span className="absolute top-2/4 left-0 h-[2px] w-full bg-cyan-400 opacity-70"></span>
                <span className="absolute top-3/4 left-0 h-[3px] w-full bg-yellow-400 opacity-70"></span>
              </>
            )}
          </h1>

          <div className="mt-4 mb-8 max-w-lg space-y-2">
            <h2 className="text-2xl font-bold sm:text-3xl">Đã xảy ra lỗi nghiêm trọng</h2>
            <p className="text-gray-400">
              Hệ thống đã gặp sự cố không mong muốn. Chúng tôi đã ghi nhận lỗi này và đang khắc phục.
            </p>
            {error.digest && (
              <p className="mt-2 rounded-md bg-red-950/30 p-2 font-mono text-sm text-red-200">Mã lỗi: {error.digest}</p>
            )}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600/80 to-red-900/80 text-white shadow-lg transition-all duration-300 hover:from-red-500/80 hover:to-red-800/80"
            onClick={reset}
          >
            <RefreshCcw className="h-4 w-4" />
            Thử lại
          </Button>
        </main>

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
    </body>
  );
}
