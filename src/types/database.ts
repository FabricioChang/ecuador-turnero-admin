export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type EstadoGeneral = 'activo' | 'inactivo';
export type EstadoTurno = 'emitido' | 'llamado' | 'atendido' | 'perdido' | 'recuperado' | 'cancelado';
export type NaturalezaTurno = 'preferencial' | 'regular';
export type PantallaEstado = 'activo' | 'inactivo' | 'mantenimiento';
export type MiembroEstado = 'activo' | 'inactivo' | 'pendiente';
export type EventoTurno = 'emitido' | 'llamado' | 'atendido' | 'perdido' | 'recuperado' | 'cancelado';

export interface Database {
  public: {
    Tables: {
      plan_cuenta: {
        Row: {
          id: string;
          nombre: string;
          limites: Json;
          activo: boolean;
        };
        Insert: {
          id?: string;
          nombre: string;
          limites: Json;
          activo?: boolean;
        };
        Update: {
          id?: string;
          nombre?: string;
          limites?: Json;
          activo?: boolean;
        };
      };
      cuenta: {
        Row: {
          id: string;
          nombre: string;
          plan_id: string | null;
          estado: EstadoGeneral;
        };
        Insert: {
          id?: string;
          nombre: string;
          plan_id?: string | null;
          estado?: EstadoGeneral;
        };
        Update: {
          id?: string;
          nombre?: string;
          plan_id?: string | null;
          estado?: EstadoGeneral;
        };
      };
      usuario_admin: {
        Row: {
          id: string;
          email: string;
          pass_hash: string;
          nombre: string | null;
          super_admin: boolean;
          creado_en: string;
        };
        Insert: {
          id?: string;
          email: string;
          pass_hash: string;
          nombre?: string | null;
          super_admin?: boolean;
          creado_en?: string;
        };
        Update: {
          id?: string;
          email?: string;
          pass_hash?: string;
          nombre?: string | null;
          super_admin?: boolean;
          creado_en?: string;
        };
      };
      miembro_cuenta: {
        Row: {
          id: string;
          cuenta_id: string;
          usuario_id: string;
          estado: MiembroEstado;
          invitado_por: string | null;
          creado_en: string;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          usuario_id: string;
          estado?: MiembroEstado;
          invitado_por?: string | null;
          creado_en?: string;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          usuario_id?: string;
          estado?: MiembroEstado;
          invitado_por?: string | null;
          creado_en?: string;
        };
      };
      sucursal: {
        Row: {
          id: string;
          cuenta_id: string;
          nombre: string;
          region: string;
          provincia: string;
          ciudad: string;
          direccion: string;
          hora_apertura: string | null;
          hora_cierre: string | null;
          estado: EstadoGeneral;
          creado_en: string;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          nombre: string;
          region: string;
          provincia: string;
          ciudad: string;
          direccion: string;
          hora_apertura?: string | null;
          hora_cierre?: string | null;
          estado?: EstadoGeneral;
          creado_en?: string;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          nombre?: string;
          region?: string;
          provincia?: string;
          ciudad?: string;
          direccion?: string;
          hora_apertura?: string | null;
          hora_cierre?: string | null;
          estado?: EstadoGeneral;
          creado_en?: string;
        };
      };
      categoria: {
        Row: {
          id: string;
          cuenta_id: string;
          nombre: string;
          descripcion: string | null;
          tiempo_prom_seg: number;
          prioridad_default: NaturalezaTurno;
          activo: boolean;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          nombre: string;
          descripcion?: string | null;
          tiempo_prom_seg?: number;
          prioridad_default?: NaturalezaTurno;
          activo?: boolean;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          nombre?: string;
          descripcion?: string | null;
          tiempo_prom_seg?: number;
          prioridad_default?: NaturalezaTurno;
          activo?: boolean;
        };
      };
      cliente: {
        Row: {
          id: string;
          cuenta_id: string;
          cedula: string;
          nombres: string | null;
          apellidos: string | null;
          fecha_nac: string | null;
          genero: string | null;
          vulnerabilidad: string | null;
          creado_en: string;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          cedula: string;
          nombres?: string | null;
          apellidos?: string | null;
          fecha_nac?: string | null;
          genero?: string | null;
          vulnerabilidad?: string | null;
          creado_en?: string;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          cedula?: string;
          nombres?: string | null;
          apellidos?: string | null;
          fecha_nac?: string | null;
          genero?: string | null;
          vulnerabilidad?: string | null;
          creado_en?: string;
        };
      };
      kiosko: {
        Row: {
          id: string;
          sucursal_id: string;
          codigo: string;
          ubicacion: string | null;
          estado: EstadoGeneral;
        };
        Insert: {
          id?: string;
          sucursal_id: string;
          codigo: string;
          ubicacion?: string | null;
          estado?: EstadoGeneral;
        };
        Update: {
          id?: string;
          sucursal_id?: string;
          codigo?: string;
          ubicacion?: string | null;
          estado?: EstadoGeneral;
        };
      };
      kiosko_categoria: {
        Row: {
          kiosko_id: string;
          categoria_id: string;
          habilitado: boolean;
        };
        Insert: {
          kiosko_id: string;
          categoria_id: string;
          habilitado: boolean;
        };
        Update: {
          kiosko_id?: string;
          categoria_id?: string;
          habilitado?: boolean;
        };
      };
      pantalla: {
        Row: {
          id: string;
          sucursal_id: string;
          nombre: string;
          layout: Json;
          estado: PantallaEstado;
        };
        Insert: {
          id?: string;
          sucursal_id: string;
          nombre: string;
          layout: Json;
          estado?: PantallaEstado;
        };
        Update: {
          id?: string;
          sucursal_id?: string;
          nombre?: string;
          layout?: Json;
          estado?: PantallaEstado;
        };
      };
      kiosko_pantalla: {
        Row: {
          kiosko_id: string;
          pantalla_id: string;
        };
        Insert: {
          kiosko_id: string;
          pantalla_id: string;
        };
        Update: {
          kiosko_id?: string;
          pantalla_id?: string;
        };
      };
      perfil_prioridad: {
        Row: {
          id: string;
          cuenta_id: string;
          nombre: string;
          naturaleza: NaturalezaTurno;
          peso: number;
          activo: boolean;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          nombre: string;
          naturaleza: NaturalezaTurno;
          peso: number;
          activo?: boolean;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          nombre?: string;
          naturaleza?: NaturalezaTurno;
          peso?: number;
          activo?: boolean;
        };
      };
      permiso: {
        Row: {
          id: string;
          codigo: string;
        };
        Insert: {
          id?: string;
          codigo: string;
        };
        Update: {
          id?: string;
          codigo?: string;
        };
      };
      rol: {
        Row: {
          id: string;
          cuenta_id: string;
          nombre: string;
          es_sistema: boolean;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          nombre: string;
          es_sistema?: boolean;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          nombre?: string;
          es_sistema?: boolean;
        };
      };
      rol_permiso: {
        Row: {
          rol_id: string;
          permiso_id: string;
        };
        Insert: {
          rol_id: string;
          permiso_id: string;
        };
        Update: {
          rol_id?: string;
          permiso_id?: string;
        };
      };
      usuario_rol: {
        Row: {
          id: string;
          miembro_id: string;
          rol_id: string;
        };
        Insert: {
          id?: string;
          miembro_id: string;
          rol_id: string;
        };
        Update: {
          id?: string;
          miembro_id?: string;
          rol_id?: string;
        };
      };
      turno: {
        Row: {
          id: string;
          cuenta_id: string;
          sucursal_id: string;
          kiosko_id: string;
          categoria_id: string;
          cliente_id: string;
          perfil_prioridad_id: string;
          naturaleza_base: NaturalezaTurno;
          es_recuperado: boolean;
          codigo: string;
          num_sec: number;
          emitido_en: string;
          estado: EstadoTurno;
          tiempo_espera: number | null;
          qr_hash: string;
          qr_expira_en: string | null;
          llamado_en: string | null;
          atendido_en: string | null;
          perdido_en: string | null;
          recuperado_en: string | null;
          cancelado_en: string | null;
          emitido_dia: string;
        };
        Insert: {
          id?: string;
          cuenta_id: string;
          sucursal_id: string;
          kiosko_id: string;
          categoria_id: string;
          cliente_id: string;
          perfil_prioridad_id: string;
          naturaleza_base: NaturalezaTurno;
          es_recuperado?: boolean;
          codigo: string;
          num_sec: number;
          emitido_en?: string;
          estado?: EstadoTurno;
          tiempo_espera?: number | null;
          qr_hash: string;
          qr_expira_en?: string | null;
          llamado_en?: string | null;
          atendido_en?: string | null;
          perdido_en?: string | null;
          recuperado_en?: string | null;
          cancelado_en?: string | null;
          emitido_dia: string;
        };
        Update: {
          id?: string;
          cuenta_id?: string;
          sucursal_id?: string;
          kiosko_id?: string;
          categoria_id?: string;
          cliente_id?: string;
          perfil_prioridad_id?: string;
          naturaleza_base?: NaturalezaTurno;
          es_recuperado?: boolean;
          codigo?: string;
          num_sec?: number;
          emitido_en?: string;
          estado?: EstadoTurno;
          tiempo_espera?: number | null;
          qr_hash?: string;
          qr_expira_en?: string | null;
          llamado_en?: string | null;
          atendido_en?: string | null;
          perdido_en?: string | null;
          recuperado_en?: string | null;
          cancelado_en?: string | null;
          emitido_dia?: string;
        };
      };
      turno_hist: {
        Row: {
          id: string;
          turno_id: string;
          evento: EventoTurno;
          actor_admin: string | null;
          detalle: Json | null;
          creado_en: string;
        };
        Insert: {
          id?: string;
          turno_id: string;
          evento: EventoTurno;
          actor_admin?: string | null;
          detalle?: Json | null;
          creado_en?: string;
        };
        Update: {
          id?: string;
          turno_id?: string;
          evento?: EventoTurno;
          actor_admin?: string | null;
          detalle?: Json | null;
          creado_en?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      estado_general: EstadoGeneral;
      estado_turno: EstadoTurno;
      naturaleza_turno: NaturalezaTurno;
      pantalla_estado: PantallaEstado;
      miembro_estado: MiembroEstado;
      evento_turno: EventoTurno;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience types
export type Cuenta = Tables<'cuenta'>;
export type UsuarioAdmin = Tables<'usuario_admin'>;
export type MiembroCuenta = Tables<'miembro_cuenta'>;
export type Sucursal = Tables<'sucursal'>;
export type Categoria = Tables<'categoria'>;
export type Cliente = Tables<'cliente'>;
export type Kiosko = Tables<'kiosko'>;
export type KioskoCategoria = Tables<'kiosko_categoria'>;
export type Pantalla = Tables<'pantalla'>;
export type KioskoPantalla = Tables<'kiosko_pantalla'>;
export type PerfilPrioridad = Tables<'perfil_prioridad'>;
export type Permiso = Tables<'permiso'>;
export type Rol = Tables<'rol'>;
export type RolPermiso = Tables<'rol_permiso'>;
export type UsuarioRol = Tables<'usuario_rol'>;
export type Turno = Tables<'turno'>;
export type TurnoHist = Tables<'turno_hist'>;
export type PlanCuenta = Tables<'plan_cuenta'>;
