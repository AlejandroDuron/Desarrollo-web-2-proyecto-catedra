export const VALID_ROLES = [
  "admin_general",
  "admin_empresa",
  "empleado",
] as const;

export type Role = (typeof VALID_ROLES)[number];

export const ROLE_HOME_PATHS: Record<Role, string> = {
  admin_general: "/admin",
  admin_empresa: "/empresa",
  empleado: "/empleado/canjes",
};

export function isRole(value: string | null | undefined): value is Role {
  return VALID_ROLES.includes(value as Role);
}

export function getDefaultPathByRole(role: Role): string {
  return ROLE_HOME_PATHS[role];
}
