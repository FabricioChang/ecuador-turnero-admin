import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCreatePantalla = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      sucursal_id: string;
      estado?: string;
    }) => {
      const { data: newId, error } = await supabase.rpc('create_pantalla', {
        _nombre: data.nombre,
        _identificador: '',
        _sucursal_id: data.sucursal_id,
        _estado: data.estado || 'activa'
      });
      
      if (error) throw error;
      return { id: newId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantallas"] });
      toast({
        title: "Éxito",
        description: "Pantalla creada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la pantalla",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePantalla = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, nombre, sucursal_id, estado }: {
      id: string;
      nombre?: string;
      sucursal_id?: string;
      estado?: string;
    }) => {
      const { data: success, error } = await supabase.rpc('update_pantalla', {
        _id: id,
        _nombre: nombre!,
        _sucursal_id: sucursal_id!,
        _estado: estado || 'activa'
      });
      
      if (error) throw error;
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantallas"] });
      toast({
        title: "Éxito",
        description: "Pantalla actualizada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la pantalla",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePantalla = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pantallas")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantallas"] });
      toast({
        title: "Éxito",
        description: "Pantalla eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la pantalla",
        variant: "destructive",
      });
    },
  });
};
