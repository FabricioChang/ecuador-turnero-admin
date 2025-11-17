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
      const { data: result, error } = await supabase
        .from("categorias")
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
    mutationFn: async ({ id, ...data }: {
      id: string;
      nombre?: string;
      descripcion?: string;
      tiempo_estimado?: number;
      sucursal_id?: string;
      color?: string;
      estado?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("categorias")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
