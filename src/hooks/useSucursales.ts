import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sucursal {
  id: number;
  nombre: string;
  provincia_id: number;
  canton_id: number;
  direccion: string | null;
  telefono_sms: string | null;
  email: string | null;
  capacidad_maxima: number | null;
  estado: string;
  created_at: string;
  updated_at: string;
  provincia?: { nombre: string };
  canton?: { nombre: string };
}

/**
 * Lista de sucursales usando la nueva BD (`sucursales` con ids numéricos
 * y sin columna `identificador`).
 */
export const useSucursales = () => {
  return useQuery({
    queryKey: ["sucursales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sucursales")
        .select(`
          id,
          nombre,
          provincia_id,
          canton_id,
          direccion,
          email,
          telefono_sms,
          capacidad_maxima,
          estado,
          created_at,
          updated_at,
          provincia:provincias(nombre),
          canton:cantones(nombre)
        `)
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as Sucursal[];
    },
  });
};
