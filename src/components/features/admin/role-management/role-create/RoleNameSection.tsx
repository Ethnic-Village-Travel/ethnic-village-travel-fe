'use client';

import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';

export function RoleNameSection() {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <h2 className="font-bold">Role Name</h2>
      <Input id="roleName" {...register('roleName')} disabled={isSubmitting} placeholder="e.g. Content Editor" />
    </div>
  );
}
