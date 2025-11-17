import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SucursalPayload {
  nombre: string;
  provincia_id: number;
  canton_id: number;
  direccion?: string | null;
  email?: string | null;
  telefono_sms?: string | null;
  capacidad_maxima?: number | null;
  estado?: string;
}

export const useCreateSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SucursalPayload) => {
      const { data: rpcData, error } = await supabase.rpc("create_sucursal", {
        _nombre: data.nombre,
        _provincia_id: data.provincia_id,
        _canton_id: data.canton_id,
        _direccion: data.direccion ?? null,
        _email: data.email ?? null,
        _telefono_sms: data.telefono_sms ?? null,
        _capacidad_maxima: data.capacidad_maxima ?? null,
        _estado: data.estado ?? "activo",
      });

      if (error) throw error;

      return { id: rpcData as number };
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
        description: error.message ?? "No se pudo crear la sucursal",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number } & SucursalPayload) => {
      const { id, ...data } = params;

      const { data: rpcData, error } = await supabase.rpc("update_sucursal", {
        _id: id,
        _nombre: data.nombre,
        _provincia_id: data.provincia_id,
        _canton_id: data.canton_id,
        _direccion: data.direccion ?? null,
        _email: data.email ?? null,
        _telefono_sms: data.telefono_sms ?? null,
        _capacidad_maxima: data.capacidad_maxima ?? null,
        _estado: data.estado ?? "activo",
      });

      if (error) throw error;

      return rpcData;
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
        description: error.message ?? "No se pudo actualizar la sucursal",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
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
        description: error.message ?? "No se pudo eliminar la sucursal",
        variant: "destructive",
      });
    },
  });
};
