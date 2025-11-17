import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCreateSucursal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      provincia_id: string;
      canton_id: string;
      direccion?: string;
      estado?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("sucursales")
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
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      toast({
        title: "Éxito",
        description: "Sucursal creada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la sucursal",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSucursal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string;
      nombre?: string;
      provincia_id?: string;
      canton_id?: string;
      direccion?: string;
      estado?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("sucursales")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      toast({
        title: "Éxito",
        description: "Sucursal actualizada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la sucursal",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSucursal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sucursales")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      toast({
        title: "Éxito",
        description: "Sucursal eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la sucursal",
        variant: "destructive",
      });
    },
  });
};
