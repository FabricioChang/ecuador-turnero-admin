import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Publicidad {
  id: string;
  nombre: string;
  tipo: string;
  url_archivo: string;
  duracion: number;
  estado: string;
  fecha_creacion: string;
  created_at: string;
  updated_at: string;
}

export const usePublicidad = () => {
  return useQuery({
    queryKey: ["publicidad"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .order("nombre");

      if (error) throw error;
      return data as Publicidad[];
    },
  });
};
