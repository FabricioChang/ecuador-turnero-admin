import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Canton {
  id: string;
  nombre: string;
  provincia_id: string;
}

export const useCantonesDB = (provinciaId?: string) => {
  return useQuery({
    queryKey: ["cantones-db", provinciaId],
    queryFn: async () => {
      let query = supabase
        .from("cantones")
        .select("*")
        .order("nombre");
      
      if (provinciaId) {
        query = query.eq("provincia_id", provinciaId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Canton[];
    },
  });
};

export default useCantonesDB;
