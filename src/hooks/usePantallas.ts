import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Pantalla } from "@/types/database";

export interface PantallaRow extends Pantalla {
  sucursal?: {
    nombre: string;
    region: string;
    provincia: string;
    ciudad: string;
  };
}

export const usePantallas = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["pantallas", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await supabaseExternal
        .from("pantalla")
        .select(`
          *,
          sucursal:sucursal(
            nombre,
            region,
            provincia,
            ciudad,
            cuenta_id
          )
        `)
        .order("nombre", { ascending: true });

      if (error) throw error;
      
      // Filtrar por cuenta_id a través de la sucursal
      const filteredData = (data || []).filter(
        (p: any) => p.sucursal?.cuenta_id === cuenta.id
      );
      
      return filteredData as PantallaRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const usePantalla = (id: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["pantalla", id],
    queryFn: async () => {
      if (!id || !cuenta?.id) return null;

      const { data, error } = await supabaseExternal
        .from("pantalla")
        .select(`
          *,
          sucursal:sucursal(
            nombre,
            region,
            provincia,
            ciudad,
            cuenta_id
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Verificar que pertenezca a la cuenta
      if ((data as any).sucursal?.cuenta_id !== cuenta.id) {
        throw new Error("Pantalla no encontrada");
      }
      
      return data as PantallaRow;
    },
    enabled: !!id && !!cuenta?.id,
  });
};
