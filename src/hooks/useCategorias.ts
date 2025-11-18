import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategoriaRow {
  id: number;
  nombre: string;
  descripcion: string | null;
  color: string;
  tiempo_estimado: number;
  sucursal_id: number | null;
  estado: string;
  created_at: string;
  updated_at: string;
  sucursal?: { nombre: string };
}

export const useCategorias = (sucursalId?: string) => {
  return useQuery({
    queryKey: ["categorias", sucursalId],
    queryFn: async () => {
      let query = supabase
        .from("categorias")
        .select(
          `
          id,
          nombre,
          descripcion,
          color,
          tiempo_estimado,
          sucursal_id,
          estado,
          created_at,
          updated_at,
          sucursal:sucursales(nombre)
        `
        )
        .order("nombre", { ascending: true });

      if (sucursalId && sucursalId !== "all") {
        query = query.eq("sucursal_id", Number(sucursalId));
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as CategoriaRow[];
    },
  });
};
