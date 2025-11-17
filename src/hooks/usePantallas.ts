import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Pantalla {
  id: string;
  identificador: string;
  nombre: string;
  sucursal_id: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

export const usePantallas = () => {
  return useQuery({
    queryKey: ["pantallas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pantallas")
        .select(`
          *,
          sucursal:sucursales(nombre, provincia:provincias(nombre), canton:cantones(nombre))
        `)
        .order("nombre");

      if (error) throw error;
      return data as any[];
    },
  });
};
