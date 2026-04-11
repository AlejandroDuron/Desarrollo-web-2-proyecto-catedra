export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clientes: {
        Row: {
<<<<<<< HEAD
          id: string
          nombres: string
          apellidos: string | null
          telefono: string | null
          dui: string | null
          direccion: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          nombres: string
          apellidos?: string | null
          telefono?: string | null
          dui?: string | null
          direccion?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nombres?: string
          apellidos?: string | null
          telefono?: string | null
          dui?: string | null
          direccion?: string | null
          created_at?: string | null
        }
        Relationships: []
      }

      cupones: {
        Row: {
          codigo_unico: string
          id_oferta: string
          id_cliente: string
          estado_cupon: Database['public']['Enums']['estado_cupon']
          fecha_compra: string | null
          fecha_canje: string | null
          id_empleado_canje: string | null
          id_detalle_orden: string | null
        }
        Insert: {
          codigo_unico: string
          id_oferta: string
          id_cliente: string
          estado_cupon?: Database['public']['Enums']['estado_cupon']
          fecha_compra?: string | null
          fecha_canje?: string | null
          id_empleado_canje?: string | null
          id_detalle_orden?: string | null
        }
        Update: {
          codigo_unico?: string
          id_oferta?: string
          id_cliente?: string
          estado_cupon?: Database['public']['Enums']['estado_cupon']
          fecha_compra?: string | null
          fecha_canje?: string | null
          id_empleado_canje?: string | null
          id_detalle_orden?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'cupones_id_oferta_fkey'
            columns: ['id_oferta']
            isOneToOne: false
            referencedRelation: 'ofertas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cupones_id_cliente_fkey'
            columns: ['id_cliente']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cupones_id_empleado_canje_fkey'
            columns: ['id_empleado_canje']
            isOneToOne: false
            referencedRelation: 'empleados'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cupones_id_detalle_orden_fkey'
            columns: ['id_detalle_orden']
            isOneToOne: false
            referencedRelation: 'detalle_orden'
            referencedColumns: ['id']
          }
        ]
      }

      detalle_orden: {
        Row: {
          id: string
          id_orden: string
          id_oferta: string
          cantidad: number
          precio_unitario: number
        }
        Insert: {
          id?: string
          id_orden: string
          id_oferta: string
          cantidad: number
          precio_unitario: number
        }
        Update: {
          id?: string
          id_orden?: string
          id_oferta?: string
          cantidad?: number
=======
          apellidos: string | null
          created_at: string | null
          direccion: string | null
          dui: string | null
          id: string
          nombres: string
          telefono: string | null
        }
        Insert: {
          apellidos?: string | null
          created_at?: string | null
          direccion?: string | null
          dui?: string | null
          id: string
          nombres: string
          telefono?: string | null
        }
        Update: {
          apellidos?: string | null
          created_at?: string | null
          direccion?: string | null
          dui?: string | null
          id?: string
          nombres?: string
          telefono?: string | null
        }
        Relationships: []
      }
      cupones: {
        Row: {
          codigo_unico: string
          estado_cupon: Database["public"]["Enums"]["estado_cupon"]
          fecha_canje: string | null
          fecha_compra: string | null
          id_cliente: string
          id_detalle_orden: string | null
          id_empleado_canje: string | null
          id_oferta: string
        }
        Insert: {
          codigo_unico: string
          estado_cupon?: Database["public"]["Enums"]["estado_cupon"]
          fecha_canje?: string | null
          fecha_compra?: string | null
          id_cliente: string
          id_detalle_orden?: string | null
          id_empleado_canje?: string | null
          id_oferta: string
        }
        Update: {
          codigo_unico?: string
          estado_cupon?: Database["public"]["Enums"]["estado_cupon"]
          fecha_canje?: string | null
          fecha_compra?: string | null
          id_cliente?: string
          id_detalle_orden?: string | null
          id_empleado_canje?: string | null
          id_oferta?: string
        }
        Relationships: [
          {
            foreignKeyName: "cupones_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupones_id_detalle_orden_fkey"
            columns: ["id_detalle_orden"]
            isOneToOne: false
            referencedRelation: "detalle_orden"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupones_id_empleado_canje_fkey"
            columns: ["id_empleado_canje"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupones_id_oferta_fkey"
            columns: ["id_oferta"]
            isOneToOne: false
            referencedRelation: "ofertas"
            referencedColumns: ["id"]
          },
        ]
      }
      detalle_orden: {
        Row: {
          cantidad: number
          id: string
          id_oferta: string
          id_orden: string
          precio_unitario: number
        }
        Insert: {
          cantidad: number
          id?: string
          id_oferta: string
          id_orden: string
          precio_unitario: number
        }
        Update: {
          cantidad?: number
          id?: string
          id_oferta?: string
          id_orden?: string
>>>>>>> 3cb3134 (modulo empleado)
          precio_unitario?: number
        }
        Relationships: [
          {
<<<<<<< HEAD
            foreignKeyName: 'detalle_orden_id_orden_fkey'
            columns: ['id_orden']
            isOneToOne: false
            referencedRelation: 'ordenes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'detalle_orden_id_oferta_fkey'
            columns: ['id_oferta']
            isOneToOne: false
            referencedRelation: 'ofertas'
            referencedColumns: ['id']
          }
        ]
      }

      empleados: {
        Row: {
          id: string
          id_empresa: string | null
          nombres: string
          apellidos: string
          created_at: string | null
          rol: Database['public']['Enums']['rol_empleado']
          activo: boolean
          updated_at: string
        }
        Insert: {
          id: string
          id_empresa?: string | null
          nombres: string
          apellidos: string
          created_at?: string | null
          rol?: Database['public']['Enums']['rol_empleado']
          activo?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          id_empresa?: string | null
          nombres?: string
          apellidos?: string
          created_at?: string | null
          rol?: Database['public']['Enums']['rol_empleado']
          activo?: boolean
=======
            foreignKeyName: "detalle_orden_id_oferta_fkey"
            columns: ["id_oferta"]
            isOneToOne: false
            referencedRelation: "ofertas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_orden_id_orden_fkey"
            columns: ["id_orden"]
            isOneToOne: false
            referencedRelation: "ordenes"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados: {
        Row: {
          activo: boolean
          apellidos: string
          created_at: string | null
          id: string
          id_empresa: string | null
          nombres: string
          rol: Database["public"]["Enums"]["rol_empleado"]
          updated_at: string
        }
        Insert: {
          activo?: boolean
          apellidos: string
          created_at?: string | null
          id: string
          id_empresa?: string | null
          nombres: string
          rol?: Database["public"]["Enums"]["rol_empleado"]
          updated_at?: string
        }
        Update: {
          activo?: boolean
          apellidos?: string
          created_at?: string | null
          id?: string
          id_empresa?: string | null
          nombres?: string
          rol?: Database["public"]["Enums"]["rol_empleado"]
>>>>>>> 3cb3134 (modulo empleado)
          updated_at?: string
        }
        Relationships: [
          {
<<<<<<< HEAD
            foreignKeyName: 'empleados_id_empresa_fkey'
            columns: ['id_empresa']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          }
        ]
      }

      empresas: {
        Row: {
          id: string
          codigo_empresa: string
          nombre_empresa: string
          direccion: string
          nombre_contacto: string
          telefono: string
          correo: string
          porcentaje_comision: number
          id_rubro: number
          created_at: string | null
        }
        Insert: {
          id?: string
          codigo_empresa: string
          nombre_empresa: string
          direccion: string
          nombre_contacto: string
          telefono: string
          correo: string
          porcentaje_comision: number
          id_rubro: number
          created_at?: string | null
        }
        Update: {
          id?: string
          codigo_empresa?: string
          nombre_empresa?: string
          direccion?: string
          nombre_contacto?: string
          telefono?: string
          correo?: string
          porcentaje_comision?: number
          id_rubro?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'empresas_id_rubro_fkey'
            columns: ['id_rubro']
            isOneToOne: false
            referencedRelation: 'rubros'
            referencedColumns: ['id']
          }
        ]
      }

      ofertas: {
        Row: {
          id: string
          id_empresa: string
          titulo: string
          precio_regular: number
          precio_oferta: number
          fecha_inicio: string
          fecha_fin: string
          fecha_limite_uso: string
          cantidad_limite: number | null
          descripcion: string
          otros_detalles: string | null
          estado: Database['public']['Enums']['estado_oferta']
          justificacion_rechazo: string | null
          created_at: string | null
          image_url: string | null
          expires_at: string | null
          stock: number | null
        }
        Insert: {
          id?: string
          id_empresa: string
          titulo: string
          precio_regular: number
          precio_oferta: number
          fecha_inicio: string
          fecha_fin: string
          fecha_limite_uso: string
          cantidad_limite?: number | null
          descripcion: string
          otros_detalles?: string | null
          estado?: Database['public']['Enums']['estado_oferta']
          justificacion_rechazo?: string | null
          created_at?: string | null
          image_url?: string | null
          expires_at?: string | null
          stock?: number | null
        }
        Update: {
          id?: string
          id_empresa?: string
          titulo?: string
          precio_regular?: number
          precio_oferta?: number
          fecha_inicio?: string
          fecha_fin?: string
          fecha_limite_uso?: string
          cantidad_limite?: number | null
          descripcion?: string
          otros_detalles?: string | null
          estado?: Database['public']['Enums']['estado_oferta']
          justificacion_rechazo?: string | null
          created_at?: string | null
          image_url?: string | null
          expires_at?: string | null
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'ofertas_id_empresa_fkey'
            columns: ['id_empresa']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          }
        ]
      }

      ordenes: {
        Row: {
          id: string
          id_cliente: string
          total_pagado: number
          fecha_compra: string | null
        }
        Insert: {
          id?: string
          id_cliente: string
          total_pagado: number
          fecha_compra?: string | null
        }
        Update: {
          id?: string
          id_cliente?: string
          total_pagado?: number
          fecha_compra?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ordenes_id_cliente_fkey'
            columns: ['id_cliente']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          }
        ]
      }

