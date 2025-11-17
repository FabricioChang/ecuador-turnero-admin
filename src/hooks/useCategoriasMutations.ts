import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      descripcion?: string;
      tiempo_estimado?: number;
      sucursal_id?: string;
      color?: string;
      estado?: string;
    }) => {
      const { data: newId, error } = await supabase.rpc('create_categoria', {
        _nombre: data.nombre,
        _color: data.color || '#000000',
        _tiempo_estimado: data.tiempo_estimado || 15,
        _sucursal_id: data.sucursal_id || null,
        _descripcion: data.descripcion || null,
        _estado: data.estado || 'activo'
      });
      
      if (error) throw error;
      return { id: newId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({
        title: "Éxito",
        description: "Categoría creada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la categoría",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, nombre, descripcion, tiempo_estimado, sucursal_id, color, estado }: {
      id: string;
      nombre?: string;
      descripcion?: string;
      tiempo_estimado?: number;
      sucursal_id?: string;
      color?: string;
      estado?: string;
    }) => {
      const { data: success, error } = await supabase.rpc('update_categoria', {
        _id: id,
        _nombre: nombre!,
        _color: color || '#000000',
        _tiempo_estimado: tiempo_estimado || 15,
        _sucursal_id: sucursal_id || null,
        _descripcion: descripcion || null,
        _estado: estado || 'activo'
      });
      
      if (error) throw error;
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({
        title: "Éxito",
        description: "Categoría actualizada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la categoría",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({
        title: "Éxito",
        description: "Categoría eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    },
  });
};
