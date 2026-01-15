import { useMemo } from "react";
import { useCategorias } from "./useCategorias";

export const useCategoriasBySucursal = (sucursalId?: string) => {
  const { data: categorias = [], isLoading, error } = useCategorias();

  // En el esquema actual, las categorías están a nivel de cuenta, no de sucursal
  // Pero si en el futuro tienen sucursal_id, este hook lo manejará
  const filteredCategorias = useMemo(() => {
    if (!sucursalId || sucursalId === "all") {
      return categorias;
    }
    // Si las categorías tienen sucursal_id, filtrar
    return categorias.filter((c: any) => 
      !c.sucursal_id || c.sucursal_id === sucursalId
    );
  }, [categorias, sucursalId]);

  return {
    data: filteredCategorias,
    isLoading,
    error
  };
};

export default useCategoriasBySucursal;
