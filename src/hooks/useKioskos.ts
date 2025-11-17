import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Kiosko {
  id: string;
  nombre: string;
  identificador: string;
  sucursal_id: string;
  ubicacion: string | null;
  estado: string;
  created_at: string;
  updated_at: string;
}

export const useKioskos = () => {
  return useQuery({
    queryKey: ["kioskos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kioskos")
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
