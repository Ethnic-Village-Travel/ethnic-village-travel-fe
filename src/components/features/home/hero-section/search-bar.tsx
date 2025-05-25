'use client';

import { useState } from 'react';
import { cn } from '@/utils';
import { CalendarIcon, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const locations = [
  { value: 'sapa', label: 'Sa Pa' },
  { value: 'hagiang', label: 'Hà Giang' },
  { value: 'laocai', label: 'Lào Cai' },
  { value: 'laichau', label: 'Lai Châu' },
];

interface SearchBarProps {
  className?: string;
  onSearch?: (searchData: SearchData) => void;
}

interface SearchData {
  location: string;
  date: Date | undefined;
  keyword: string;
}

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchData, setSearchData] = useState<SearchData>({
    location: '',
    date: undefined,
    keyword: '',
  });

  const handleSearch = () => {
    onSearch?.(searchData);
  };

  return (
    <div
      className={cn('flex items-center gap-2 rounded-xl border-[1px] border-primary-400 bg-white p-2 px-4', className)}
    >
      <Select value={searchData.location} onValueChange={value => setSearchData({ ...searchData, location: value })}>
        <SelectTrigger className="flex h-fit max-w-60 gap-4 border-0 bg-transparent p-2 py-1 text-left font-semibold shadow-none focus:ring-0 focus-visible:ring-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-5">
            <MapPin className="h-6 w-6 text-primary-500" />
          </div>
          <SelectValue placeholder="Chọn địa điểm" className="text-base font-semibold" color="dark" />
        </SelectTrigger>
        <SelectContent>
          {locations.map(location => (
            <SelectItem key={location.value} value={location.value} className="text-base font-semibold">
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator className="mx-1 h-full w-[0.5px] bg-gray-20" />

      <Popover>
        <PopoverTrigger asChild className="h-fit max-w-44 py-1 shadow-none hover:bg-primary-5">
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start border-0 bg-transparent px-2 text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-5">
              <CalendarIcon className="h-6 w-6 text-primary-500" />
            </div>
            {date ? date.toLocaleDateString('vi-VN') : <span>Chọn ngày</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 font-semibold text-dark" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={newDate => {
              setDate(newDate);
              setSearchData({ ...searchData, date: newDate });
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Separator className="mx-1 h-full w-[0.5px] bg-gray-20" />

      <div className="flex w-full flex-grow items-center gap-1">
        <div className="flex h-12 min-w-12 items-center justify-center rounded-full bg-primary-5">
          <MapPin className="h-6 w-6 text-primary-500" />
        </div>

        <Input
          type="text"
          placeholder="Tìm kiếm điểm đến..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          value={searchData.keyword}
          onChange={e => setSearchData({ ...searchData, keyword: e.target.value })}
        />
      </div>

      <Button className="h-fit rounded-full bg-primary-button px-5 py-2" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </div>
  );
}
