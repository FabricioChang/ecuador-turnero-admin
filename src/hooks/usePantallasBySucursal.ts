import { useMemo } from "react";
import { usePantallas } from "./usePantallas";

export const usePantallasBySucursal = (sucursalId?: string) => {
  const { data: pantallas = [], isLoading, error } = usePantallas();

  const filteredPantallas = useMemo(() => {
    if (!sucursalId || sucursalId === "all") {
      return pantallas;
    }
    return pantallas.filter((p: any) => p.sucursal_id === sucursalId);
  }, [pantallas, sucursalId]);

  return {
    data: filteredPantallas,
    isLoading,
    error
  };
};

export default usePantallasBySucursal;
