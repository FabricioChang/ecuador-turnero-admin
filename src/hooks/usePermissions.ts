import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await (supabaseExternal as any)
        .from("permiso")
        .select("*");

      if (error) throw error;
      
      // Map to expected format
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.codigo,
        description: p.codigo,
        category: "general"
      }));
    },
  });
};

export default usePermissions;
