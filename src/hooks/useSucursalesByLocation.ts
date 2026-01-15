import { useMemo } from "react";
import { useSucursales } from "./useSucursales";
import { useRegiones } from "./useRegiones";

interface LocationFilters {
  region?: string;
  provincia?: string;
  ciudad?: string;
}

export const useSucursalesByLocation = (filters: LocationFilters) => {
  const { data: sucursales = [], isLoading, error } = useSucursales();
  const { regiones } = useRegiones();

  const filteredSucursales = useMemo(() => {
    let result = [...sucursales];

    // Filtrar por región
    if (filters.region && filters.region !== "all") {
      const regionData = regiones.find(r => r.id === filters.region);
      if (regionData) {
        result = result.filter((s: any) => 
          regionData.provincias.includes(s.provincia)
        );
      }
    }

    // Filtrar por provincia
    if (filters.provincia && filters.provincia !== "all") {
      result = result.filter((s: any) => s.provincia === filters.provincia);
    }

    // Filtrar por ciudad
    if (filters.ciudad && filters.ciudad !== "all") {
      result = result.filter((s: any) => s.ciudad === filters.ciudad);
    }

    return result;
  }, [sucursales, filters.region, filters.provincia, filters.ciudad, regiones]);

  return {
    data: filteredSucursales,
    isLoading,
    error
  };
};

export default useSucursalesByLocation;
