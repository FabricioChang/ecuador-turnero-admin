import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomRole {
  id: number;
  identificador: string | null;
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
        .from("roles_personalizados")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return (data || []) as CustomRole[];
    },
  });
};

export const useCreateCustomRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { nombre: string; descripcion?: string }) => {
      const { data: result, error } = await supabase
        .from("roles_personalizados")
        .insert({
          nombre: data.nombre,
          descripcion: data.descripcion ?? null,
          es_sistema: false,
        })
        .select("id")
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_roles"] });
      toast({
        title: "Rol creado",
        description: "El rol personalizado ha sido creado correctamente",
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
    mutationFn: async (data: {
      id: number | string;
      nombre: string;
      descripcion?: string;
    }) => {
      const { error } = await supabase
        .from("roles_personalizados")
        .update({
          nombre: data.nombre,
          descripcion: data.descripcion ?? null,
        })
        .eq("id", Number(data.id));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_roles"] });
      toast({
        title: "Rol actualizado",
        description: "El rol personalizado ha sido actualizado",
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
    mutationFn: async (id: number | string) => {
      const { error } = await supabase
        .from("roles_personalizados")
        .delete()
        .eq("id", Number(id));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_roles"] });
      toast({
        title: "Rol eliminado",
        description: "El rol personalizado ha sido eliminado",
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

// Permisos de roles personalizados
export const useCustomRolePermissions = (roleId?: number | string) => {
  return useQuery({
    queryKey: ["custom_role_permissions", roleId],
    queryFn: async () => {
      if (!roleId) return [];

      const { data, error } = await supabase
        .from("permisos_por_rol_personalizado")
        .select(
          `
          id,
          rol_personalizado_id,
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
        .eq("rol_personalizado_id", Number(roleId));

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateCustomRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      roleId: number | string;
      permissionIds: number[];
    }) => {
      const { roleId, permissionIds } = params;

      const { error: delError } = await supabase
        .from("permisos_por_rol_personalizado")
        .delete()
        .eq("rol_personalizado_id", Number(roleId));

      if (delError) throw delError;

      if (permissionIds.length > 0) {
        const inserts = permissionIds.map((permiso_id) => ({
          rol_personalizado_id: Number(roleId),
          permiso_id,
        }));

        const { error: insError } = await supabase
          .from("permisos_por_rol_personalizado")
          .insert(inserts);

        if (insError) throw insError;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["custom_role_permissions", variables.roleId],
      });
      toast({
        title: "Permisos actualizados",
        description:
          "Los permisos del rol personalizado han sido actualizados",
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
