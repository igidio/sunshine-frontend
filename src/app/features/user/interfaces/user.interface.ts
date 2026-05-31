import { ProfileInterface } from './profile.interface';

export const user_roles = ['superuser', 'admin', 'employer', 'customer'] as const;
export type UserRole = (typeof user_roles)[number];

export const user_permissions = [
  'SUPPLIER',
  'PRODUCT',
  'CATEGORY',
  'MOVEMENT',
  'TREATMENT',
  'CUSTOMER',
] as const;
export type UserPermission = (typeof user_permissions)[number];

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  email_verified_at?: Date;
  phone_number?: string;
  role: UserRole;
  permissions: string;
  profile_id: number;
  disabled_at?: null;
  created_at?: Date;
  updated_at?: Date;
  profile: ProfileInterface;
}

export const roles_labeled = {
  superuser: 'Superusuario',
  admin: 'Administrador',
  employer: 'Empleado',
  customer: 'Cliente',
};

export const permissions_labeled = {
  SUPPLIER: 'Modificar proveedores',
  PRODUCT: 'Modificar productos',
  CATEGORY: 'Modificar categorías',
  MOVEMENT: 'Modificar movimientos',
  TREATMENT: 'Modificar servicios',
  CUSTOMER: 'Modificar clientes',
};
