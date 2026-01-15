import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import type { Cuenta } from "@/types/database";

export const useCuentas = (search?: string) => {
  return useQuery({
    queryKey: ["cuentas", search],
    queryFn: async () => {
      let query = supabaseExternal
        .from("cuenta")
        .select("*")
        .eq("estado", "activo")
        .order("nombre", { ascending: true });

      if (search && search.trim()) {
        query = query.ilike("nombre", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Cuenta[];
    },
  });
};

export const useCuenta = (id: string) => {
  return useQuery({
    queryKey: ["cuenta", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabaseExternal
        .from("cuenta")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Cuenta;
    },
    enabled: !!id,
  });
};
