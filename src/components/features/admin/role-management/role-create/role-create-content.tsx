'use client';

import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import * as zod from 'zod';

import { FormErrors } from '@/components/shared/form-errors';

import { FormActions } from './FormActions';
import { PermissionListSection } from './PermissionListSection';
import { RoleNameSection } from './RoleNameSection';
import { SelectedPermissionsSidebar } from './SelectedPermissionsSidebar';

const createRoleSchema = zod.object({
  roleName: zod
    .string()
    .min(2, 'Tên vai trò phải có ít nhất 2 ký tự')
    .max(50, 'Tên vai trò không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F\u1EA0-\u1EF9]+$/, 'Tên vai trò chỉ được chứa chữ cái, số và khoảng trắng'),
  selectedPermissions: zod
    .array(
      zod.object({
        id: zod.string().min(1),
        name: zod.string().min(1),
        code: zod.string().min(1),
        category: zod.string().min(1),
      }),
    )
    .min(1, 'Vui lòng chọn ít nhất một quyền'),
});

type CreateRoleFormData = zod.infer<typeof createRoleSchema>;

export default function RoleCreateContent() {
  const t = useTranslations('admin.role.create');
  const methods = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { roleName: '', selectedPermissions: [] },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = useCallback(
    async (data: CreateRoleFormData) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Creating role:', data);
        reset();
      } catch (error) {
        console.error('Error creating role:', error);
      }
    },
    [reset],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mx-auto max-w-7xl p-6">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600">{t('description')}</p>
          </div>

          {errors && <FormErrors errors={errors} />}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <RoleNameSection />
              <PermissionListSection />
              <FormActions />
            </div>

            <div className="lg:col-span-1">
              <SelectedPermissionsSidebar />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
