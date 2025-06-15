import { useRouter } from 'next/navigation';
import { FilterConfig } from '@/data/filters';

import { useQueryConfig } from '@/hooks/use-query-config';

import FilterCard from './filter-card';

interface FilterCardGroupProps {
  filters: FilterConfig[];
}

export default function FilterCardGroup({ filters }: FilterCardGroupProps) {
  const router = useRouter();
  const queryConfig = useQueryConfig();

  const handleFilterChange = (newQueryConfig: typeof queryConfig) => {
    // Convert the query config to URL search params
    const searchParams = new URLSearchParams();
    Object.entries(newQueryConfig).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else if (value !== undefined) {
        searchParams.set(key, value.toString());
      }
    });

    // Update the URL with new search params
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {filters.map((filter, idx) => (
        <FilterCard key={idx} {...filter} onFilterChange={handleFilterChange} />
      ))}
    </div>
  );
}
