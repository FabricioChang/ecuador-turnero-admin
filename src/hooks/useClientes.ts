import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Cliente } from "@/types/database";

export type ClienteRow = Cliente;

export const useClientes = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["clientes", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await supabaseExternal
        .from("cliente")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("creado_en", { ascending: false });

      if (error) throw error;
      return data as ClienteRow[];
    },
    enabled: !!cuenta?.id,
  });
};

export const useCliente = (id: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      if (!id || !cuenta?.id) return null;

      const { data, error } = await supabaseExternal
        .from("cliente")
        .select("*")
        .eq("id", id)
        .eq("cuenta_id", cuenta.id)
        .single();

      if (error) throw error;
      return data as ClienteRow;
    },
    enabled: !!id && !!cuenta?.id,
  });
};

export const useClienteByCedula = (cedula: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["cliente_cedula", cedula, cuenta?.id],
    queryFn: async () => {
      if (!cedula || !cuenta?.id) return null;

      const { data, error } = await supabaseExternal
        .from("cliente")
        .select("*")
        .eq("cedula", cedula)
        .eq("cuenta_id", cuenta.id)
        .maybeSingle();

      if (error) throw error;
      return data as ClienteRow | null;
    },
    enabled: !!cedula && !!cuenta?.id,
  });
};
