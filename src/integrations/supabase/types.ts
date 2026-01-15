export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cantones: {
        Row: {
          created_at: string
          id: string
          nombre: string
          provincia_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          provincia_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          provincia_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cantones_provincia_id_fkey"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          color: string
          created_at: string
          descripcion: string | null
          estado: string
          id: string
          identificador: string | null
          nombre: string
          sucursal_id: string | null
          tiempo_estimado: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          descripcion?: string | null
          estado?: string
          id?: string
          identificador?: string | null
          nombre: string
          sucursal_id?: string | null
          tiempo_estimado?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          descripcion?: string | null
          estado?: string
          id?: string
          identificador?: string | null
          nombre?: string
          sucursal_id?: string | null
          tiempo_estimado?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_sucursal_id_fkey"
            columns: ["sucursal_id"]
            isOneToOne: false
            referencedRelation: "sucursales"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_role_permissions: {
        Row: {
          created_at: string
          custom_role_id: string
          id: string
          permission_id: string
        }
        Insert: {
          created_at?: string
          custom_role_id: string
          id?: string
          permission_id: string
        }
        Update: {
          created_at?: string
          custom_role_id?: string
          id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_role_permissions_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_roles: {
        Row: {
          created_at: string
          descripcion: string | null
          es_sistema: boolean
          id: string
          identificador: string | null
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          es_sistema?: boolean
          id?: string
          identificador?: string | null
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          es_sistema?: boolean
          id?: string
          identificador?: string | null
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      kioskos: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["estado_kiosko"]
          id: string
          identificador: string
          nombre: string
          sucursal_id: string
          ubicacion: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_kiosko"]
          id?: string
          identificador: string
          nombre: string
          sucursal_id: string
          ubicacion?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_kiosko"]
          id?: string
          identificador?: string
          nombre?: string
          sucursal_id?: string
          ubicacion?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kioskos_sucursal_id_fkey"
            columns: ["sucursal_id"]
            isOneToOne: false
            referencedRelation: "sucursales"
            referencedColumns: ["id"]
          },
        ]
      }
      pantalla_publicidad: {
        Row: {
          created_at: string
          id: string
          orden: number
          pantalla_id: string
          publicidad_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          orden?: number
          pantalla_id: string
          publicidad_id: string
        }
        Update: {
          created_at?: string
          id?: string
          orden?: number
          pantalla_id?: string
          publicidad_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pantalla_publicidad_pantalla_id_fkey"
            columns: ["pantalla_id"]
            isOneToOne: false
            referencedRelation: "pantallas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pantalla_publicidad_publicidad_id_fkey"
            columns: ["publicidad_id"]
            isOneToOne: false
            referencedRelation: "publicidad"
            referencedColumns: ["id"]
          },
        ]
      }
      pantallas: {
        Row: {
          created_at: string
          estado: string
          id: string
          identificador: string
          nombre: string
          sucursal_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: string
          id?: string
          identificador: string
          nombre: string
          sucursal_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string
          id?: string
          identificador?: string
          nombre?: string
          sucursal_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pantallas_sucursal_id_fkey"
            columns: ["sucursal_id"]
            isOneToOne: false
            referencedRelation: "sucursales"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apellidos: string
          canton_id: string | null
          cedula: string | null
          created_at: string
          direccion: string | null
          email: string
          id: string
          identificador: string
          nombres: string
          provincia_id: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellidos?: string
          canton_id?: string | null
          cedula?: string | null
          created_at?: string
          direccion?: string | null
          email: string
          id: string
          identificador: string
          nombres?: string
          provincia_id?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellidos?: string
          canton_id?: string | null
          cedula?: string | null
          created_at?: string
          direccion?: string | null
          email?: string
          id?: string
          identificador?: string
          nombres?: string
          provincia_id?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_canton_id_fkey"
            columns: ["canton_id"]
            isOneToOne: false
            referencedRelation: "cantones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_provincia_id_fkey"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
        ]
      }
      provincias: {
        Row: {
          codigo: string
          created_at: string
          id: string
          nombre: string
        }
        Insert: {
          codigo: string
          created_at?: string
          id?: string
          nombre: string
        }
        Update: {
          codigo?: string
          created_at?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      publicidad: {
        Row: {
          created_at: string
          duracion: number
          estado: string
          fecha_creacion: string
          id: string
          identificador: string | null
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_publicidad"]
          updated_at: string
          url_archivo: string
        }
        Insert: {
          created_at?: string
          duracion?: number
          estado?: string
          fecha_creacion?: string
          id?: string
          identificador?: string | null
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_publicidad"]
          updated_at?: string
          url_archivo: string
        }
        Update: {
          created_at?: string
          duracion?: number
          estado?: string
          fecha_creacion?: string
          id?: string
          identificador?: string | null
          nombre?: string
          tipo?: Database["public"]["Enums"]["tipo_publicidad"]
          updated_at?: string
          url_archivo?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      sucursales: {
        Row: {
          canton_id: string
          capacidad_maxima: number | null
          created_at: string
          direccion: string | null
          email: string | null
          estado: string
          id: string
          identificador: string
          nombre: string
          provincia_id: string
          telefono_sms: string | null
          updated_at: string
        }
        Insert: {
          canton_id: string
          capacidad_maxima?: number | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          estado?: string
          id?: string
          identificador: string
          nombre: string
          provincia_id: string
          telefono_sms?: string | null
          updated_at?: string
        }
        Update: {
          canton_id?: string
          capacidad_maxima?: number | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          estado?: string
          id?: string
          identificador?: string
          nombre?: string
          provincia_id?: string
          telefono_sms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sucursales_canton_id_fkey"
            columns: ["canton_id"]
            isOneToOne: false
            referencedRelation: "cantones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sucursales_provincia_id_fkey"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
        ]
      }
      turnos: {
        Row: {
          categoria_id: string
          cliente_identificacion: string | null
          cliente_nombre: string | null
          created_at: string
          estado: Database["public"]["Enums"]["estado_turno"]
          fecha_atencion: string | null
          fecha_creacion: string
          fecha_finalizacion: string | null
          fecha_llamado: string | null
          id: string
          kiosko_id: string | null
          numero: string
          sucursal_id: string
          tiempo_atencion: number | null
          tiempo_espera: number | null
          updated_at: string
        }
        Insert: {
          categoria_id: string
          cliente_identificacion?: string | null
          cliente_nombre?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_turno"]
          fecha_atencion?: string | null
          fecha_creacion?: string
          fecha_finalizacion?: string | null
          fecha_llamado?: string | null
          id?: string
          kiosko_id?: string | null
          numero: string
          sucursal_id: string
          tiempo_atencion?: number | null
          tiempo_espera?: number | null
          updated_at?: string
        }
        Update: {
          categoria_id?: string
          cliente_identificacion?: string | null
          cliente_nombre?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_turno"]
          fecha_atencion?: string | null
          fecha_creacion?: string
          fecha_finalizacion?: string | null
          fecha_llamado?: string | null
          id?: string
          kiosko_id?: string | null
          numero?: string
          sucursal_id?: string
          tiempo_atencion?: number | null
          tiempo_espera?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "turnos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turnos_kiosko_id_fkey"
            columns: ["kiosko_id"]
            isOneToOne: false
            referencedRelation: "kioskos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turnos_sucursal_id_fkey"
            columns: ["sucursal_id"]
            isOneToOne: false
            referencedRelation: "sucursales"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: string
      }
      create_categoria: {
        Args: {
          _color?: string
          _descripcion?: string
          _estado?: string
          _nombre: string
          _sucursal_id?: string
          _tiempo_estimado?: number
        }
        Returns: string
      }
      create_kiosko: {
        Args: {
          _estado?: Database["public"]["Enums"]["estado_kiosko"]
          _identificador: string
          _nombre: string
          _sucursal_id: string
          _ubicacion?: string
        }
        Returns: string
      }
      create_pantalla: {
        Args: {
          _estado?: string
          _identificador: string
          _nombre: string
          _sucursal_id: string
        }
        Returns: string
      }
      create_publicidad: {
        Args: {
          _duracion?: number
          _estado?: string
          _nombre: string
          _tipo: Database["public"]["Enums"]["tipo_publicidad"]
          _url_archivo: string
        }
        Returns: string
      }
      create_sucursal: {
        Args: {
          _canton_id: string
          _capacidad_maxima?: number
          _direccion?: string
          _email?: string
          _estado?: string
          _identificador: string
          _nombre: string
          _provincia_id: string
          _telefono_sms?: string
        }
        Returns: string
      }
      generate_categoria_identifier: { Args: never; Returns: string }
      generate_custom_role_identifier: { Args: never; Returns: string }
      generate_kiosko_identifier: { Args: never; Returns: string }
      generate_pantalla_identifier: { Args: never; Returns: string }
      generate_publicidad_identifier: { Args: never; Returns: string }
      generate_sucursal_identifier: { Args: never; Returns: string }
      generate_user_identifier: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      role_has_permission: {
        Args: {
          _permission_name: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_categoria: {
        Args: {
          _color: string
          _descripcion?: string
          _estado?: string
          _id: string
          _nombre: string
          _sucursal_id?: string
          _tiempo_estimado: number
        }
        Returns: boolean
      }
      update_kiosko: {
        Args: {
          _estado?: Database["public"]["Enums"]["estado_kiosko"]
          _id: string
          _nombre: string
          _sucursal_id: string
          _ubicacion?: string
        }
        Returns: boolean
      }
      update_pantalla: {
        Args: {
          _estado?: string
          _id: string
          _nombre: string
          _sucursal_id: string
        }
        Returns: boolean
      }
      update_publicidad: {
        Args: {
          _duracion?: number
          _estado?: string
          _id: string
          _nombre: string
          _tipo: Database["public"]["Enums"]["tipo_publicidad"]
          _url_archivo: string
        }
        Returns: boolean
      }
      update_sucursal: {
        Args: {
          _canton_id: string
          _capacidad_maxima?: number
          _direccion?: string
          _email?: string
          _estado?: string
          _id: string
          _nombre: string
          _provincia_id: string
          _telefono_sms?: string
        }
        Returns: boolean
      }
      user_has_permission: {
        Args: { _permission_name: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operador" | "supervisor" | "usuario"
      estado_kiosko: "activo" | "inactivo" | "mantenimiento"
      estado_turno: "pendiente" | "en_atencion" | "atendido" | "cancelado"
      tipo_publicidad: "imagen" | "video"
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
  public: {
    Enums: {
      app_role: ["admin", "operador", "supervisor", "usuario"],
      estado_kiosko: ["activo", "inactivo", "mantenimiento"],
      estado_turno: ["pendiente", "en_atencion", "atendido", "cancelado"],
      tipo_publicidad: ["imagen", "video"],
    },
  },
} as const
