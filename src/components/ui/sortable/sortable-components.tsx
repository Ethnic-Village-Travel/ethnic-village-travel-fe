'use client';

import * as React from 'react';
import { cn } from '@//utils';
import { composeEventHandlers, useComposedRefs } from '@/libs/composition';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DndContextProps,
  type DragEndEvent,
  type DropAnimation,
  type ScreenReaderInstructions,
  type UniqueIdentifier,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from '@radix-ui/react-slot';
import * as ReactDOM from 'react-dom';
import {
  SortableRootContext,
  useSortableContext,
  SortableContentContext,
  SortableItemContext,
  SortableOverlayContext,
} from './contexts';
import { orientationConfig, ROOT_NAME, CONTENT_NAME, ITEM_NAME, ITEM_HANDLE_NAME, OVERLAY_NAME, SORTABLE_ERRORS } from './types';
import type { SortableRootContextValue, SortableItemContextValue } from './types';

// Type definitions
interface GetItemValue<T> {
  getItemValue: (item: T) => UniqueIdentifier;
}

type SortableProps<T> = DndContextProps & {
  value: T[];
  onValueChange?: (items: T[]) => void;
  onMove?: (event: DragEndEvent & { activeIndex: number; overIndex: number }) => void;
  strategy?: import('@dnd-kit/sortable').SortableContextProps['strategy'];
  orientation?: 'vertical' | 'horizontal' | 'mixed';
  flatCursor?: boolean;
} & (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>);

