import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Provincia {
  id: number;
  nombre: string;
  created_at: string;
}

/**
 * Obtiene el catálogo completo de provincias desde la tabla `provincias`
 * de la nueva BD (ids numéricos, sin columna `codigo`).
 */
export const useProvincias = () => {
  return useQuery({
    queryKey: ["provincias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provincias")
        .select("id, nombre, created_at")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as Provincia[];
    },
  });
};
