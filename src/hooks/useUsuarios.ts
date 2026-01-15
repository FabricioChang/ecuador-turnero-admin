import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { UsuarioAdmin, MiembroCuenta, UsuarioRol, Rol } from "@/types/database";

export interface MiembroConUsuario extends MiembroCuenta {
  usuario?: UsuarioAdmin;
  roles?: {
    rol?: Rol;
  }[];
}

export const useUsuariosMiembros = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["usuarios_miembros", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await supabaseExternal
        .from("miembro_cuenta")
        .select(`
          *,
          usuario:usuario_admin!miembro_cuenta_usuario_id_fkey(*),
          roles:usuario_rol(
            rol:rol(*)
          )
        `)
        .eq("cuenta_id", cuenta.id)
        .order("creado_en", { ascending: false });

      if (error) throw error;
      return data as MiembroConUsuario[];
    },
    enabled: !!cuenta?.id,
  });
};

export const useUsuarioAdmin = (id: string) => {
  return useQuery({
    queryKey: ["usuario_admin", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabaseExternal
        .from("usuario_admin")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as UsuarioAdmin;
    },
    enabled: !!id,
  });
};

export const useUsuarioAdminByEmail = (email: string) => {
  return useQuery({
    queryKey: ["usuario_admin_email", email],
    queryFn: async () => {
      if (!email) return null;

      const { data, error } = await supabaseExternal
        .from("usuario_admin")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;
      return data as UsuarioAdmin | null;
    },
    enabled: !!email,
  });
};

export const useMiembroCuenta = (usuarioId: string, cuentaId: string) => {
  return useQuery({
    queryKey: ["miembro_cuenta", usuarioId, cuentaId],
    queryFn: async () => {
      if (!usuarioId || !cuentaId) return null;

      const { data, error } = await supabaseExternal
        .from("miembro_cuenta")
        .select("*")
        .eq("usuario_id", usuarioId)
        .eq("cuenta_id", cuentaId)
        .maybeSingle();

      if (error) throw error;
      return data as MiembroCuenta | null;
    },
    enabled: !!usuarioId && !!cuentaId,
  });
};

// Alias for backward compatibility
export const useUsuarios = useUsuariosMiembros;
