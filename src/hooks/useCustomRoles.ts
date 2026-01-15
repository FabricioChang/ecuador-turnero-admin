import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

export const useCustomRoles = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["custom-roles", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];

      const { data, error } = await (supabaseExternal as any)
        .from("rol")
        .select("*")
        .eq("cuenta_id", cuenta.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!cuenta?.id,
  });
};

export const useCustomRolePermissions = (roleId?: string) => {
  return useQuery({
    queryKey: ["custom-role-permissions", roleId],
    queryFn: async () => {
      if (!roleId) return [];

      const { data, error } = await (supabaseExternal as any)
        .from("rol_permiso")
        .select("permiso_id")
        .eq("rol_id", roleId);

      if (error) throw error;
      return (data || []).map((rp: any) => ({ permission_id: rp.permiso_id }));
    },
    enabled: !!roleId,
  });
};

export const useCreateCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { cuenta } = useCuenta();

  return useMutation({
    mutationFn: async ({ nombre, descripcion, permissionIds }: { 
      nombre: string; 
      descripcion?: string;
      permissionIds?: string[];
    }) => {
      if (!cuenta?.id) throw new Error("No cuenta selected");

      const { data: rol, error } = await (supabaseExternal as any)
        .from("rol")
        .insert({
          cuenta_id: cuenta.id,
          nombre,
          es_sistema: false
        })
        .select()
        .single();

      if (error) throw error;

      // Insert permissions if provided
      if (permissionIds && permissionIds.length > 0 && rol) {
        await (supabaseExternal as any)
          .from("rol_permiso")
          .insert(permissionIds.map(pid => ({
            rol_id: rol.id,
            permiso_id: pid
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

export const useUpdateCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roleId, nombre, descripcion }: { 
      roleId: string; 
      nombre: string;
      descripcion?: string;
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("rol")
        .update({ nombre })
        .eq("id", roleId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-roles"] });
      toast({
        title: "Rol actualizado",
        description: "El rol ha sido actualizado correctamente.",
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
      await (supabaseExternal as any)
        .from("rol_permiso")
        .delete()
        .eq("rol_id", roleId);

      const { error } = await (supabaseExternal as any)
        .from("rol")
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

export const useUpdateCustomRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      // Delete existing permissions
      await (supabaseExternal as any)
        .from("rol_permiso")
        .delete()
        .eq("rol_id", roleId);

      // Insert new permissions
      if (permissionIds.length > 0) {
        const { error } = await (supabaseExternal as any)
          .from("rol_permiso")
          .insert(permissionIds.map(pid => ({
            rol_id: roleId,
            permiso_id: pid
          })));

        if (error) throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-role-permissions"] });
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

export default useCustomRoles;
