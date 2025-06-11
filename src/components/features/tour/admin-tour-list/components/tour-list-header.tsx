import Link from 'next/link';
import { RouteConstant } from '@/constants/route';
import { Download, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const TourListHeader = () => {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold">Tour List</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Manage tour details, availability, and booking status in one place.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" className="gap-2">
          <span className="text-lg font-semibold">Import</span>
          <Download className="h-[18px] w-[18px]" />
        </Button>
        <Link href={RouteConstant.admin_tour_create}>
          <Button className="gap-2">
            <span className="text-lg font-semibold">Add Tour</span>
            <UserPlus className="h-[18px] w-[18px]" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
