import { cn } from '@/utils/classnames';

interface TabsListProps {
  tabs: {
    id: string;
    label: string;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsList = ({ tabs, activeTab, setActiveTab }: TabsListProps) => {
  return (
    <div className="flex w-full gap-3">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={cn(
            'padding-[10px] rounded-3xl bg-gray-10 px-4 py-2 text-sm text-dark transition-all duration-300',
            'hover:bg-primary hover:text-white',
            {
              'bg-primary text-white': activeTab === tab.id,
            },
          )}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsList;
