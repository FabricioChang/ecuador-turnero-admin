import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Canton {
  id: number;
  nombre: string;
  provincia_id: number;
  created_at: string;
}

/**
 * Devuelve los cantones. Si se pasa `provinciaId`, filtra por esa provincia.
 * En la nueva BD, `provincia_id` es INTEGER.
 */
export const useCantones = (provinciaId?: number) => {
  return useQuery({
    queryKey: ["cantones", provinciaId],
    queryFn: async () => {
      let query = supabase
        .from("cantones")
        .select("id, nombre, provincia_id, created_at")
        .order("nombre", { ascending: true });

      if (provinciaId !== undefined) {
        query = query.eq("provincia_id", provinciaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Canton[];
    },
    // Siempre habilitada; el filtro por provincia es opcional
    enabled: true,
  });
};
