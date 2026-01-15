import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

export const useCreateSucursal = () => {
  const queryClient = useQueryClient();
  const { cuenta } = useCuenta();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      nombre: string;
      region?: string;
      provincia?: string;
      ciudad?: string;
      direccion?: string;
    }) => {
      if (!cuenta?.id) throw new Error("No hay cuenta seleccionada");

      // Generate a simple identifier
      const identificador = `SUC-${Date.now().toString(36).toUpperCase()}`;

      const { data: result, error } = await (supabaseExternal as any)
        .from("sucursal")
        .insert({
          nombre: data.nombre,
          region: data.region || "",
          provincia: data.provincia || "",
          ciudad: data.ciudad || "",
          direccion: data.direccion || "",
          codigo: identificador,
          estado: "activo",
          cuenta_id: cuenta.id,
        })
        .select("id")
        .single();

      if (error) throw error;
      return result.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      toast({
        title: "Sucursal creada",
        description: "La sucursal ha sido creada correctamente.",
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

export const useUpdateSucursal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      nombre: string;
      region?: string;
      provincia?: string;
      ciudad?: string;
      direccion?: string | null;
      estado?: string;
    }) => {
      const { error } = await (supabaseExternal as any)
        .from("sucursal")
        .update({
          nombre: data.nombre,
          region: data.region,
          provincia: data.provincia,
          ciudad: data.ciudad,
          direccion: data.direccion || "",
          estado: data.estado === "activo" ? "activo" : "inactivo"
        })
        .eq("id", data.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      toast({
        title: "Sucursal actualizada",
        description: "La sucursal ha sido actualizada correctamente.",
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

export const useDeleteSucursal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabaseExternal as any)
        .from("sucursal")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] });
      toast({
        title: "Sucursal eliminada",
        description: "La sucursal ha sido eliminada correctamente.",
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
