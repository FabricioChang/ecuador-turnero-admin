import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface RolePermission {
  id: number;
  rol: AppRole;
  permiso_id: number;
  created_at: string;
  permiso?: {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
  };
}

export const useRolePermissions = (role?: AppRole) => {
  return useQuery({
    queryKey: ["role_permissions", role],
    queryFn: async () => {
      if (!role) return [];

      const { data, error } = await supabase
        .from("permisos_por_rol")
        .select(
          `
          id,
          rol,
          permiso_id,
          created_at,
          permiso:permisos(
            id,
            nombre,
            descripcion,
            categoria
          )
        `
        )
        .eq("rol", role);

      if (error) throw error;
      return (data || []) as RolePermission[];
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { role: AppRole; permissionIds: number[] }) => {
      const { role, permissionIds } = params;

      // borrar permisos actuales
      const { error: delError } = await supabase
        .from("permisos_por_rol")
        .delete()
        .eq("rol", role);

      if (delError) throw delError;

      if (permissionIds.length > 0) {
        const inserts = permissionIds.map((permiso_id) => ({
          rol: role,
          permiso_id,
        }));

        const { error: insError } = await supabase
          .from("permisos_por_rol")
          .insert(inserts);

        if (insError) throw insError;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["role_permissions", variables.role],
      });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      toast({
        title: "Permisos actualizados",
        description:
          "Los permisos del rol han sido actualizados correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudieron actualizar los permisos: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
