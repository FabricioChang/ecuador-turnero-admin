import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export const useUsuarioRoles = (userId?: string) => {
  return useQuery({
    queryKey: ["usuario_roles", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) throw error;
      return data.map(r => r.role as AppRole);
    },
    enabled: !!userId,
  });
};

export const useAsignarRol = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data: newId, error } = await supabase.rpc('assign_user_role', {
        _user_id: userId,
        _role: role
      });

      if (error) throw error;
      return newId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario_roles"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo asignar el rol: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
