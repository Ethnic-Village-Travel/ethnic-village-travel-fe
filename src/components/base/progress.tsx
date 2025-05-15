import React from 'react';
import { useNProgress } from '@tanem/react-nprogress';

export interface ProgressProps {
  isAnimating: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });
  return (
    <div
      className="pointer-events-none"
      style={{ opacity: isFinished ? 0 : 1, transition: `opacity ${animationDuration}ms linear` }}
    >
      <div
        className="fixed top-0 left-0 z-50 h-0.5 w-full bg-[#3399dd]"
        style={{ marginLeft: `${(-1 + progress) * 100}%`, transition: `margin-left ${animationDuration}ms linear` }}
      />
    </div>
  );
};
