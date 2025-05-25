'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/classnames';
import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Page() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
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
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Glow effect */}
      <div
        className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-[100px]"
        style={{
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex w-full max-w-screen-xl flex-col items-center justify-center px-4 text-center">
        {/* 404 Text with glitch effect */}
        <h1 className="relative font-mono text-[150px] font-bold leading-none tracking-tighter sm:text-[250px]">
          <span
            className={cn(
              'relative inline-block transition-transform',
              isGlitching && 'animate-[shake_0.2s_ease-in-out_infinite]',
            )}
            style={{
              transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`,
            }}
          >
            4
          </span>
          <span
            className={cn(
              'relative inline-block text-fuchsia-500 transition-transform',
              isGlitching && 'animate-[shake_0.3s_ease-in-out_infinite]',
            )}
            style={{
              transform: `translateX(${mousePosition.x * -15}px) translateY(${mousePosition.y * -15}px)`,
            }}
          >
            0
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
            4
          </span>

          {/* Glitch lines */}
          {isGlitching && (
            <>
              <span className="absolute left-0 top-1/4 h-[5px] w-full bg-fuchsia-500 opacity-70"></span>
              <span className="absolute left-0 top-2/4 h-[2px] w-full bg-cyan-400 opacity-70"></span>
              <span className="absolute left-0 top-3/4 h-[3px] w-full bg-yellow-400 opacity-70"></span>
            </>
          )}
        </h1>

        {/* Message */}
        <div className="mb-8 mt-4 max-w-lg space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Oops! Trang không tồn tại</h2>
          <p className="text-gray-400">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white/10 hover:bg-white/20 group relative overflow-hidden backdrop-blur-sm"
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Trang chủ
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </Button>

          <Button
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

      {/* Decorative elements */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>

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
  );
}
