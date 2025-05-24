import { FILTERS } from '@/data/filters';

import { FilterCardGroup, PriceFilterCard } from '../filter-card';

export default function FilterSection() {
  return (
    <div className="w-full md:w-64">
      <div className="flex flex-col gap-4">
        <PriceFilterCard />
        <FilterCardGroup filters={FILTERS} />
      </div>
    </div>
  );
}
