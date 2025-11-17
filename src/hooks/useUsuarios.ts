import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Usuario {
  id: string;
  identificador: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  cedula: string | null;
  provincia_id: string | null;
  canton_id: string | null;
  direccion: string | null;
  created_at: string;
  updated_at: string;
}

export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          provincia:provincias(nombre),
          canton:cantones(nombre),
          user_roles(role)
        `)
        .order("nombres");

      if (error) throw error;
      return data as any[];
    },
  });
};
