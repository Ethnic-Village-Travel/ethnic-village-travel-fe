'use client';

import { FilterItem, FILTERS } from '@/data/mocks/filters';

import { useEthnicList } from '@/hooks/api/useEthnic';
import { useLocationList } from '@/hooks/api/useLocation';

import FilterCardGroup from '../filter-card/filter-card-group';
import PriceFilterCard from '../filter-card/price-filter-card';

export default function FilterSection() {
  const { data: locationRes } = useLocationList();
  const locationItems: FilterItem[] =
    locationRes?.data.map(l => ({
      label: l.city,
      value: l.city,
      id: l.id,
    })) || [];

  const { data: ethnicRes } = useEthnicList();
  const ethnicItems: FilterItem[] =
    ethnicRes?.data.map(e => ({
      label: e.name,
      value: e.code,
      id: e.id,
    })) || [];

  const modifiedFilters = {
    ...FILTERS,
    location: {
      ...FILTERS.location,
      items: locationItems,
      isTranslated: true,
    },
    ethnic: {
      ...FILTERS.ethnic,
      items: ethnicItems,
      isTranslated: true,
    },
  };

  return (
    <div className="w-full md:w-64">
      <div className="flex flex-col gap-4">
        <PriceFilterCard />
        <FilterCardGroup filters={Object.values(modifiedFilters)} />
      </div>
    </div>
  );
}
