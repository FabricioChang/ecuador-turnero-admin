import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Kiosko {
  id: number;
  identificador: string; // generado
  nombre: string;
  sucursal_id: number;
  ubicacion: string | null;
  estado: string;
  created_at: string;
  updated_at: string;
  sucursal?: {
    nombre: string;
    provincia?: { nombre: string };
    canton?: { nombre: string };
  };
}

export const useKioskos = () => {
  return useQuery({
    queryKey: ["kioskos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kioskos")
        .select(
          `
          id,
          nombre,
          sucursal_id,
          ubicacion,
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
        (data || []).map((k: any) => ({
          ...k,
          identificador: String(k.id),
        })) as Kiosko[];

      return mapped;
    },
  });
};
