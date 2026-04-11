export interface Database {
  public: {
    Tables: {
      empleados: {
        Row: {
          id: string;
          rol: Database["public"]["Enums"]["rol_empleado"];
          id_empresa: string | null;
          activo: boolean;
        };
        Insert: {
          id: string;
          rol: Database["public"]["Enums"]["rol_empleado"];
          id_empresa?: string | null;
          activo?: boolean;
        };
        Update: {
          id?: string;
          rol?: Database["public"]["Enums"]["rol_empleado"];
          id_empresa?: string | null;
          activo?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      rol_empleado: "admin_general" | "admin_empresa" | "empleado";
    };
  };
}
