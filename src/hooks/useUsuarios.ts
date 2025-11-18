import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Usuario {
  id: number;
  auth_id: string | null;
  identificador: string;
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
  provincia?: { nombre: string };
  canton?: { nombre: string };
  user_roles?: { role: string }[];
}

export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select(
          `
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
          roles_usuarios:roles_usuarios(rol)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped =
        (data || []).map((u: any) => ({
          ...u,
          identificador: u.email || String(u.id),
          user_roles: (u.roles_usuarios || []).map((r: any) => ({
            role: r.rol,
          })),
        })) as Usuario[];

      return mapped;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
