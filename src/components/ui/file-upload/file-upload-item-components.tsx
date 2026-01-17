'use client';

import * as React from 'react';
import { cn } from '@/utils';
import { Slot } from '@radix-ui/react-slot';
import {
  LIST_NAME,
  ITEM_NAME,
  ITEM_PREVIEW_NAME,
  ITEM_METADATA_NAME,
  ITEM_PROGRESS_NAME,
  ITEM_DELETE_NAME,
  CLEAR_NAME,
  useFileUploadContext,
  useStore,
  useStoreContext,
  useFileUploadItemContext,
  FileUploadItemContext,
} from './contexts';
import { useAsRef } from './store';
import { formatBytes, getFileIcon } from './helpers';

// FileUploadList component
export interface FileUploadListProps extends React.ComponentPropsWithoutRef<'div'> {
  orientation?: 'horizontal' | 'vertical';
  asChild?: boolean;
  forceMount?: boolean;
}

export const FileUploadList = React.forwardRef<HTMLDivElement, FileUploadListProps>((props, forwardedRef) => {
  const { className, orientation = 'vertical', asChild, forceMount, ...listProps } = props;

  const context = useFileUploadContext(LIST_NAME);

  const shouldRender = forceMount || useStore(state => state.files.size > 0);

  if (!shouldRender) return null;

  const ListPrimitive = asChild ? Slot : 'div';

  return (
    <ListPrimitive
      role="list"
      id={context.listId}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="file-upload-list"
      data-state={shouldRender ? 'active' : 'inactive'}
      dir={context.dir}
      {...listProps}
      ref={forwardedRef}
      className={cn(
        'flex flex-col gap-2 data-[state=active]:animate-in data-[state=inactive]:animate-out data-[state=active]:fade-in-0 data-[state=inactive]:fade-out-0 data-[state=active]:slide-in-from-top-2 data-[state=inactive]:slide-out-to-top-2',
        orientation === 'horizontal' && 'flex-row overflow-x-auto p-1.5',
        className,
      )}
    />
  );
});
FileUploadList.displayName = LIST_NAME;

// FileUploadItem component
export interface FileUploadItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: File;
  asChild?: boolean;
}

export const FileUploadItem = React.forwardRef<HTMLDivElement, FileUploadItemProps>((props, forwardedRef) => {
  const { value, asChild, className, ...itemProps } = props;

  const id = React.useId();
  const statusId = `${id}-status`;
  const nameId = `${id}-name`;
  const sizeId = `${id}-size`;
  const messageId = `${id}-message`;

  const context = useFileUploadContext(ITEM_NAME);
  const fileState = useStore(state => state.files.get(value));
  const fileCount = useStore(state => state.files.size);
  const fileIndex = useStore(state => {
    const files = Array.from(state.files.keys());
    return files.indexOf(value) + 1;
  });

  const itemContext = React.useMemo(
    () => ({
      id,
      fileState,
      nameId,
      sizeId,
      statusId,
      messageId,
    }),
    [id, fileState, statusId, nameId, sizeId, messageId],
  );

  if (!fileState) return null;

  const statusText = fileState.error
    ? `Error: ${fileState.error}`
    : fileState.status === 'uploading'
      ? `Uploading: ${fileState.progress}% complete`
      : fileState.status === 'success'
        ? 'Upload complete'
        : 'Ready to upload';

  const ItemPrimitive = asChild ? Slot : 'div';

  return (
    <FileUploadItemContext.Provider value={itemContext}>
      <ItemPrimitive
        role="listitem"
        id={id}
        aria-setsize={fileCount}
        aria-posinset={fileIndex}
        aria-describedby={`${nameId} ${sizeId} ${statusId} ${fileState.error ? messageId : ''}`}
        aria-labelledby={nameId}
        data-slot="file-upload-item"
        dir={context.dir}
        {...itemProps}
        ref={forwardedRef}
        className={cn('relative flex items-center gap-2.5 rounded-md border p-3', className)}
      >
        {props.children}
        <span id={statusId} className="sr-only">
          {statusText}
        </span>
      </ItemPrimitive>
    </FileUploadItemContext.Provider>
  );
});
FileUploadItem.displayName = ITEM_NAME;

