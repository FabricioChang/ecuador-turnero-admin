import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Provincia {
  id: string;
  nombre: string;
  codigo: string;
}

export const useProvinciasDB = () => {
  return useQuery({
    queryKey: ["provincias-db"],
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

export default useProvinciasDB;
