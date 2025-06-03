import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import SearchCommand from '@/components/features/admin/search-command';

export default function AdminHeader() {
  return (
    <div className="h-[64px] w-full px-4 py-2">
      <div className="flex items-center justify-between py-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-end gap-5">
          <SearchCommand />
          <Button variant="ghost" className="fit-content px-2 py-2">
            <Bell className="!h-5 !w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
