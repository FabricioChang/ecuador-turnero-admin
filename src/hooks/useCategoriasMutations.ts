import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { cuenta } = useCuenta();

  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      descripcion?: string;
      tiempo_estimado?: number;
    }) => {
      if (!cuenta?.id) throw new Error("No cuenta selected");

      const { error } = await (supabaseExternal as any)
        .from("categoria")
        .insert({
          cuenta_id: cuenta.id,
          nombre: data.nombre,
          descripcion: data.descripcion || null,
          tiempo_prom_seg: (data.tiempo_estimado || 15) * 60,
          prioridad_default: "regular",
          activo: true
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({
        title: "Categoría creada",
        description: "La categoría ha sido creada correctamente.",
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

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      nombre: string;
      descripcion?: string;
      tiempo_estimado?: number;
      estado?: string;
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("categoria")
        .update({
          nombre: data.nombre,
          descripcion: data.descripcion || null,
          tiempo_prom_seg: (data.tiempo_estimado || 15) * 60,
          activo: data.estado !== "Inactiva"
        })
        .eq("id", data.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada correctamente.",
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

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabaseExternal as any)
        .from("categoria")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada correctamente.",
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
