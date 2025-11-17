import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  created_at: string;
}

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permisos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permisos")
        .select("id, nombre, descripcion, categoria, created_at")
        .order("categoria", { ascending: true })
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as Permiso[];
    },
  });
};
