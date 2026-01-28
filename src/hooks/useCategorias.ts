import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";

export interface CategoriaRow {
  id: string;
  cuenta_id: string;
  nombre: string;
  descripcion: string | null;
  prioridad: 'regular' | 'preferente';
  activo: boolean;
  tiempo_reagendamiento_min: number;
  limite_reagendamientos: number;
  notificaciones_automaticas: boolean;
  alertas_administrativas: boolean;
}

export const useCategorias = (sucursalId?: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["categorias", cuenta?.id, sucursalId],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await (supabaseExternal as any)
        .from("categoria")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as CategoriaRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const useCategoria = (id: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["categoria", id],
    queryFn: async () => {
      if (!id || !cuenta?.id) return null;

      const { data, error } = await (supabaseExternal as any)
        .from("categoria")
        .select("*")
        .eq("id", id)
        .eq("cuenta_id", cuenta.id)
        .single();

      if (error) throw error;
      return data as CategoriaRow;
    },
    enabled: !!id && !!cuenta?.id,
  });
};
