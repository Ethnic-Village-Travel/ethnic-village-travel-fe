'use client';

import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import { Loader, Trash } from 'lucide-react';

import { Tour } from '@/types/tour.type';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

// import { deleteTour } from '../_lib/actions';

interface DeleteTourDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tours: Row<Tour>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export default function DeleteTourDialog({ tours, showTrigger = true, onSuccess, ...props }: DeleteTourDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { toast } = useToast();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  function onDelete() {
    // startDeleteTransition(async () => {
    //   const { error } = await deleteTour({
    //     ids: tours.map(task => task.id),
    //   });
    //   if (error) {
    //     toast({ title: error, variant: 'destructive' });
    //     return;
    //   }
    //   props.onOpenChange?.(false);
    //   toast({ title: 'Tour deleted', variant: 'default' });
    //   onSuccess?.();
    // });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete ({tours.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{' '}
              <span className="font-medium">{tours.length}</span>
              {tours.length === 1 ? ' task' : ' tours'} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({tours.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className="font-medium">{tours.length}</span>
            {tours.length === 1 ? ' task' : ' tours'} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button aria-label="Delete selected rows" variant="destructive" onClick={onDelete} disabled={isDeletePending}>
            {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
