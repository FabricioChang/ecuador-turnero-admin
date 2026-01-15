import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Categoria } from "@/types/database";

export type CategoriaRow = Categoria;

export const useCategorias = (sucursalId?: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["categorias", cuenta?.id, sucursalId],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      let query = supabaseExternal
        .from("categoria")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("nombre", { ascending: true });

      const { data, error } = await query;
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

      const { data, error } = await supabaseExternal
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
