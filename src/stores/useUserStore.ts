import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Bookmark } from '@/types/bookmark.type';
import { UserDetailsResponse } from '@/types/user.type';

interface UserState {
  details: UserDetailsResponse | null;
  setUserDetails: (details: UserDetailsResponse) => void;
  setUserBookmark: (bookmark: Bookmark) => void;
  setPendingPaymentBookingCount: (count: number) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      details: null,
      setUserDetails: (details: UserDetailsResponse) =>
        set({
          details,
        }),
      setUserBookmark: (bookmark: Bookmark) =>
        set(state => {
          if (!state.details) return state;

          const existingBookmarks = state.details.bookmarks || [];
          const existingIndex = existingBookmarks.findIndex(
            b => b.entityId === bookmark.entityId && b.entityType === bookmark.entityType,
          );

          let updatedBookmarks;
          if (existingIndex >= 0) {
            // Update existing bookmark
            updatedBookmarks = [...existingBookmarks];
            updatedBookmarks[existingIndex] = bookmark;
          } else {
            // Add new bookmark
            updatedBookmarks = [...existingBookmarks, bookmark];
          }

          return {
            ...state,
            details: {
              ...state.details,
              bookmarks: updatedBookmarks,
            },
          };
        }),
      setPendingPaymentBookingCount: (count: number) =>
        set(state => {
          if (!state.details) return state;

          return {
            ...state,
            details: {
              ...state.details,
              pendingPaymentBookingsCount: count,
            },
          };
        }),
      clearUserData: () =>
        set({
          details: null,
        }),
    }),
    {
      name: 'user-storage',
      partialize: state => ({
        details: state.details,
      }),
    },
  ),
);
