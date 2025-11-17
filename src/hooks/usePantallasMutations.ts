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
      const { data: result, error } = await supabase
        .from("pantallas")
        .insert([{
          ...data,
          identificador: '', // El trigger lo generará automáticamente
        }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
    mutationFn: async ({ id, ...data }: {
      id: string;
      nombre?: string;
      sucursal_id?: string;
      estado?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("pantallas")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
