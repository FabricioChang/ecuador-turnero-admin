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
      direccion?: string | null;
      email?: string | null;
      telefono_sms?: string | null;
      capacidad_maxima?: number | null;
      estado?: string;
    }) => {
      const { data: newId, error } = await supabase.rpc("create_sucursal", {
        _nombre: data.nombre,
        _provincia_id: Number(data.provincia_id),
        _canton_id: Number(data.canton_id),
        _direccion: data.direccion ?? null,
        _email: data.email ?? null,
        _telefono_sms: data.telefono_sms ?? null,
        _capacidad_maxima: data.capacidad_maxima ?? null,
        _estado: data.estado ?? "activo",
      });

      if (error) throw error;
      return newId;
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
        description:
          error.message || "No se pudo crear la sucursal",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number | string;
      nombre: string;
      provincia_id: string;
      canton_id: string;
      direccion?: string | null;
      email?: string | null;
      telefono_sms?: string | null;
      capacidad_maxima?: number | null;
      estado?: string;
    }) => {
      const { error } = await supabase.rpc("update_sucursal", {
        _id: Number(data.id),
        _nombre: data.nombre,
        _provincia_id: Number(data.provincia_id),
        _canton_id: Number(data.canton_id),
        _direccion: data.direccion ?? null,
        _email: data.email ?? null,
        _telefono_sms: data.telefono_sms ?? null,
        _capacidad_maxima: data.capacidad_maxima ?? null,
        _estado: data.estado ?? "activo",
      });

      if (error) throw error;
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
        description:
          error.message || "No se pudo actualizar la sucursal",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const { error } = await supabase
        .from("sucursales")
        .delete()
        .eq("id", Number(id));

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
        description:
          error.message || "No se pudo eliminar la sucursal",
        variant: "destructive",
      });
    },
  });
};
