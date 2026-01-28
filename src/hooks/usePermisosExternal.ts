import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";

export interface Permiso {
  id: string;
  codigo: string;
}

// Parse permission category from codigo (format: "categoria.permiso")
export const getPermisoCategory = (codigo: string): string => {
  const parts = codigo.split(".");
  return parts[0] || "general";
};

// Parse permission description from codigo 
export const getPermisoDescription = (codigo: string): string => {
  // Convert "usuarios.crear" to "Crear usuarios"
  const parts = codigo.split(".");
  if (parts.length >= 2) {
    const action = parts[1];
    const resource = parts[0];
    const actionMap: Record<string, string> = {
      crear: "Crear",
      ver: "Ver",
      editar: "Editar",
      eliminar: "Eliminar",
      gestionar: "Gestionar",
      exportar: "Exportar",
      importar: "Importar",
    };
    const mappedAction = actionMap[action] || action;
    return `${mappedAction} ${resource}`;
  }
  return codigo;
};

export interface PermisoWithMeta extends Permiso {
  category: string;
  name: string;
  description: string;
}

export const usePermisosExternal = () => {
  return useQuery({
    queryKey: ["permisos-external"],
    queryFn: async () => {
      const { data, error } = await (supabaseExternal as any)
        .from("permiso")
        .select("*")
        .order("codigo", { ascending: true });

      if (error) throw error;
      
      // Transform to include category and description
      return (data || []).map((permiso: Permiso): PermisoWithMeta => ({
        ...permiso,
        category: getPermisoCategory(permiso.codigo),
        name: permiso.codigo,
        description: getPermisoDescription(permiso.codigo),
      }));
    },
  });
};

export default usePermisosExternal;
