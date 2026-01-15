import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomRole {
  id: string;
  nombre: string;
  descripcion: string | null;
  identificador: string | null;
  es_sistema: boolean;
  created_at: string;
  updated_at: string;
}

export const useCustomRoles = () => {
  return useQuery({
    queryKey: ["custom-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return (data || []) as CustomRole[];
    },
  });
};

export const useCustomRolePermissions = (roleId?: string) => {
  return useQuery({
    queryKey: ["custom-role-permissions", roleId],
    queryFn: async () => {
      if (!roleId) return [];

      const { data, error } = await supabase
        .from("custom_role_permissions")
        .select("permission_id")
        .eq("custom_role_id", roleId);

      if (error) throw error;
      return (data || []).map((rp) => rp.permission_id);
    },
    enabled: !!roleId,
  });
};

export const useUpdateCustomRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      // Delete existing permissions for this role
      const { error: deleteError } = await supabase
        .from("custom_role_permissions")
        .delete()
        .eq("custom_role_id", roleId);

      if (deleteError) throw deleteError;

      // Insert new permissions
      if (permissionIds.length > 0) {
        const { error: insertError } = await supabase
          .from("custom_role_permissions")
          .insert(permissionIds.map(pid => ({
            custom_role_id: roleId,
            permission_id: pid
          })));

        if (insertError) throw insertError;
      }

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["custom-role-permissions", variables.roleId] });
      toast({
        title: "Permisos actualizados",
        description: "Los permisos del rol han sido actualizados correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ nombre, descripcion, permissionIds }: { 
      nombre: string; 
      descripcion?: string;
      permissionIds?: string[];
    }) => {
      // Get next identifier
      const { data: roles } = await supabase
        .from("custom_roles")
        .select("identificador")
        .order("identificador", { ascending: false })
        .limit(1);
      
      const lastNum = roles?.[0]?.identificador?.match(/ROL-(\d+)/)?.[1] || "000";
      const nextNum = String(parseInt(lastNum) + 1).padStart(3, "0");
      const identificador = `ROL-${nextNum}`;

      const { data: rol, error } = await supabase
        .from("custom_roles")
        .insert({
          nombre,
          descripcion: descripcion || null,
          identificador,
          es_sistema: false
        })
        .select()
        .single();

      if (error) throw error;

      // Insert permissions if provided
      if (permissionIds && permissionIds.length > 0 && rol) {
        await supabase
          .from("custom_role_permissions")
          .insert(permissionIds.map(pid => ({
            custom_role_id: rol.id,
            permission_id: pid
          })));
      }

      return rol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
      toast({
        title: "Rol creado",
        description: "El rol ha sido creado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
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
      // Delete permissions first
      await supabase
        .from("custom_role_permissions")
        .delete()
        .eq("custom_role_id", roleId);

      const { error } = await supabase
        .from("custom_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
      toast({
        title: "Rol eliminado",
        description: "El rol ha sido eliminado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export default useCustomRoles;
