import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

export interface Rol {
  id: string;
  cuenta_id: string;
  nombre: string;
  es_sistema: boolean;
}

export interface Permiso {
  id: string;
  codigo: string;
}

export interface RolPermiso {
  rol_id: string;
  permiso_id: string;
}

// Hook para obtener roles de la cuenta actual
export const useRolesExternal = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["roles-external", cuenta?.id],
    queryFn: async () => {
      if (!cuenta?.id) return [];
      
      const { data, error } = await (supabaseExternal as any)
        .from("rol")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data as Rol[];
    },
    enabled: !!cuenta?.id,
  });
};

// Hook para obtener todos los permisos disponibles
export const usePermisosExternal = () => {
  return useQuery({
    queryKey: ["permisos-external"],
    queryFn: async () => {
      const { data, error } = await (supabaseExternal as any)
        .from("permiso")
        .select("*")
        .order("codigo", { ascending: true });

      if (error) throw error;
      return data as Permiso[];
    },
  });
};

// Hook para obtener los permisos de un rol específico
export const useRolPermisosExternal = (rolId?: string) => {
  return useQuery({
    queryKey: ["rol-permisos-external", rolId],
    queryFn: async () => {
      if (!rolId) return [];

      const { data, error } = await (supabaseExternal as any)
        .from("rol_permiso")
        .select("permiso_id")
        .eq("rol_id", rolId);

      if (error) throw error;
      return (data || []).map((rp: { permiso_id: string }) => rp.permiso_id);
    },
    enabled: !!rolId,
  });
};

// Hook para actualizar los permisos de un rol
export const useUpdateRolPermisosExternal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ rolId, permisoIds }: { rolId: string; permisoIds: string[] }) => {
      // Eliminar permisos existentes para este rol
      const { error: deleteError } = await (supabaseExternal as any)
        .from("rol_permiso")
        .delete()
        .eq("rol_id", rolId);

      if (deleteError) throw deleteError;

      // Insertar nuevos permisos
      if (permisoIds.length > 0) {
        const { error: insertError } = await (supabaseExternal as any)
          .from("rol_permiso")
          .insert(permisoIds.map(pid => ({
            rol_id: rolId,
            permiso_id: pid
          })));

        if (insertError) throw insertError;
      }

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rol-permisos-external", variables.rolId] });
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

// Hook para crear un nuevo rol
export const useCreateRolExternal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { cuenta } = useCuenta();

  return useMutation({
    mutationFn: async ({ nombre, permisoIds }: { 
      nombre: string; 
      permisoIds?: string[];
    }) => {
      if (!cuenta?.id) throw new Error("No hay cuenta seleccionada");

      const newId = crypto.randomUUID();

      const { data: rol, error } = await (supabaseExternal as any)
        .from("rol")
        .insert({
          id: newId,
          cuenta_id: cuenta.id,
          nombre,
          es_sistema: false
        })
        .select()
        .single();

      if (error) throw error;

      // Insertar permisos si se proporcionan
      if (permisoIds && permisoIds.length > 0 && rol) {
        await (supabaseExternal as any)
          .from("rol_permiso")
          .insert(permisoIds.map(pid => ({
            rol_id: rol.id,
            permiso_id: pid
          })));
      }

      return rol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-external"] });
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

// Hook para eliminar un rol
export const useDeleteRolExternal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rolId: string) => {
      // Eliminar permisos primero
      await (supabaseExternal as any)
        .from("rol_permiso")
        .delete()
        .eq("rol_id", rolId);

      const { error } = await (supabaseExternal as any)
        .from("rol")
        .delete()
        .eq("id", rolId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-external"] });
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

export default useRolesExternal;
