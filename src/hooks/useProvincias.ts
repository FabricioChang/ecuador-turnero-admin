import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Provincia {
  id: string;
  codigo: string;
  nombre: string;
  created_at: string;
}

export const useProvincias = () => {
  return useQuery({
    queryKey: ["provincias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provincias")
        .select("*")
        .order("nombre");

      if (error) throw error;
      return data as Provincia[];
    },
  });
};