=======
            foreignKeyName: "empleados_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          codigo_empresa: string
          correo: string
          created_at: string | null
          direccion: string
          id: string
          id_rubro: number
          nombre_contacto: string
          nombre_empresa: string
          porcentaje_comision: number
          telefono: string
        }
        Insert: {
          codigo_empresa: string
          correo: string
          created_at?: string | null
          direccion: string
          id?: string
          id_rubro: number
          nombre_contacto: string
          nombre_empresa: string
          porcentaje_comision: number
          telefono: string
        }
        Update: {
          codigo_empresa?: string
          correo?: string
          created_at?: string | null
          direccion?: string
          id?: string
          id_rubro?: number
          nombre_contacto?: string
          nombre_empresa?: string
          porcentaje_comision?: number
          telefono?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_id_rubro_fkey"
            columns: ["id_rubro"]
            isOneToOne: false
            referencedRelation: "rubros"
            referencedColumns: ["id"]
          },
        ]
      }
      ofertas: {
        Row: {
          cantidad_limite: number | null
          created_at: string | null
          descripcion: string
          estado: Database["public"]["Enums"]["estado_oferta"]
          expires_at: string | null
          fecha_fin: string
          fecha_inicio: string
          fecha_limite_uso: string
          id: string
          id_empresa: string
          image_url: string | null
          justificacion_rechazo: string | null
          otros_detalles: string | null
          precio_oferta: number
          precio_regular: number
          stock: number | null
          titulo: string
        }
        Insert: {
          cantidad_limite?: number | null
          created_at?: string | null
          descripcion: string
          estado?: Database["public"]["Enums"]["estado_oferta"]
          expires_at?: string | null
          fecha_fin: string
          fecha_inicio: string
          fecha_limite_uso: string
          id?: string
          id_empresa: string
          image_url?: string | null
          justificacion_rechazo?: string | null
          otros_detalles?: string | null
          precio_oferta: number
          precio_regular: number
          stock?: number | null
          titulo: string
        }
        Update: {
          cantidad_limite?: number | null
          created_at?: string | null
          descripcion?: string
          estado?: Database["public"]["Enums"]["estado_oferta"]
          expires_at?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          fecha_limite_uso?: string
          id?: string
          id_empresa?: string
          image_url?: string | null
          justificacion_rechazo?: string | null
          otros_detalles?: string | null
          precio_oferta?: number
          precio_regular?: number
          stock?: number | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "ofertas_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes: {
        Row: {
          fecha_compra: string | null
          id: string
          id_cliente: string
          total_pagado: number
        }
        Insert: {
          fecha_compra?: string | null
          id?: string
          id_cliente: string
          total_pagado: number
        }
        Update: {
          fecha_compra?: string | null
          id?: string
          id_cliente?: string
          total_pagado?: number
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
>>>>>>> 3cb3134 (modulo empleado)
      rubros: {
        Row: {
          id: number
          nombre_rubro: string
        }
        Insert: {
          id?: number
          nombre_rubro: string
        }
        Update: {
          id?: number
          nombre_rubro?: string
        }
        Relationships: []
      }
    }
<<<<<<< HEAD

    Views: Record<string, never>

    Functions: Record<string, never>

    Enums: {
      rol_empleado: 'admin_general' | 'admin_empresa' | 'empleado'
      estado_cupon: 'Disponible' | 'Canjeado' | 'Vencido'
      estado_oferta:
        | 'En espera de aprobación'
        | 'Oferta aprobada'
        | 'Oferta rechazada'
        | 'Oferta descartada'
    }
  }
}
=======
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estado_cupon: "Disponible" | "Canjeado" | "Vencido"
      estado_oferta:
        | "En espera de aprobación"
        | "Oferta aprobada"
        | "Oferta rechazada"
        | "Oferta descartada"
      rol_empleado: "admin_general" | "admin_empresa" | "empleado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      estado_cupon: ["Disponible", "Canjeado", "Vencido"],
      estado_oferta: [
        "En espera de aprobación",
        "Oferta aprobada",
        "Oferta rechazada",
        "Oferta descartada",
      ],
      rol_empleado: ["admin_general", "admin_empresa", "empleado"],
    },
  },
} as const

>>>>>>> 3cb3134 (modulo empleado)
