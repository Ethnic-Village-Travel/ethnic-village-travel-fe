import { PackageSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';

type EmptyStateNamespace = 'tour.list.empty' | 'tour.detail.similar.empty';

type EmptyStateProps = {
  namespace?: EmptyStateNamespace;
}

export function EmptyState({ namespace = 'tour.list.empty' }: EmptyStateProps) {
  const t = useTranslations(namespace);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <PackageSearch className="h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold">{t('title')}</h3>
      <p className="mt-2 text-sm text-gray-500">{t('description')}</p>
    </div>
  );
}
