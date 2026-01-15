import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Rol, RolPermiso, Permiso } from "@/types/database";

export type RolRow = Rol;

export interface RolConPermisos extends Rol {
  permisos?: Permiso[];
}

export const useRoles = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["roles", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await supabaseExternal
        .from("rol")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as RolRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const usePermisos = () => {
  return useQuery({
    queryKey: ["permisos"],
    queryFn: async () => {
      const { data, error } = await supabaseExternal
        .from("permiso")
        .select("*")
        .order("codigo", { ascending: true });

      if (error) throw error;
      return data as Permiso[];
    },
  });
};

export const useRolPermisos = (rolId: string) => {
  return useQuery({
    queryKey: ["rol_permisos", rolId],
    queryFn: async () => {
      if (!rolId) return [];

      const { data, error } = await supabaseExternal
        .from("rol_permiso")
        .select(`
          *,
          permiso:permiso(*)
        `)
        .eq("rol_id", rolId);

      if (error) throw error;
      return data;
    },
    enabled: !!rolId,
  });
};
