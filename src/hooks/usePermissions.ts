import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      
      return (data || []) as Permission[];
    },
  });
};

export default usePermissions;
