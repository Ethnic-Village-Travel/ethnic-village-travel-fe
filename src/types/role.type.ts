export interface Permission {
  id: string;
  name: string;
  code: string;
  category: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface CreateRoleFormData {
  name: string;
  permissions: Permission[];
}

export interface CreateRoleState {
  roleName: string;
  selectedPermissions: Permission[];
  isSubmitting: boolean;
  errors: {
    name?: string;
    permissions?: string;
    general?: string;
  };
}

export type PermissionCategoryId = 'tour' | 'article' | 'user' | 'booking' | 'payment' | 'report' | 'system';
