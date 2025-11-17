import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomRole {
  id: string;
  nombre: string;
  descripcion: string | null;
  es_sistema: boolean;
  created_at: string;
  updated_at: string;
}

export const useCustomRoles = () => {
  return useQuery({
    queryKey: ["custom_roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .order("es_sistema", { ascending: false })
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as CustomRole[];
    },
  });
};

export const useCreateCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ nombre, descripcion, permissionIds }: { nombre: string; descripcion: string; permissionIds: string[] }) => {
      // Crear el rol
      const { data: newRole, error: roleError } = await supabase
        .from("custom_roles")
        .insert({ nombre, descripcion, es_sistema: false })
        .select()
        .single();

      if (roleError) throw roleError;

      // Asignar permisos
      if (permissionIds.length > 0) {
        const { error: permError } = await supabase
          .from("custom_role_permissions")
          .insert(
            permissionIds.map((permissionId) => ({
              custom_role_id: newRole.id,
              permission_id: permissionId,
            }))
          );

        if (permError) throw permError;
      }

      return newRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_roles"] });
      queryClient.invalidateQueries({ queryKey: ["custom_role_permissions"] });
      toast({
        title: "Rol creado",
        description: "El nuevo rol ha sido creado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo crear el rol: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roleId, nombre, descripcion }: { roleId: string; nombre: string; descripcion: string }) => {
      const { error } = await supabase
        .from("custom_roles")
        .update({ nombre, descripcion })
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_roles"] });
      toast({
        title: "Rol actualizado",
        description: "El rol ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar el rol: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("custom_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_roles"] });
      toast({
        title: "Rol eliminado",
        description: "El rol ha sido eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el rol: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCustomRolePermissions = (roleId?: string) => {
  return useQuery({
    queryKey: ["custom_role_permissions", roleId],
    queryFn: async () => {
      if (!roleId) return [];

      const { data, error } = await supabase
        .from("custom_role_permissions")
        .select(`
          *,
          permission:permissions(*)
        `)
        .eq("custom_role_id", roleId);

      if (error) throw error;
      return data;
    },
    enabled: !!roleId,
  });
};

export const useUpdateCustomRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      // Eliminar permisos existentes
      const { error: deleteError } = await supabase
        .from("custom_role_permissions")
        .delete()
        .eq("custom_role_id", roleId);

      if (deleteError) throw deleteError;

      // Insertar nuevos permisos
      if (permissionIds.length > 0) {
        const { error: insertError } = await supabase
          .from("custom_role_permissions")
          .insert(
            permissionIds.map((permissionId) => ({
              custom_role_id: roleId,
              permission_id: permissionId,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_role_permissions"] });
      toast({
        title: "Permisos actualizados",
        description: "Los permisos del rol han sido actualizados correctamente",
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
