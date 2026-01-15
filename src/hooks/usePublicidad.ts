import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Publicidad {
  id: string;
  nombre: string;
  tipo: "imagen" | "video";
  url_archivo: string;
  duracion: number;
  estado: string;
  identificador: string | null;
  fecha_creacion: string;
  created_at: string;
  updated_at: string;
}

export const usePublicidad = () => {
  return useQuery({
    queryKey: ["publicidad"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Publicidad[];
    },
  });
};

export const useUploadPublicidad = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      nombre,
      archivo,
      duracion,
    }: {
      nombre: string;
      archivo: File;
      duracion: number;
    }) => {
      // Determine file type
      const isVideo = archivo.type.startsWith("video/");
      const tipo = isVideo ? "video" : "imagen";

      // Generate unique filename
      const fileExt = archivo.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${tipo}s/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("publicidad")
        .upload(filePath, archivo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("publicidad")
        .getPublicUrl(filePath);

      const url_archivo = urlData.publicUrl;

      // Create record in database using RPC function
      const { data, error } = await supabase.rpc("create_publicidad", {
        _nombre: nombre,
        _tipo: tipo,
        _url_archivo: url_archivo,
        _duracion: duracion,
        _estado: "activo",
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast({
        title: "Contenido subido",
        description: "El contenido publicitario se ha subido correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al subir",
        description: error.message || "No se pudo subir el contenido.",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePublicidad = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (publicidad: Publicidad) => {
      // Extract file path from URL
      const url = new URL(publicidad.url_archivo);
      const pathParts = url.pathname.split("/storage/v1/object/public/publicidad/");
      const filePath = pathParts[1];

      // Delete file from storage
      if (filePath) {
        await supabase.storage.from("publicidad").remove([filePath]);
      }

      // Delete record from database
      const { error } = await supabase
        .from("publicidad")
        .delete()
        .eq("id", publicidad.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast({
        title: "Contenido eliminado",
        description: "El contenido publicitario se ha eliminado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el contenido.",
        variant: "destructive",
      });
    },
  });
};

export default usePublicidad;
