import { create } from 'zustand';

interface BookingState {
  selectedDateId: number | null;
  availableSlots: number | null;
  setSelectedDate: (dateId: number | null, slots: number | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>(set => ({
  selectedDateId: null,
  availableSlots: null,
  setSelectedDate: (dateId, slots) => set({ selectedDateId: dateId, availableSlots: slots }),
  reset: () => set({ selectedDateId: null, availableSlots: null }),
}));
