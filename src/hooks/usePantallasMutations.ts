import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useToast } from "@/hooks/use-toast";

export const useCreatePantalla = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      sucursal_id: string;
      estado?: string;
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("pantalla")
        .insert({
          sucursal_id: data.sucursal_id,
          nombre: data.nombre,
          layout: {},
          estado: 'activo'
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantallas"] });
      toast({
        title: "Pantalla creada",
        description: "La pantalla ha sido creada correctamente.",
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

export const useUpdatePantalla = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      nombre?: string;
      estado?: string;
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("pantalla")
        .update({
          nombre: data.nombre,
          estado: data.estado as 'activo' | 'inactivo' | 'mantenimiento'
        })
        .eq("id", data.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantallas"] });
      toast({
        title: "Pantalla actualizada",
        description: "La pantalla ha sido actualizada correctamente.",
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

export const useDeletePantalla = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabaseExternal as any)
        .from("pantalla")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantallas"] });
      toast({
        title: "Pantalla eliminada",
        description: "La pantalla ha sido eliminada correctamente.",
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
