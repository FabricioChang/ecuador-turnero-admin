import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";

export interface Rol {
  id: string;
  cuenta_id: string;
  nombre: string;
  es_sistema: boolean;
}

export const useRolesByCuenta = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["roles-by-cuenta", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];

      const { data, error } = await supabaseExternal
        .from("rol")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("nombre", { ascending: true });

      if (error) throw error;
      return (data || []) as Rol[];
    },
    enabled: !!cuenta?.id,
  });
};

// Define role hierarchy levels (higher number = more power)
export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 100,
  admin: 80,
  supervisor: 60,
  operador: 40,
  usuario: 20,
};

export const getRoleLevel = (roleName: string): number => {
  const normalizedName = roleName.toLowerCase().replace(/\s+/g, '_');
  return ROLE_HIERARCHY[normalizedName] || 20;
};

export const canAssignRole = (currentUserLevel: number, targetRoleName: string): boolean => {
  const targetLevel = getRoleLevel(targetRoleName);
  // Users can only assign roles of lower level than their own
  return currentUserLevel > targetLevel;
};

export const getUserMaxRoleLevel = (
  roles: { rol?: { nombre: string } }[] | undefined,
  isSuperAdmin: boolean
): number => {
  if (isSuperAdmin) return ROLE_HIERARCHY.super_admin;
  
  if (!roles || roles.length === 0) return ROLE_HIERARCHY.usuario;
  
  return Math.max(
    ...roles.map(r => getRoleLevel(r.rol?.nombre || 'usuario'))
  );
};
