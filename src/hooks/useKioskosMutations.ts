import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useToast } from "@/hooks/use-toast";

export const useCreateKiosko = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      sucursal_id: string;
      ubicacion?: string | null;
      estado?: 'activo' | 'inactivo' | 'mantenimiento';
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("kiosko")
        .insert({
          sucursal_id: data.sucursal_id,
          codigo: data.nombre.substring(0, 10).toUpperCase().replace(/\s/g, '-'),
          ubicacion: data.ubicacion || null,
          estado: data.estado === 'mantenimiento' ? 'inactivo' : (data.estado || 'activo')
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kioskos"] });
      toast({
        title: "Kiosko creado",
        description: "El kiosko ha sido creado correctamente.",
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

export const useUpdateKiosko = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      codigo?: string;
      sucursal_id?: string;
      ubicacion?: string | null;
      estado?: string;
    }) => {
      const updateData: any = {};
      if (data.codigo !== undefined) updateData.codigo = data.codigo;
      if (data.sucursal_id !== undefined) updateData.sucursal_id = data.sucursal_id;
      if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion;
      if (data.estado !== undefined) {
        updateData.estado = data.estado === 'mantenimiento' ? 'inactivo' : (data.estado as 'activo' | 'inactivo');
      }

      const { error } = await (supabaseExternal as any)
        .from("kiosko")
        .update(updateData)
        .eq("id", data.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kioskos"] });
      toast({
        title: "Kiosko actualizado",
        description: "El kiosko ha sido actualizado correctamente.",
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

export const useDeleteKiosko = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabaseExternal as any)
        .from("kiosko")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kioskos"] });
      toast({
        title: "Kiosko eliminado",
        description: "El kiosko ha sido eliminado correctamente.",
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
