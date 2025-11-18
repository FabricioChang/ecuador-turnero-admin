import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Turno {
  id: number;
  numero: string;
  categoria_id: number;
  sucursal_id: number;
  kiosko_id: number | null;
  cliente_nombre: string | null;
  cliente_identificacion: string | null;
  estado: string;
  fecha_creacion: string;
  fecha_llamado: string | null;
  fecha_atencion: string | null;
  fecha_finalizacion: string | null;
  tiempo_espera: number | null;
  tiempo_atencion: number | null;
  categoria?: { nombre: string; color: string };
  sucursal?: { nombre: string };
  kiosko?: { nombre: string };
}

export const useTurnos = () => {
  return useQuery({
    queryKey: ["turnos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("turnos")
        .select(
          `
          *,
          categoria:categorias(nombre, color),
          sucursal:sucursales(nombre),
          kiosko:kioskos(nombre)
        `
        )
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;
      return (data || []) as Turno[];
    },
  });
};
