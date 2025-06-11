'use client';

import { useCallback } from 'react';
import { PERMISSION_CATEGORIES } from '@/data/roles';
import { useFormContext } from 'react-hook-form';

import { Permission } from '@/types/role.type';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function PermissionListSection() {
  const {
    watch,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = useFormContext();

  const selectedPermissions = watch('selectedPermissions') || [];

  const onPermissionsChange = useCallback(
    (permissions: Permission[]) => {
      setValue('selectedPermissions', permissions, { shouldValidate: true });
      trigger('selectedPermissions');
    },
    [setValue, trigger],
  );

  const permissionCategories = PERMISSION_CATEGORIES;

  const handleCategoryToggle = useCallback(
    (categoryName: string, checked: boolean) => {
      const category = permissionCategories.find(cat => cat.id === categoryName);
      if (!category) return;

      if (checked) {
        const newPermissions = [...selectedPermissions];
        category.permissions.forEach(permission => {
          if (!newPermissions.find(p => p.id === permission.id)) {
            newPermissions.push(permission);
          }
        });
        onPermissionsChange(newPermissions);
      } else {
        const filteredPermissions = selectedPermissions.filter(
          (permission: Permission) => permission.category !== category.id,
        );
        onPermissionsChange(filteredPermissions);
      }
    },
    [selectedPermissions, onPermissionsChange, permissionCategories],
  );

  const handlePermissionToggle = useCallback(
    (permission: Permission, checked: boolean) => {
      if (checked) {
        onPermissionsChange([...selectedPermissions, permission]);
      } else {
        const filteredPermissions = selectedPermissions.filter((p: Permission) => p.id !== permission.id);
        onPermissionsChange(filteredPermissions);
      }
    },
    [selectedPermissions, onPermissionsChange],
  );

  const isPermissionSelected = useCallback(
    (permissionId: string): boolean => {
      return selectedPermissions.some((p: Permission) => p.id === permissionId);
    },
    [selectedPermissions],
  );

  const isCategorySelected = useCallback(
    (categoryName: string): boolean => {
      const category = permissionCategories.find(cat => cat.name === categoryName);
      if (!category) return false;

      return category.permissions.every((permission: Permission) =>
        selectedPermissions.some((p: Permission) => p.id === permission.id),
      );
    },
    [selectedPermissions, permissionCategories],
  );

  return (
    <div className="space-y-2">
      <h2 className="font-bold">Permissions</h2>

      <div className="w-full space-y-4">
        {permissionCategories.map(category => (
          <div key={category.name} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Checkbox
                id={`category-${category.name}`}
                checked={isCategorySelected(category.name)}
                onCheckedChange={checked => handleCategoryToggle(category.id, !!checked)}
                aria-label={`Select all ${category.name} permissions`}
                disabled={isSubmitting}
              />
              <Label htmlFor={`category-${category.name}`} className="font-semibold">
                {category.name}
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-6 pt-2">
              {category.permissions.map(permission => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={isPermissionSelected(permission.id)}
                    onCheckedChange={checked => handlePermissionToggle(permission, !!checked)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={permission.id}>{permission.name}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
