import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Kiosko } from "@/types/database";

export interface KioskoRow extends Kiosko {
  sucursal?: {
    nombre: string;
    region: string;
    provincia: string;
    ciudad: string;
  };
}

export const useKioskos = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["kioskos", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await supabaseExternal
        .from("kiosko")
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
        .order("codigo", { ascending: true });

      if (error) throw error;
      
      // Filtrar por cuenta_id a través de la sucursal
      const filteredData = (data || []).filter(
        (k: any) => k.sucursal?.cuenta_id === cuenta.id
      );
      
      return filteredData as KioskoRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const useKiosko = (id: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["kiosko", id],
    queryFn: async () => {
      if (!id || !cuenta?.id) return null;

      const { data, error } = await supabaseExternal
        .from("kiosko")
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
        throw new Error("Kiosko no encontrado");
      }
      
      return data as KioskoRow;
    },
    enabled: !!id && !!cuenta?.id,
  });
};
