export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      provincias: {
        Row: {
          id: number;
          nombre: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      cantones: {
        Row: {
          id: number;
          nombre: string;
          provincia_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          provincia_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          provincia_id?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cantones_provincia_id_fkey";
            columns: ["provincia_id"];
            referencedRelation: "provincias";
            referencedColumns: ["id"];
          }
        ];
      };

      usuarios: {
        Row: {
          id: number;
          auth_id: string | null; // UUID
          nombres: string;
          apellidos: string;
          email: string;
          telefono: string | null;
          cedula: string | null;
          provincia_id: number | null;
          canton_id: number | null;
          direccion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          auth_id?: string | null;
          nombres?: string;
          apellidos?: string;
          email: string;
          telefono?: string | null;
          cedula?: string | null;
          provincia_id?: number | null;
          canton_id?: number | null;
          direccion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          auth_id?: string | null;
          nombres?: string;
          apellidos?: string;
          email?: string;
          telefono?: string | null;
          cedula?: string | null;
          provincia_id?: number | null;
          canton_id?: number | null;
          direccion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "usuarios_auth_id_fkey";
            columns: ["auth_id"];
            referencedRelation: "users"; // auth.users
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "usuarios_provincia_id_fkey";
            columns: ["provincia_id"];
            referencedRelation: "provincias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "usuarios_canton_id_fkey";
            columns: ["canton_id"];
            referencedRelation: "cantones";
            referencedColumns: ["id"];
          }
        ];
      };

      sucursales: {
        Row: {
          id: number;
          nombre: string;
          provincia_id: number;
          canton_id: number;
          direccion: string | null;
          email: string | null;
          telefono_sms: string | null;
          capacidad_maxima: number | null;
          estado: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          provincia_id: number;
          canton_id: number;
          direccion?: string | null;
          email?: string | null;
          telefono_sms?: string | null;
          capacidad_maxima?: number | null;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          provincia_id?: number;
          canton_id?: number;
          direccion?: string | null;
          email?: string | null;
          telefono_sms?: string | null;
          capacidad_maxima?: number | null;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sucursales_provincia_id_fkey";
            columns: ["provincia_id"];
            referencedRelation: "provincias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sucursales_canton_id_fkey";
            columns: ["canton_id"];
            referencedRelation: "cantones";
            referencedColumns: ["id"];
          }
        ];
      };

      categorias: {
        Row: {
          id: number;
          nombre: string;
          descripcion: string | null;
          color: string;
          tiempo_estimado: number;
          sucursal_id: number | null;
          estado: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          descripcion?: string | null;
          color?: string;
          tiempo_estimado?: number;
          sucursal_id?: number | null;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          descripcion?: string | null;
          color?: string;
          tiempo_estimado?: number;
          sucursal_id?: number | null;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categorias_sucursal_id_fkey";
            columns: ["sucursal_id"];
            referencedRelation: "sucursales";
            referencedColumns: ["id"];
          }
        ];
      };

      kioskos: {
        Row: {
          id: number;
          nombre: string;
          sucursal_id: number;
          ubicacion: string | null;
          estado: Database["public"]["Enums"]["estado_kiosko"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          sucursal_id: number;
          ubicacion?: string | null;
          estado?: Database["public"]["Enums"]["estado_kiosko"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          sucursal_id?: number;
          ubicacion?: string | null;
          estado?: Database["public"]["Enums"]["estado_kiosko"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "kioskos_sucursal_id_fkey";
            columns: ["sucursal_id"];
            referencedRelation: "sucursales";
            referencedColumns: ["id"];
          }
        ];
      };

      pantallas: {
        Row: {
          id: number;
          nombre: string;
          sucursal_id: number;
          estado: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          sucursal_id: number;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          sucursal_id?: number;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pantallas_sucursal_id_fkey";
            columns: ["sucursal_id"];
            referencedRelation: "sucursales";
            referencedColumns: ["id"];
          }
        ];
      };

      publicidad: {
        Row: {
          id: number;
          nombre: string;
          tipo: Database["public"]["Enums"]["tipo_publicidad"];
          url_archivo: string;
          duracion: number;
          estado: string;
          fecha_creacion: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          tipo: Database["public"]["Enums"]["tipo_publicidad"];
          url_archivo: string;
          duracion?: number;
          estado?: string;
          fecha_creacion?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          tipo?: Database["public"]["Enums"]["tipo_publicidad"];
          url_archivo?: string;
          duracion?: number;
          estado?: string;
          fecha_creacion?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      pantalla_publicidad: {
        Row: {
          id: number;
          pantalla_id: number;
          publicidad_id: number;
          orden: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          pantalla_id: number;
          publicidad_id: number;
          orden?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          pantalla_id?: number;
          publicidad_id?: number;
          orden?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pantalla_publicidad_pantalla_id_fkey";
            columns: ["pantalla_id"];
            referencedRelation: "pantallas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pantalla_publicidad_publicidad_id_fkey";
            columns: ["publicidad_id"];
            referencedRelation: "publicidad";
            referencedColumns: ["id"];
          }
        ];
      };

      turnos: {
        Row: {
          id: number;
          numero: string;
          categoria_id: number;
          sucursal_id: number;
          kiosko_id: number | null;
          cliente_nombre: string | null;
          cliente_identificacion: string | null;
          estado: Database["public"]["Enums"]["estado_turno"];
          fecha_creacion: string;
          fecha_llamado: string | null;
          fecha_atencion: string | null;
          fecha_finalizacion: string | null;
          tiempo_espera: number | null;
          tiempo_atencion: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          numero: string;
          categoria_id: number;
          sucursal_id: number;
          kiosko_id?: number | null;
          cliente_nombre?: string | null;
          cliente_identificacion?: string | null;
          estado?: Database["public"]["Enums"]["estado_turno"];
          fecha_creacion?: string;
          fecha_llamado?: string | null;
          fecha_atencion?: string | null;
          fecha_finalizacion?: string | null;
          tiempo_espera?: number | null;
          tiempo_atencion?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          numero?: string;
          categoria_id?: number;
          sucursal_id?: number;
          kiosko_id?: number | null;
          cliente_nombre?: string | null;
          cliente_identificacion?: string | null;
          estado?: Database["public"]["Enums"]["estado_turno"];
          fecha_creacion?: string;
          fecha_llamado?: string | null;
          fecha_atencion?: string | null;
          fecha_finalizacion?: string | null;
          tiempo_espera?: number | null;
          tiempo_atencion?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "turnos_categoria_id_fkey";
            columns: ["categoria_id"];
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "turnos_sucursal_id_fkey";
            columns: ["sucursal_id"];
            referencedRelation: "sucursales";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "turnos_kiosko_id_fkey";
            columns: ["kiosko_id"];
            referencedRelation: "kioskos";
            referencedColumns: ["id"];
          }
        ];
      };

      permisos: {
        Row: {
          id: number;
          nombre: string;
          descripcion: string;
          categoria: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          descripcion: string;
          categoria: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          descripcion?: string;
          categoria?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      roles_personalizados: {
        Row: {
          id: number;
          identificador: string | null;
          nombre: string;
          descripcion: string | null;
          es_sistema: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          identificador?: string | null;
          nombre: string;
          descripcion?: string | null;
          es_sistema?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          identificador?: string | null;
          nombre?: string;
          descripcion?: string | null;
          es_sistema?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      roles_usuarios: {
        Row: {
          id: number;
          usuario_id: number;
          rol: Database["public"]["Enums"]["app_role"];
          created_at: string;
        };
        Insert: {
          id?: number;
          usuario_id: number;
          rol: Database["public"]["Enums"]["app_role"];
          created_at?: string;
        };
        Update: {
          id?: number;
          usuario_id?: number;
          rol?: Database["public"]["Enums"]["app_role"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roles_usuarios_usuario_id_fkey";
            columns: ["usuario_id"];
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          }
        ];
      };

      permisos_por_rol: {
        Row: {
          id: number;
          rol: Database["public"]["Enums"]["app_role"];
          permiso_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          rol: Database["public"]["Enums"]["app_role"];
          permiso_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          rol?: Database["public"]["Enums"]["app_role"];
          permiso_id?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "permisos_por_rol_permiso_id_fkey";
            columns: ["permiso_id"];
            referencedRelation: "permisos";
            referencedColumns: ["id"];
          }
        ];
      };

      permisos_por_rol_personalizado: {
        Row: {
          id: number;
          rol_personalizado_id: number;
          permiso_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          rol_personalizado_id: number;
          permiso_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          rol_personalizado_id?: number;
          permiso_id?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName:
              "permisos_por_rol_personalizado_rol_personalizado_id_fkey";
            columns: ["rol_personalizado_id"];
            referencedRelation: "roles_personalizados";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName:
              "permisos_por_rol_personalizado_permiso_id_fkey";
            columns: ["permiso_id"];
            referencedRelation: "permisos";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      // helpers de permisos/roles
      has_role: {
        Args: {
          _auth_id: string;
          _rol: Database["public"]["Enums"]["app_role"];
        };
        Returns: boolean;
      };
      role_has_permission: {
        Args: {
          _rol: Database["public"]["Enums"]["app_role"];
          _permiso_nombre: string;
        };
        Returns: boolean;
      };
      user_has_permission: {
        Args: {
          _auth_id: string;
          _permiso_nombre: string;
        };
        Returns: boolean;
      };

      // CRUD principales que podrías llamar vía RPC
      create_sucursal: {
        Args: {
          _nombre: string;
          _provincia_id: number;
          _canton_id: number;
          _direccion?: string | null;
          _email?: string | null;
          _telefono_sms?: string | null;
          _capacidad_maxima?: number | null;
          _estado?: string;
        };
        Returns: number;
      };
      update_sucursal: {
        Args: {
          _id: number;
          _nombre: string;
          _provincia_id: number;
          _canton_id: number;
          _direccion?: string | null;
          _email?: string | null;
          _telefono_sms?: string | null;
          _capacidad_maxima?: number | null;
          _estado?: string;
        };
        Returns: boolean;
      };

      create_categoria: {
        Args: {
          _nombre: string;
          _color?: string;
          _tiempo_estimado?: number;
          _sucursal_id?: number | null;
          _descripcion?: string | null;
          _estado?: string;
        };
        Returns: number;
      };
      update_categoria: {
        Args: {
          _id: number;
          _nombre: string;
          _color: string;
          _tiempo_estimado: number;
          _sucursal_id?: number | null;
          _descripcion?: string | null;
          _estado?: string;
        };
        Returns: boolean;
      };

      create_kiosko: {
        Args: {
          _nombre: string;
          _sucursal_id: number;
          _ubicacion?: string | null;
          _estado?: Database["public"]["Enums"]["estado_kiosko"];
        };
        Returns: number;
      };
      update_kiosko: {
        Args: {
          _id: number;
          _nombre: string;
          _sucursal_id: number;
          _ubicacion?: string | null;
          _estado?: Database["public"]["Enums"]["estado_kiosko"];
        };
        Returns: boolean;
      };

      create_pantalla: {
        Args: {
          _nombre: string;
          _sucursal_id: number;
          _estado?: string;
        };
        Returns: number;
      };
      update_pantalla: {
        Args: {
          _id: number;
          _nombre: string;
          _sucursal_id: number;
          _estado?: string;
        };
        Returns: boolean;
      };

      create_publicidad: {
        Args: {
          _nombre: string;
          _tipo: Database["public"]["Enums"]["tipo_publicidad"];
          _url_archivo: string;
          _duracion?: number;
          _estado?: string;
        };
        Returns: number;
      };
      update_publicidad: {
        Args: {
          _id: number;
          _nombre: string;
          _tipo: Database["public"]["Enums"]["tipo_publicidad"];
          _url_archivo: string;
          _duracion?: number;
          _estado?: string;
        };
        Returns: boolean;
      };

      assign_user_role: {
        Args: {
          _auth_id: string;
          _rol: Database["public"]["Enums"]["app_role"];
        };
        Returns: number;
      };

      // funciones trigger, normalmente no se llaman por RPC
      actualizar_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };

    Enums: {
      app_role: "admin" | "operador" | "supervisor" | "usuario";
      estado_kiosko: "activo" | "inactivo" | "mantenimiento";
      estado_turno: "pendiente" | "en_atencion" | "atendido" | "cancelado";
      tipo_publicidad: "imagen" | "video";
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helpers opcionales, típicos de Supabase
export type PublicSchema = Database["public"];

export type Tables<
  TName extends keyof PublicSchema["Tables"]
> = PublicSchema["Tables"][TName]["Row"];

export type TablesInsert<
  TName extends keyof PublicSchema["Tables"]
> = PublicSchema["Tables"][TName]["Insert"];

export type TablesUpdate<
  TName extends keyof PublicSchema["Tables"]
> = PublicSchema["Tables"][TName]["Update"];

export type Enums<TName extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][TName];
