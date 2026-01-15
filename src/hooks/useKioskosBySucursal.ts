import { useMemo } from "react";
import { useKioskos } from "./useKioskos";

export const useKioskosBySucursal = (sucursalId?: string) => {
  const { data: kioskos = [], isLoading, error } = useKioskos();

  const filteredKioskos = useMemo(() => {
    if (!sucursalId || sucursalId === "all") {
      return kioskos;
    }
    return kioskos.filter((k: any) => k.sucursal_id === sucursalId);
  }, [kioskos, sucursalId]);

  return {
    data: filteredKioskos,
    isLoading,
    error
  };
};

export default useKioskosBySucursal;