// FileUploadItemPreview component
export interface FileUploadItemPreviewProps extends React.ComponentPropsWithoutRef<'div'> {
  render?: (file: File) => React.ReactNode;
  asChild?: boolean;
}

export const FileUploadItemPreview = React.forwardRef<HTMLDivElement, FileUploadItemPreviewProps>((props, forwardedRef) => {
  const { render, asChild, children, className, ...previewProps } = props;

  const itemContext = useFileUploadItemContext(ITEM_PREVIEW_NAME);

  const onPreviewRender = React.useCallback(
    (file: File) => {
      if (render) return render(file);

      if (itemContext.fileState?.file.type.startsWith('image/')) {
        return (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="size-full object-cover"
            onLoad={event => {
              if (!(event.target instanceof HTMLImageElement)) return;
              URL.revokeObjectURL(event.target.src);
            }}
          />
        );
      }

      return getFileIcon(file);
    },
    [render, itemContext.fileState?.file.type],
  );

  if (!itemContext.fileState) return null;

  const ItemPreviewPrimitive = asChild ? Slot : 'div';

  return (
    <ItemPreviewPrimitive
      aria-labelledby={itemContext.nameId}
      data-slot="file-upload-preview"
      {...previewProps}
      ref={forwardedRef}
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50 [&>svg]:size-10',
        className,
      )}
    >
      {onPreviewRender(itemContext.fileState.file)}
      {children}
    </ItemPreviewPrimitive>
  );
});
FileUploadItemPreview.displayName = ITEM_PREVIEW_NAME;

// FileUploadItemMetadata component
export interface FileUploadItemMetadataProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  size?: 'default' | 'sm';
}

export const FileUploadItemMetadata = React.forwardRef<HTMLDivElement, FileUploadItemMetadataProps>((props, forwardedRef) => {
  const { asChild, size = 'default', children, className, ...metadataProps } = props;

  const context = useFileUploadContext(ITEM_METADATA_NAME);
  const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME);

  if (!itemContext.fileState) return null;

  const ItemMetadataPrimitive = asChild ? Slot : 'div';

  return (
    <ItemMetadataPrimitive
      data-slot="file-upload-metadata"
      dir={context.dir}
      {...metadataProps}
      ref={forwardedRef}
      className={cn('flex min-w-0 flex-1 flex-col', className)}
    >
      {children ?? (
        <>
          <span
            id={itemContext.nameId}
            className={cn('truncate text-sm font-medium', size === 'sm' && 'text-[13px] font-normal leading-snug')}
          >
            {itemContext.fileState.file.name}
          </span>
          <span
            id={itemContext.sizeId}
            className={cn('truncate text-xs text-muted-foreground', size === 'sm' && 'text-[11px]')}
          >
            {formatBytes(itemContext.fileState.file.size)}
          </span>
          {itemContext.fileState.error && (
            <span id={itemContext.messageId} className="text-xs text-destructive">
              {itemContext.fileState.error}
            </span>
          )}
        </>
      )}
    </ItemMetadataPrimitive>
  );
});
FileUploadItemMetadata.displayName = ITEM_METADATA_NAME;

// FileUploadItemProgress component
export interface FileUploadItemProgressProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  variant?: 'linear' | 'circular' | 'fill';
  size?: number;
  forceMount?: boolean;
}

