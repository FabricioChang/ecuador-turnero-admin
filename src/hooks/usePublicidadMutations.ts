import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCreatePublicidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      tipo: 'imagen' | 'video';
      url_archivo: string;
      duracion?: number;
      estado?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("publicidad")
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast({
        title: "Éxito",
        description: "Publicidad creada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la publicidad",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePublicidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string;
      nombre?: string;
      tipo?: 'imagen' | 'video';
      url_archivo?: string;
      duracion?: number;
      estado?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("publicidad")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast({
        title: "Éxito",
        description: "Publicidad actualizada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la publicidad",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePublicidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("publicidad")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast({
        title: "Éxito",
        description: "Publicidad eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la publicidad",
        variant: "destructive",
      });
    },
  });
};
