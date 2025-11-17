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
      const { data: newId, error } = await supabase.rpc('create_publicidad', {
        _nombre: data.nombre,
        _tipo: data.tipo,
        _url_archivo: data.url_archivo,
        _duracion: data.duracion || 10,
        _estado: data.estado || 'activa'
      });
      
      if (error) throw error;
      return { id: newId };
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
    mutationFn: async ({ id, nombre, tipo, url_archivo, duracion, estado }: {
      id: string;
      nombre?: string;
      tipo?: 'imagen' | 'video';
      url_archivo?: string;
      duracion?: number;
      estado?: string;
    }) => {
      const { data: success, error } = await supabase.rpc('update_publicidad', {
        _id: id,
        _nombre: nombre!,
        _tipo: tipo!,
        _url_archivo: url_archivo!,
        _duracion: duracion || 10,
        _estado: estado || 'activa'
      });
      
      if (error) throw error;
      return success;
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
