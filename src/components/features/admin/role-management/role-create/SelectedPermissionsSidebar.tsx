'use client';

import { PERMISSION_CATEGORIES } from '@/data/mocks/roles';
import { useFormContext } from 'react-hook-form';

import { Permission } from '@/types/role.type';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SelectedPermissionsSidebar() {
  const { watch } = useFormContext();
  const selectedPermissions: Permission[] = watch('selectedPermissions') || [];
  const selectedPermissionsByCategory = selectedPermissions.reduce((acc: Record<string, Permission[]>, permission) => {
    acc[permission.category] = [...(acc[permission.category] || []), permission];
    return acc;
  }, {});

  console.log(selectedPermissionsByCategory);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>Selected Permissions</span>
            <Badge variant="outline">{selectedPermissions.length}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedPermissions.length === 0 ? (
          <p className="text-sm text-gray-500">No permissions selected yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.keys(selectedPermissionsByCategory).map(category => (
              <div key={category}>
                <h5 className="mb-2 font-semibold">{PERMISSION_CATEGORIES.find(cat => cat.id === category)?.name}</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedPermissionsByCategory[category].map((permission: Permission) => (
                    <Badge key={permission.id} variant="gray" className="w-fit text-sm">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
