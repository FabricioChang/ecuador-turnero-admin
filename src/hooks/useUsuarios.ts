import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Usuario {
  id: number;
  auth_id: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  cedula: string | null;
  provincia_id: number | null;
  canton_id: number | null;
  direccion: string | null;
  created_at: string;
  updated_at: string;
  provincia?: { nombre: string } | null;
  canton?: { nombre: string } | null;
  roles?: { rol: string }[];
}

/**
 * Lista de usuarios desde la nueva tabla `usuarios`.
 */
export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select(`
          id,
          auth_id,
          nombres,
          apellidos,
          email,
          telefono,
          cedula,
          provincia_id,
          canton_id,
          direccion,
          created_at,
          updated_at,
          provincia:provincias(nombre),
          canton:cantones(nombre),
          roles:roles_usuarios(rol)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Usuario[];
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
