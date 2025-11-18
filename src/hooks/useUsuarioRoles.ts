import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

async function resolveAuthId(userId: string): Promise<string> {
  // Si parece UUID (tiene guiones), asumimos que ya es auth_id
  if (userId.includes("-")) {
    return userId;
  }

  // Si no, tratamos como usuario.id
  const { data, error } = await supabase
    .from("usuarios")
    .select("auth_id")
    .eq("id", Number(userId))
    .maybeSingle();

  if (error) throw error;
  if (!data?.auth_id) {
    throw new Error("No se encontró auth_id para el usuario indicado");
  }

  return data.auth_id;
}

async function resolveUsuarioId(userId: string): Promise<number | null> {
  // Si viene como entero: usuario.id
  if (!userId.includes("-")) {
    return Number(userId);
  }

  // Si viene como UUID: buscar por auth_id
  const { data, error } = await supabase
    .from("usuarios")
    .select("id")
    .eq("auth_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

export const useUsuarioRoles = (userId?: string) => {
  return useQuery({
    queryKey: ["usuario_roles", userId],
    queryFn: async () => {
      if (!userId) return [];

      const usuarioId = await resolveUsuarioId(userId);
      if (!usuarioId) return [];

      const { data, error } = await supabase
        .from("roles_usuarios")
        .select("rol")
        .eq("usuario_id", usuarioId);

      if (error) throw error;
      return (data || []).map((r: any) => r.rol as AppRole);
    },
  });
};

export const useAsignarRol = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { userId: string; role: AppRole }) => {
      const authId = await resolveAuthId(params.userId);

      const { error } = await supabase.rpc("assign_user_role", {
        _auth_id: authId,
        _rol: params.role,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario_roles"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo asignar el rol: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
