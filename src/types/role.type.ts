export interface Permission {
  id: string;
  name: string;
  url?: string;
  prefix?: string;
  parentId?: string;
  category?: string;
  code?: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface PermissionGroup {
  prefix: string;
  displayName: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface CreateRoleFormData {
  roleName: string;
  description?: string;
  selectedPermissions: Permission[];
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
