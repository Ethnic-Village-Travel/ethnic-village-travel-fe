'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/general';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import '../styles/globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Log the error
    console.error(error);

    // Trigger glitch effect at random intervals
    const glitchInterval = setInterval(
      () => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      },
      Math.random() * 3000 + 2000,
    );

    // Track mouse position for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(glitchInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [error]);

  return (
    <html lang="vi">
      <head>
        <style>{`
          nextjs-portal {
            display: none !important;
          }
        `}</style>
      </head>
      <body className="bg-black text-white">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>

          {/* Glow effect */}
          <div
            className="absolute top-1/2 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 blur-[100px]"
            style={{
              transform: `translate(-50%, -50%) translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            }}
          />

          {/* Main content */}
          <main className="relative z-10 flex w-full max-w-screen-xl flex-col items-center justify-center px-4 text-center">
            {/* Error Text with glitch effect */}
            <div className="relative mb-6 flex items-center justify-center">
              <AlertTriangle
                className={cn(
                  'h-24 w-24 text-red-500 transition-transform sm:h-32 sm:w-32',
                  isGlitching && 'animate-[shake_0.2s_ease-in-out_infinite]',
                )}
                style={{
                  transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`,
                }}
              />
            </div>

            <h1 className="relative font-mono text-[80px] leading-none font-bold tracking-tighter sm:text-[120px]">
              <span
                className={cn(
                  'relative inline-block transition-transform',
                  isGlitching && 'animate-[shake_0.2s_ease-in-out_infinite]',
                )}
                style={{
                  transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`,
                }}
              >
                E
              </span>
              <span
                className={cn(
                  'relative inline-block text-red-500 transition-transform',
                  isGlitching && 'animate-[shake_0.3s_ease-in-out_infinite]',
                )}
                style={{
                  transform: `translateX(${mousePosition.x * -15}px) translateY(${mousePosition.y * -15}px)`,
                }}
              >
                R
              </span>
              <span
                className={cn(
                  'relative inline-block transition-transform',
                  isGlitching && 'animate-[shake_0.1s_ease-in-out_infinite]',
                )}
                style={{
                  transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`,
                }}
              >
                R
              </span>
              <span
                className={cn(
                  'relative inline-block text-red-500 transition-transform',
                  isGlitching && 'animate-[shake_0.25s_ease-in-out_infinite]',
                )}
                style={{
                  transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`,
                }}
              >
                O
              </span>
              <span
                className={cn(
                  'relative inline-block transition-transform',
                  isGlitching && 'animate-[shake_0.15s_ease-in-out_infinite]',
                )}
                style={{
                  transform: `translateX(${mousePosition.x * 8}px) translateY(${mousePosition.y * 8}px)`,
                }}
              >
                R
              </span>

              {/* Glitch lines */}
              {isGlitching && (
                <>
                  <span className="absolute top-1/4 left-0 h-[5px] w-full bg-red-500 opacity-70"></span>
                  <span className="absolute top-2/4 left-0 h-[2px] w-full bg-cyan-400 opacity-70"></span>
                  <span className="absolute top-3/4 left-0 h-[3px] w-full bg-yellow-400 opacity-70"></span>
                </>
              )}
            </h1>

            {/* Message */}
            <div className="mt-4 mb-8 max-w-lg space-y-2">
              <h2 className="text-2xl font-bold sm:text-3xl">Đã xảy ra lỗi nghiêm trọng</h2>
              <p className="text-gray-400">
                Hệ thống đã gặp sự cố không mong muốn. Chúng tôi đã ghi nhận lỗi này và đang khắc phục.
              </p>
              {error.digest && (
                <p className="mt-2 rounded-md bg-red-950/30 p-2 font-mono text-sm text-red-200">
                  Mã lỗi: {error.digest}
                </p>
              )}
            </div>

            {/* Action button */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600/80 to-red-900/80 text-white shadow-lg transition-all duration-300 hover:from-red-500/80 hover:to-red-800/80"
              onClick={() => reset()}
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </Button>
          </main>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white opacity-20"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                }}
              />
            ))}
          </div>

          {/* Add keyframes for animations */}
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
    </html>
  );
}
