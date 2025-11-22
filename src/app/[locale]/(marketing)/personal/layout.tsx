import { PersonalNavigationTab } from '@/components/features/user/layout';

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto mt-10 flex gap-8 px-4 pb-10">
      <div className="w-[300px] flex-shrink-0">
        <PersonalNavigationTab />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
