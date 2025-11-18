import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sucursal {
  id: number;
  identificador: string; // generado
  nombre: string;
  provincia_id: number;
  canton_id: number;
  direccion: string | null;
  telefono: string | null;  // mapeado desde telefono_sms
  email: string | null;
  estado: string;
  created_at: string;
  updated_at: string;
  provincia?: { nombre: string };
  canton?: { nombre: string };
}

export const useSucursales = () => {
  return useQuery({
    queryKey: ["sucursales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sucursales")
        .select(
          `
          id,
          nombre,
          provincia_id,
          canton_id,
          direccion,
          telefono_sms,
          email,
          estado,
          created_at,
          updated_at,
          provincia:provincias(nombre),
          canton:cantones(nombre)
        `
        )
        .order("nombre", { ascending: true });

      if (error) throw error;

      const mapped =
        (data || []).map((s: any) => ({
          ...s,
          identificador: String(s.id),
          telefono: s.telefono_sms ?? null,
        })) as Sucursal[];

      return mapped;
    },
  });
};
