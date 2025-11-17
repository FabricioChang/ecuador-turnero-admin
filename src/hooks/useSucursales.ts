import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sucursal {
  id: string;
  nombre: string;
  identificador: string;
  provincia_id: string;
  canton_id: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  estado: string;
  created_at: string;
  updated_at: string;
}

export const useSucursales = () => {
  return useQuery({
    queryKey: ["sucursales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sucursales")
        .select(`
          *,
          provincia:provincias(nombre),
          canton:cantones(nombre)
        `)
        .order("nombre");

      if (error) throw error;
      return data as any[];
    },
  });
};
