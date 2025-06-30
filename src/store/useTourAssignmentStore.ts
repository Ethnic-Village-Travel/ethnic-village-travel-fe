import { create } from 'zustand';

import type { EmployeeBasicResponse } from '@/types/employee.type';

export interface AssignedEmployeesByDate {
  [dateId: string]: EmployeeBasicResponse[];
}

export interface TourAssignments {
  [tourId: string]: AssignedEmployeesByDate;
}

interface TourAssignmentStore {
  // State
  tourAssignments: TourAssignments;
  activeTourId: string | null;

  // Actions
  setActiveTourId: (tourId: string | null) => void;
  setTourAssignments: (tourId: string, assignments: AssignedEmployeesByDate) => void;
  updateTourAssignments: (tourId: string, newAssignments: AssignedEmployeesByDate) => void;
  clearTourAssignments: (tourId?: string) => void;
}

export const useTourAssignmentStore = create<TourAssignmentStore>(set => ({
  // Initial state
  tourAssignments: {},
  activeTourId: null,

  // Actions
  setActiveTourId: tourId => set({ activeTourId: tourId }),

  setTourAssignments: (tourId, assignments) =>
    set(state => ({
      tourAssignments: {
        ...state.tourAssignments,
        [tourId]: assignments,
      },
    })),

  updateTourAssignments: (tourId, newAssignments) =>
    set(state => ({
      tourAssignments: {
        ...state.tourAssignments,
        [tourId]: {
          ...(state.tourAssignments[tourId] || {}),
          ...newAssignments,
        },
      },
    })),

  clearTourAssignments: tourId =>
    set(state => {
      if (tourId) {
        const newTourAssignments = { ...state.tourAssignments };
        delete newTourAssignments[tourId];
        return { tourAssignments: newTourAssignments };
      } else {
        return { tourAssignments: {} };
      }
    }),
}));
