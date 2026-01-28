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
      prioridad?: 'regular' | 'preferente';
      tiempo_reagendamiento_min?: number;
      limite_reagendamientos?: number;
      notificaciones_automaticas?: boolean;
      alertas_administrativas?: boolean;
    }) => {
      if (!cuenta?.id) throw new Error("No cuenta selected");

      const newId = crypto.randomUUID();

      const { error } = await (supabaseExternal as any)
        .from("categoria")
        .insert({
          id: newId,
          cuenta_id: cuenta.id,
          nombre: data.nombre,
          descripcion: data.descripcion || null,
          prioridad: data.prioridad || 'regular',
          activo: true,
          tiempo_reagendamiento_min: data.tiempo_reagendamiento_min || 30,
          limite_reagendamientos: data.limite_reagendamientos || 3,
          notificaciones_automaticas: data.notificaciones_automaticas ?? true,
          alertas_administrativas: data.alertas_administrativas ?? false
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
      prioridad?: 'regular' | 'preferente';
      activo?: boolean;
      tiempo_reagendamiento_min?: number;
      limite_reagendamientos?: number;
      notificaciones_automaticas?: boolean;
      alertas_administrativas?: boolean;
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("categoria")
        .update({
          nombre: data.nombre,
          descripcion: data.descripcion || null,
          prioridad: data.prioridad || 'regular',
          activo: data.activo ?? true,
          tiempo_reagendamiento_min: data.tiempo_reagendamiento_min || 30,
          limite_reagendamientos: data.limite_reagendamientos || 3,
          notificaciones_automaticas: data.notificaciones_automaticas ?? true,
          alertas_administrativas: data.alertas_administrativas ?? false
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
