export const roles = ["admin", "empresa", "empleado"] as const;

export type Role = (typeof roles)[number];
