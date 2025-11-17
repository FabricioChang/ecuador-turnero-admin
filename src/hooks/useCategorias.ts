import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  color: string;
  tiempo_estimado: number;
  sucursal_id: string | null;
  estado: string;
  created_at: string;
  updated_at: string;
}

export const useCategorias = (sucursalId?: string) => {
  return useQuery({
    queryKey: ["categorias", sucursalId],
    queryFn: async () => {
      let query = supabase
        .from("categorias")
        .select(`
          *,
          sucursal:sucursales(nombre)
        `)
        .order("nombre");

      if (sucursalId) {
        query = query.eq("sucursal_id", sucursalId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as any[];
    },
  });
};
