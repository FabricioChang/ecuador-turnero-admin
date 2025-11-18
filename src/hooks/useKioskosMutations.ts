import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCreateKiosko = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      sucursal_id: string;
      ubicacion?: string | null;
      estado?: "activo" | "inactivo";
    }) => {
      const { data: newId, error } = await supabase.rpc("create_kiosko", {
        _nombre: data.nombre,
        _sucursal_id: Number(data.sucursal_id),
        _ubicacion: data.ubicacion ?? null,
        _estado: data.estado ?? "activo",
      });

      if (error) throw error;
      return newId;
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
        description:
          error.message || "No se pudo crear el kiosko",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateKiosko = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | number;
      nombre: string;
      sucursal_id: string;
      ubicacion?: string | null;
      estado?: "activo" | "inactivo";
    }) => {
      const { error } = await supabase.rpc("update_kiosko", {
        _id: Number(data.id),
        _nombre: data.nombre,
        _sucursal_id: Number(data.sucursal_id),
        _ubicacion: data.ubicacion ?? null,
        _estado: data.estado ?? "activo",
      });

      if (error) throw error;
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
        description:
          error.message || "No se pudo actualizar el kiosko",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteKiosko = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase
        .from("kioskos")
        .delete()
        .eq("id", Number(id));

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
        description:
          error.message || "No se pudo eliminar el kiosko",
        variant: "destructive",
      });
    },
  });
};
