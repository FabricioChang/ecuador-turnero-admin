import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCreateKiosko = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      sucursal_id: string;
      ubicacion?: string;
      estado?: 'activo' | 'inactivo' | 'mantenimiento';
    }) => {
      const { data: result, error } = await supabase
        .from("kioskos")
        .insert([{
          ...data,
          identificador: '', // Se genera automáticamente
        }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kioskos"] });
      toast({
        title: "Éxito",
        description: "Kiosko creado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el kiosko",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateKiosko = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string;
      nombre?: string;
      sucursal_id?: string;
      ubicacion?: string;
      estado?: 'activo' | 'inactivo' | 'mantenimiento';
    }) => {
      const { data: result, error } = await supabase
        .from("kioskos")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kioskos"] });
      toast({
        title: "Éxito",
        description: "Kiosko actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el kiosko",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteKiosko = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("kioskos")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kioskos"] });
      toast({
        title: "Éxito",
        description: "Kiosko eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el kiosko",
        variant: "destructive",
      });
    },
  });
};
