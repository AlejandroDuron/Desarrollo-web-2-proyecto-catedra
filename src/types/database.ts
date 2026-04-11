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
          precio_unitario?: number
        }
        Relationships: [
          {
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
          updated_at?: string
        }
        Relationships: [
          {
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
