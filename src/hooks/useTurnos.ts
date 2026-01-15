import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Turno } from "@/types/database";

export interface TurnoRow extends Turno {
  categoria?: {
    nombre: string;
  };
  sucursal?: {
    nombre: string;
  };
  kiosko?: {
    codigo: string;
  };
  cliente?: {
    cedula: string;
    nombres: string;
    apellidos: string;
  };
}

export const useTurnos = (filters?: {
  sucursalId?: string;
  categoriaId?: string;
  estado?: string;
  fecha?: string;
}) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["turnos", cuenta?.id, filters],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      let query = supabaseExternal
        .from("turno")
        .select(`
          *,
          categoria:categoria(nombre),
          sucursal:sucursal(nombre),
          kiosko:kiosko(codigo),
          cliente:cliente(cedula, nombres, apellidos)
        `)
        .eq("cuenta_id", cuenta.id)
        .order("emitido_en", { ascending: false });

      if (filters?.sucursalId) {
        query = query.eq("sucursal_id", filters.sucursalId);
      }
      if (filters?.categoriaId) {
        query = query.eq("categoria_id", filters.categoriaId);
      }
      if (filters?.estado) {
        query = query.eq("estado", filters.estado);
      }
      if (filters?.fecha) {
        query = query.eq("emitido_dia", filters.fecha);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TurnoRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const useTurno = (id: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["turno", id],
    queryFn: async () => {
      if (!id || !cuenta?.id) return null;

      const { data, error } = await supabaseExternal
        .from("turno")
        .select(`
          *,
          categoria:categoria(nombre),
          sucursal:sucursal(nombre),
          kiosko:kiosko(codigo),
          cliente:cliente(cedula, nombres, apellidos)
        `)
        .eq("id", id)
        .eq("cuenta_id", cuenta.id)
        .single();

      if (error) throw error;
      return data as TurnoRow;
    },
    enabled: !!id && !!cuenta?.id,
  });
};
