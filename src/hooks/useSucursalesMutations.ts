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
      const { data: newId, error } = await supabase.rpc('create_sucursal', {
        _nombre: data.nombre,
        _identificador: '',
        _provincia_id: data.provincia_id,
        _canton_id: data.canton_id,
        _direccion: data.direccion,
        _email: data.email,
        _telefono_sms: data.telefono_sms,
        _capacidad_maxima: data.capacidad_maxima,
        _estado: data.estado || 'activo'
      });
      
      if (error) throw error;
      return { id: newId };
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
    mutationFn: async ({ id, nombre, provincia_id, canton_id, direccion, email, telefono_sms, capacidad_maxima, estado }: {
      id: string;
      nombre?: string;
      provincia_id?: string;
      canton_id?: string;
      direccion?: string | null;
      email?: string | null;
      telefono_sms?: string | null;
      capacidad_maxima?: number | null;
      estado?: string;
    }) => {
      const { data: success, error } = await supabase.rpc('update_sucursal', {
        _id: id,
        _nombre: nombre!,
        _provincia_id: provincia_id!,
        _canton_id: canton_id!,
        _direccion: direccion,
        _email: email,
        _telefono_sms: telefono_sms,
        _capacidad_maxima: capacidad_maxima,
        _estado: estado || 'activo'
      });
      
      if (error) throw error;
      return success;
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
