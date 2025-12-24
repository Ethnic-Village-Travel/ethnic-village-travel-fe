import { PersonalNavigationTab } from '@/components/features/user/layout';

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto flex gap-6 px-4 py-6 lg:gap-8 lg:py-8">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden w-[280px] flex-shrink-0 lg:block">
          <PersonalNavigationTab />
        </div>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden">
        <PersonalNavigationTab />
      </div>
    </div>
  );
}
