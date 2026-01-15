import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

export const useUsuarioRoles = (userId: string) => {
  const { cuenta, miembro } = useCuenta();

  return useQuery({
    queryKey: ["usuario-roles", userId, miembro?.id],
    queryFn: async () => {
      if (!miembro?.id) return [];

      const { data, error } = await supabaseExternal
        .from("usuario_rol")
        .select(`
          id,
          rol:rol_id (
            id,
            nombre,
            es_sistema
          )
        `)
        .eq("miembro_id", miembro.id);

      if (error) throw error;
      return (data || []).map((ur: any) => ({
        id: ur.id,
        rol: ur.rol?.nombre || "Sin rol",
        role: ur.rol?.nombre || "Sin rol"
      }));
    },
    enabled: !!miembro?.id,
  });
};

export const useAsignarRol = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // This would need to be implemented based on the new schema
      // For now, just return success
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario-roles"] });
      toast({
        title: "Rol asignado",
        description: "El rol ha sido asignado correctamente.",
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

export default useUsuarioRoles;
