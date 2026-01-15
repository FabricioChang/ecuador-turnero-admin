import { useQuery } from "@tanstack/react-query";
import { useSucursales } from "./useSucursales";

export interface Canton {
  id: string;
  nombre: string;
  provincia: string;
}

export const useCantones = (provincia?: string) => {
  const { data: sucursales = [] } = useSucursales();

  return useQuery({
    queryKey: ["cantones-from-sucursales", sucursales, provincia],
    queryFn: async () => {
      // Extraer ciudades únicas de las sucursales
      const cantonesMap = new Map<string, Canton>();
      
      sucursales.forEach((suc: any) => {
        if (suc.ciudad) {
          const key = `${suc.ciudad}-${suc.provincia}`;
          cantonesMap.set(key, {
            id: suc.ciudad.toLowerCase().replace(/\s+/g, '-'),
            nombre: suc.ciudad,
            provincia: suc.provincia || ''
          });
        }
      });
      
      let cantones = Array.from(cantonesMap.values());
      
      // Filtrar por provincia si se especifica
      if (provincia) {
        cantones = cantones.filter(c => c.provincia === provincia);
      }
      
      return cantones.sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    enabled: sucursales.length > 0,
  });
};

export default useCantones;
