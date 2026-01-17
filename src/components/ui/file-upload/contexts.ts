import * as React from 'react';
import { createStore, useLazyRef } from './store';
import type { FileUploadContextValue, FileUploadItemContextValue, StoreState } from './types';

// Component name constants for error messages
export const ROOT_NAME = 'FileUpload';
export const DROPZONE_NAME = 'FileUploadDropzone';
export const TRIGGER_NAME = 'FileUploadTrigger';
export const LIST_NAME = 'FileUploadList';
export const ITEM_NAME = 'FileUploadItem';
export const ITEM_PREVIEW_NAME = 'FileUploadItemPreview';
export const ITEM_METADATA_NAME = 'FileUploadItemMetadata';
export const ITEM_PROGRESS_NAME = 'FileUploadItemProgress';
export const ITEM_DELETE_NAME = 'FileUploadItemDelete';
export const CLEAR_NAME = 'FileUploadClear';

export const FILE_UPLOAD_ERRORS = {
  [ROOT_NAME]: `\`${ROOT_NAME}\` must be used as root component`,
  [DROPZONE_NAME]: `\`${DROPZONE_NAME}\` must be within \`${ROOT_NAME}\``,
  [TRIGGER_NAME]: `\`${TRIGGER_NAME}\` must be within \`${ROOT_NAME}\``,
  [LIST_NAME]: `\`${LIST_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_NAME]: `\`${ITEM_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_PREVIEW_NAME]: `\`${ITEM_PREVIEW_NAME}\` must be within \`${ITEM_NAME}\``,
  [ITEM_METADATA_NAME]: `\`${ITEM_METADATA_NAME}\` must be within \`${ITEM_NAME}\``,
  [ITEM_PROGRESS_NAME]: `\`${ITEM_PROGRESS_NAME}\` must be within \`${ITEM_NAME}\``,
  [ITEM_DELETE_NAME]: `\`${ITEM_DELETE_NAME}\` must be within \`${ITEM_NAME}\``,
  [CLEAR_NAME]: `\`${CLEAR_NAME}\` must be within \`${ROOT_NAME}\``,
} as const;

// Store context
export const StoreContext = React.createContext<ReturnType<typeof createStore> | null>(null);
StoreContext.displayName = ROOT_NAME;

export function useStoreContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name]);
  }
  return context;
}

export function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext(ROOT_NAME);

  const lastValueRef = useLazyRef<{ value: T; state: StoreState } | null>(() => null);

  const getSnapshot = React.useCallback(() => {
    const state = store.getState();
    const prevValue = lastValueRef.current;

    if (prevValue && prevValue.state === state) {
      return prevValue.value;
    }

    const nextValue = selector(state);
    lastValueRef.current = { value: nextValue, state };
    return nextValue;
  }, [store, selector, lastValueRef]);

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

// FileUpload context
export const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

export function useFileUploadContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = React.useContext(FileUploadContext);
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name]);
  }
  return context;
}

// FileUploadItem context
export const FileUploadItemContext = React.createContext<FileUploadItemContextValue | null>(null);

export function useFileUploadItemContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = React.useContext(FileUploadItemContext);
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name]);
  }
  return context;
}
