'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';

export const AssignedAvailableDatesHeader = () => {
  const t = useTranslations('admin');
  const { user } = useAuthStore();

  // Determine title based on user role
  const isAdmin = user?.roles?.includes('ADMIN');
  const title = isAdmin ? t('tour.assigned_dates.all_assignments') : t('tour.assigned_dates.my_assignments');
  const description = isAdmin
    ? t('tour.assigned_dates.all_assignments_description')
    : t('tour.assigned_dates.my_assignments_description');

  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-xl text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