export const FileUploadItemProgress = React.forwardRef<HTMLDivElement, FileUploadItemProgressProps>((props, forwardedRef) => {
  const { variant = 'linear', size = 40, asChild, forceMount, className, ...progressProps } = props;

  const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME);

  if (!itemContext.fileState) return null;

  const shouldRender = forceMount || itemContext.fileState.progress !== 100;

  if (!shouldRender) return null;

  const ItemProgressPrimitive = asChild ? Slot : 'div';

  switch (variant) {
    case 'circular': {
      const circumference = 2 * Math.PI * ((size - 4) / 2);
      const strokeDashoffset = circumference - (itemContext.fileState.progress / 100) * circumference;

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          ref={forwardedRef}
          className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', className)}
        >
          <svg
            className="rotate-[-90deg] transform"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            stroke="currentColor"
          >
            <circle className="text-primary/20" strokeWidth="2" cx={size / 2} cy={size / 2} r={(size - 4) / 2} />
            <circle
              className="text-primary transition-[stroke-dashoffset] duration-300 ease-linear"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
          </svg>
        </ItemProgressPrimitive>
      );
    }

    case 'fill': {
      const progressPercentage = itemContext.fileState.progress;
      const topInset = 100 - progressPercentage;

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-valuetext={`${progressPercentage}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          ref={forwardedRef}
          className={cn('bg-primary/50 absolute inset-0 transition-[clip-path] duration-300 ease-linear', className)}
          style={{
            clipPath: `inset(${topInset}% 0% 0% 0%)`,
          }}
        />
      );
    }

    default:
      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          ref={forwardedRef}
          className={cn('bg-primary/20 relative h-1.5 w-full overflow-hidden rounded-full', className)}
        >
          <div
            className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-linear"
            style={{
              transform: `translateX(-${100 - itemContext.fileState.progress}%)`,
            }}
          />
        </ItemProgressPrimitive>
      );
  }
});
FileUploadItemProgress.displayName = ITEM_PROGRESS_NAME;

// FileUploadItemDelete component
export interface FileUploadItemDeleteProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const FileUploadItemDelete = React.forwardRef<HTMLButtonElement, FileUploadItemDeleteProps>((props, forwardedRef) => {
  const { asChild, ...deleteProps } = props;

  const store = useStoreContext(ITEM_DELETE_NAME);
  const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME);
  const propsRef = useAsRef(deleteProps);

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      propsRef.current?.onClick?.(event);

      if (!itemContext.fileState || event.defaultPrevented) return;

      store.dispatch({
        variant: 'REMOVE_FILE',
        file: itemContext.fileState.file,
      });
    },
    [store, itemContext.fileState, propsRef.current?.onClick],
  );

  if (!itemContext.fileState) return null;

  const ItemDeletePrimitive = asChild ? Slot : 'button';

  return (
    <ItemDeletePrimitive
      type="button"
      aria-controls={itemContext.id}
      aria-describedby={itemContext.nameId}
      data-slot="file-upload-item-delete"
      {...deleteProps}
      ref={forwardedRef}
      onClick={onClick}
    />
  );
});
FileUploadItemDelete.displayName = ITEM_DELETE_NAME;

// FileUploadClear component
export interface FileUploadClearProps extends React.ComponentPropsWithoutRef<'button'> {
  forceMount?: boolean;
  asChild?: boolean;
}

export const FileUploadClear = React.forwardRef<HTMLButtonElement, FileUploadClearProps>((props, forwardedRef) => {
  const { asChild, forceMount, disabled, ...clearProps } = props;

  const context = useFileUploadContext(CLEAR_NAME);
  const store = useStoreContext(CLEAR_NAME);
  const propsRef = useAsRef(clearProps);

  const isDisabled = disabled || context.disabled;

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      propsRef.current?.onClick?.(event);

      if (event.defaultPrevented) return;

      store.dispatch({ variant: 'CLEAR' });
    },
    [store, propsRef],
  );

  const shouldRender = forceMount || useStore(state => state.files.size > 0);

  if (!shouldRender) return null;

  const ClearPrimitive = asChild ? Slot : 'button';

  return (
    <ClearPrimitive
      type="button"
      aria-controls={context.listId}
      data-slot="file-upload-clear"
      data-disabled={isDisabled ? '' : undefined}
      {...clearProps}
      ref={forwardedRef}
      disabled={isDisabled}
      onClick={onClick}
    />
  );
});
FileUploadClear.displayName = CLEAR_NAME;
