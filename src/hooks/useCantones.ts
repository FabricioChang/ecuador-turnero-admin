import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Canton {
  id: number;
  nombre: string;
  provincia_id: number;
  created_at: string;
}

export const useCantones = (provinciaId?: string) => {
  return useQuery({
    queryKey: ["cantones", provinciaId],
    queryFn: async () => {
      let query = supabase
        .from("cantones")
        .select("*")
        .order("nombre", { ascending: true });

      if (provinciaId && provinciaId !== "all") {
        query = query.eq("provincia_id", Number(provinciaId));
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Canton[];
    },
  });
};
