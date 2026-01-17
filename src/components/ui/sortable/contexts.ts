'use client';

import * as React from 'react';
import { ROOT_NAME, SORTABLE_ERRORS, type SortableRootContextValue } from './types';

export const SortableRootContext = React.createContext<SortableRootContextValue<unknown> | null>(null);
SortableRootContext.displayName = ROOT_NAME;

export function useSortableContext(name: keyof typeof SORTABLE_ERRORS) {
  const context = React.useContext(SortableRootContext);
  if (!context) {
    throw new Error(SORTABLE_ERRORS[name]);
  }
  return context;
}

export const SortableContentContext = React.createContext<boolean>(false);
SortableContentContext.displayName = 'SortableContent';

export const SortableItemContext = React.createContext<import('./types').SortableItemContextValue | null>(null);
SortableItemContext.displayName = 'SortableItem';

export const SortableOverlayContext = React.createContext(false);
SortableOverlayContext.displayName = 'SortableOverlay';
