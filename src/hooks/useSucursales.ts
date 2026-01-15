import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Sucursal } from "@/types/database";

export type SucursalRow = Sucursal;

export const useSucursales = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["sucursales", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await supabaseExternal
        .from("sucursal")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as SucursalRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const useSucursal = (id: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["sucursal", id],
    queryFn: async () => {
      if (!id || !cuenta?.id) return null;

      const { data, error } = await supabaseExternal
        .from("sucursal")
        .select("*")
        .eq("id", id)
        .eq("cuenta_id", cuenta.id)
        .single();

      if (error) throw error;
      return data as SucursalRow;
    },
    enabled: !!id && !!cuenta?.id,
  });
};
