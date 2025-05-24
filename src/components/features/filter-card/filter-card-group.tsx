import FilterCard from './filter-card';

interface FilterCardGroupProps {
  filters: Array<{ title: string; items: string[]; maxVisible?: number }>;
}

export default function FilterCardGroup({ filters }: FilterCardGroupProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {filters.map((filter, idx) => (
        <FilterCard key={idx} {...filter} />
      ))}
    </div>
  );
}
