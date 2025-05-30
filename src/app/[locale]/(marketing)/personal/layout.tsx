import { PersonalNavigationTab } from '@/components/features/personal/layout';

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 flex gap-8 px-10">
      <PersonalNavigationTab />
      {children}
    </div>
  );
}
