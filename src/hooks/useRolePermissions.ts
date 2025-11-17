import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface RolePermission {
  id: string;
  role: AppRole;
  permission_id: string;
  created_at: string;
  permission?: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
}

export const useRolePermissions = (role?: AppRole) => {
  return useQuery({
    queryKey: ["role_permissions", role],
    queryFn: async () => {
      let query = supabase
        .from("role_permissions")
        .select(`
          *,
          permission:permissions(*)
        `);

      if (role) {
        query = query.eq("role", role as AppRole);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as RolePermission[];
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ role, permissionIds }: { role: AppRole; permissionIds: string[] }) => {
      // Primero eliminar todos los permisos del rol
      const { error: deleteError } = await supabase
        .from("role_permissions")
        .delete()
        .eq("role", role as AppRole);

      if (deleteError) throw deleteError;

      // Luego insertar los nuevos permisos
      if (permissionIds.length > 0) {
        const { error: insertError } = await supabase
          .from("role_permissions")
          .insert(
            permissionIds.map((permissionId) => ({
              role: role as AppRole,
              permission_id: permissionId,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role_permissions"] });
      toast({
        title: "Permisos actualizados",
        description: "Los permisos del rol han sido actualizados correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudieron actualizar los permisos: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