// Root Sortable component
export function Sortable<T>(props: SortableProps<T>) {
  const {
    value,
    onValueChange,
    collisionDetection,
    modifiers,
    strategy,
    onMove,
    orientation = 'vertical',
    flatCursor = false,
    getItemValue: getItemValueProp,
    accessibility,
    ...sortableProps
  } = props;
  const id = React.useId();
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const config = React.useMemo(() => orientationConfig[orientation], [orientation]);

  const getItemValue = React.useCallback(
    (item: T): UniqueIdentifier => {
      if (typeof item === 'object' && !getItemValueProp) {
        throw new Error('getItemValue is required when using array of objects.');
      }
      return getItemValueProp ? getItemValueProp(item) : (item as UniqueIdentifier);
    },
    [getItemValueProp],
  );

  const items = React.useMemo(() => {
    return value.map(item => getItemValue(item));
  }, [value, getItemValue]);

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over?.id) {
        const activeIndex = value.findIndex(item => getItemValue(item) === active.id);
        const overIndex = value.findIndex(item => getItemValue(item) === over.id);

        if (onMove) {
          onMove({ ...event, activeIndex, overIndex });
        } else {
          onValueChange?.(arrayMove(value, activeIndex, overIndex));
        }
      }
      setActiveId(null);
    },
    [value, onValueChange, onMove, getItemValue],
  );

  const announcements: Announcements = React.useMemo(
    () => ({
      onDragStart({ active }) {
        const activeValue = active.id.toString();
        return `Grabbed sortable item "${activeValue}". Current position is ${active.data.current?.sortable.index + 1} of ${value.length}. Use arrow keys to move, space to drop.`;
      },
      onDragOver({ active, over }) {
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0;
          const activeIndex = active.data.current?.sortable.index ?? 0;
          const moveDirection = overIndex > activeIndex ? 'down' : 'up';
          const activeValue = active.id.toString();
          return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${value.length}.`;
        }
        return 'Sortable item is no longer over a droppable area. Press escape to cancel.';
      },
      onDragEnd({ active, over }) {
        const activeValue = active.id.toString();
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0;
          return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${value.length}.`;
        }
        return `Sortable item "${activeValue}" dropped. No changes were made.`;
      },
      onDragCancel({ active }) {
        const activeIndex = active.data.current?.sortable.index ?? 0;
        const activeValue = active.id.toString();
        return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${value.length}.`;
      },
      onDragMove({ active, over }) {
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0;
          const activeIndex = active.data.current?.sortable.index ?? 0;
          const moveDirection = overIndex > activeIndex ? 'down' : 'up';
          const activeValue = active.id.toString();
          return `Sortable item "${activeValue}" is moving ${moveDirection} to position ${overIndex + 1} of ${value.length}.`;
        }
        return 'Sortable item is no longer over a droppable area. Press escape to cancel.';
      },
    }),
    [value],
  );

  const screenReaderInstructions: ScreenReaderInstructions = React.useMemo(
    () => ({
      draggable: `
        To pick up a sortable item, press space or enter.
        While dragging, use the ${orientation === 'vertical' ? 'up and down' : orientation === 'horizontal' ? 'left and right' : 'arrow'} keys to move the item.
        Press space or enter again to drop the item in its new position, or press escape to cancel.
      `,
    }),
    [orientation],
  );

  const contextValue = React.useMemo(
    () => ({
      id,
      items,
      modifiers: modifiers ?? config.modifiers,
      strategy: strategy ?? config.strategy,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor,
    }),
    [id, items, modifiers, strategy, config.modifiers, config.strategy, activeId, getItemValue, flatCursor],
  );

  return (
    <SortableRootContext.Provider value={contextValue as SortableRootContextValue<unknown>}>
      <DndContext
        collisionDetection={collisionDetection ?? config.collisionDetection}
        modifiers={modifiers ?? config.modifiers}
        sensors={sensors}
        {...sortableProps}
        id={id}
        onDragStart={composeEventHandlers(sortableProps.onDragStart, ({ active }) => setActiveId(active.id))}
        onDragEnd={composeEventHandlers(sortableProps.onDragEnd, onDragEnd)}
        onDragCancel={composeEventHandlers(sortableProps.onDragCancel, () => setActiveId(null))}
        accessibility={{
          announcements,
          screenReaderInstructions,
          ...accessibility,
        }}
      />
    </SortableRootContext.Provider>
  );
}
Sortable.displayName = ROOT_NAME;

// SortableContent component
export interface SortableContentProps extends React.ComponentPropsWithoutRef<'div'> {
  strategy?: import('@dnd-kit/sortable').SortableContextProps['strategy'];
  children: React.ReactNode;
  asChild?: boolean;
  withoutSlot?: boolean;
}

export const SortableContent = React.forwardRef<HTMLDivElement, SortableContentProps>((props, forwardedRef) => {
  const { strategy: strategyProp, asChild, withoutSlot, children, ...contentProps } = props;
  const context = useSortableContext(CONTENT_NAME);

  const ContentPrimitive = asChild ? Slot : 'div';

  return (
    <SortableContentContext.Provider value={true}>
      <SortableContext items={context.items} strategy={strategyProp ?? context.strategy}>
        {withoutSlot ? (
          children
        ) : (
          <ContentPrimitive {...contentProps} ref={forwardedRef}>
            {children}
          </ContentPrimitive>
        )}
      </SortableContext>
    </SortableContentContext.Provider>
  );
});
SortableContent.displayName = CONTENT_NAME;

// SortableItem component
export interface SortableItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: UniqueIdentifier;
  asHandle?: boolean;
  asChild?: boolean;
  disabled?: boolean;
}

export const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>((props, forwardedRef) => {
  const { value, style, asHandle, asChild, disabled, className, ...itemProps } = props;
  const inSortableContent = React.useContext(SortableContentContext);
  const inSortableOverlay = React.useContext(SortableOverlayContext);

  if (!inSortableContent && !inSortableOverlay) {
    throw new Error(SORTABLE_ERRORS[ITEM_NAME]);
  }

  if (value === '') {
    throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`);
  }

  const context = useSortableContext(ITEM_NAME);
  const id = React.useId();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: value,
    disabled,
  });

  const composedRef = useComposedRefs(forwardedRef, node => {
    if (disabled) return;
    setNodeRef(node);
    if (asHandle) setActivatorNodeRef(node);
  });

  const composedStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
    };
  }, [transform, transition, style]);

  const itemContext = React.useMemo<SortableItemContextValue>(
    () => ({
      id,
      attributes,
      listeners,
      setActivatorNodeRef,
      isDragging,
      disabled,
    }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  );

  const ItemPrimitive = asChild ? Slot : 'div';

  return (
    <SortableItemContext.Provider value={itemContext}>
      <ItemPrimitive
        id={id}
        data-dragging={isDragging ? '' : undefined}
        {...itemProps}
        {...(asHandle ? attributes : {})}
        {...(asHandle ? listeners : {})}
        tabIndex={disabled ? undefined : 0}
        ref={composedRef}
        style={composedStyle}
        className={cn(
          'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
          {
            'touch-none select-none': asHandle,
            'cursor-default': context.flatCursor,
            'data-dragging:cursor-grabbing': !context.flatCursor,
            'cursor-grab': !isDragging && asHandle && !context.flatCursor,
            'opacity-50': isDragging,
            'pointer-events-none opacity-50': disabled,
          },
          className,
        )}
      />
    </SortableItemContext.Provider>
  );
});
SortableItem.displayName = ITEM_NAME;

