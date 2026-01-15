import { useQuery } from "@tanstack/react-query";
import { useSucursales } from "./useSucursales";

export interface Provincia {
  id: string;
  nombre: string;
  region: string;
}

export const useProvincias = () => {
  const { data: sucursales = [] } = useSucursales();

  return useQuery({
    queryKey: ["provincias-from-sucursales", sucursales],
    queryFn: async () => {
      // Extraer provincias únicas de las sucursales
      const provinciasMap = new Map<string, Provincia>();
      
      sucursales.forEach((suc: any) => {
        if (suc.provincia) {
          provinciasMap.set(suc.provincia, {
            id: suc.provincia.toLowerCase().replace(/\s+/g, '-'),
            nombre: suc.provincia,
            region: suc.region || ''
          });
        }
      });
      
      return Array.from(provinciasMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    enabled: sucursales.length > 0,
  });
};

export default useProvincias;
