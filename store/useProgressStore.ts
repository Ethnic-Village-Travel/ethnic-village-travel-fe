import { create } from 'zustand';

interface IProgressStore {
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

export const useProgressStore = create<IProgressStore>(set => ({
  isAnimating: false,
  setIsAnimating: (isAnimating: boolean) => set(() => ({ isAnimating })),
}));
