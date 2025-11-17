import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Canton {
  id: string;
  nombre: string;
  provincia_id: string;
  created_at: string;
}

export const useCantones = (provinciaId?: string) => {
  return useQuery({
    queryKey: ["cantones", provinciaId],
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
    enabled: true, // Siempre habilitada, pero filtra por provincia si se proporciona
  });
};
