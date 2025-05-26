export interface RolesModel {
  id?: number;
  name: string;
  description?: string;
  // Puede ser array de IDs o array de objetos
  permissions?: number[] | PermissionModel[];
}

export interface PermissionModel {
  id?: number;
  name: string;
  description?: string;
}