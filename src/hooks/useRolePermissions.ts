import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

export const useRolePermissions = (roleName?: string) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["role-permissions", cuenta?.id, roleName],
    queryFn: async () => {
      if (!cuenta?.id || !roleName) return [];

      // Get the role by name
      const { data: rol, error: rolError } = await (supabaseExternal as any)
        .from("rol")
        .select("id")
        .eq("cuenta_id", cuenta.id)
        .eq("nombre", roleName)
        .maybeSingle();

      if (rolError) throw rolError;
      if (!rol) return [];

      // Get permissions for this role
      const { data, error } = await (supabaseExternal as any)
        .from("rol_permiso")
        .select("permiso_id")
        .eq("rol_id", rol.id);

      if (error) throw error;
      return (data || []).map((rp: any) => ({ permission_id: rp.permiso_id }));
    },
    enabled: !!cuenta?.id && !!roleName,
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { cuenta } = useCuenta();

  return useMutation({
    mutationFn: async ({ role, permissionIds }: { role: string; permissionIds: string[] }) => {
      if (!cuenta?.id) throw new Error("No cuenta selected");

      // Get the role by name
      const { data: rol, error: rolError } = await (supabaseExternal as any)
        .from("rol")
        .select("id")
        .eq("cuenta_id", cuenta.id)
        .eq("nombre", role)
        .maybeSingle();

      if (rolError) throw rolError;
      if (!rol) throw new Error("Role not found");

      // Delete existing permissions
      await (supabaseExternal as any)
        .from("rol_permiso")
        .delete()
        .eq("rol_id", rol.id);

      // Insert new permissions
      if (permissionIds.length > 0) {
        const { error } = await (supabaseExternal as any)
          .from("rol_permiso")
          .insert(permissionIds.map(pid => ({
            rol_id: rol.id,
            permiso_id: pid
          })));

        if (error) throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
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

export default useRolePermissions;
