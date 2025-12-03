import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function FormActions() {
  const t = useTranslations('admin.role.create');
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
        {t('reset')}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('creating')}
          </>
        ) : (
          t('create')
        )}
      </Button>
    </div>
  );
}