// SortableItemHandle component
export interface SortableItemHandleProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const SortableItemHandle = React.forwardRef<HTMLButtonElement, SortableItemHandleProps>((props, forwardedRef) => {
  const { asChild, disabled, className, ...itemHandleProps } = props;
  const itemContext = React.useContext(SortableItemContext);
  if (!itemContext) {
    throw new Error(SORTABLE_ERRORS[ITEM_HANDLE_NAME]);
  }
  const context = useSortableContext(ITEM_HANDLE_NAME);

  const isDisabled = disabled ?? itemContext.disabled;

  const composedRef = useComposedRefs(forwardedRef, node => {
    if (!isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });

  const HandlePrimitive = asChild ? Slot : 'button';

  return (
    <HandlePrimitive
      type="button"
      aria-controls={itemContext.id}
      data-dragging={itemContext.isDragging ? '' : undefined}
      {...itemHandleProps}
      {...itemContext.attributes}
      {...itemContext.listeners}
      ref={composedRef}
      className={cn(
        'select-none disabled:pointer-events-none disabled:opacity-50',
        context.flatCursor ? 'cursor-default' : 'data-dragging:cursor-grabbing cursor-grab',
        className,
      )}
      disabled={isDisabled}
    />
  );
});
SortableItemHandle.displayName = ITEM_HANDLE_NAME;

// SortableOverlay component
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

export interface SortableOverlayProps extends Omit<React.ComponentPropsWithoutRef<typeof DragOverlay>, 'children'> {
  container?: Element | DocumentFragment | null;
  children?: ((params: { value: UniqueIdentifier }) => React.ReactNode) | React.ReactNode;
}

export function SortableOverlay(props: SortableOverlayProps) {
  const { container: containerProp, children, ...overlayProps } = props;
  const context = useSortableContext(OVERLAY_NAME);

  const [mounted, setMounted] = React.useState(false);
  React.useLayoutEffect(() => setMounted(true), []);

  const container = containerProp ?? (mounted ? globalThis.document?.body : null);

  if (!container) return null;

  return ReactDOM.createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      modifiers={context.modifiers}
      className={cn(!context.flatCursor && 'cursor-grabbing')}
      {...overlayProps}
    >
      <SortableOverlayContext.Provider value={true}>
        {context.activeId ? (typeof children === 'function' ? children({ value: context.activeId }) : children) : null}
      </SortableOverlayContext.Provider>
    </DragOverlay>,
    container,
  );
}
SortableOverlay.displayName = OVERLAY_NAME;

// Aliases
export const Root = Sortable;
export const Content = SortableContent;
export const Item = SortableItem;
export const ItemHandle = SortableItemHandle;
export const Overlay = SortableOverlay;
