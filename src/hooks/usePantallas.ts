import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Pantalla {
  id: number;
  identificador: string; // generado
  nombre: string;
  sucursal_id: number;
  estado: string;
  created_at: string;
  updated_at: string;
  sucursal?: {
    nombre: string;
    provincia?: { nombre: string };
    canton?: { nombre: string };
  };
}

export const usePantallas = () => {
  return useQuery({
    queryKey: ["pantallas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pantallas")
        .select(
          `
          id,
          nombre,
          sucursal_id,
          estado,
          created_at,
          updated_at,
          sucursal:sucursales(
            nombre,
            provincia:provincias(nombre),
            canton:cantones(nombre)
          )
        `
        )
        .order("nombre", { ascending: true });

      if (error) throw error;

      const mapped =
        (data || []).map((p: any) => ({
          ...p,
          identificador: String(p.id),
        })) as Pantalla[];

      return mapped;
    },
  });
};
