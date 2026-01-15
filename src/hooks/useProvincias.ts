// Not used in the new schema - regions are stored directly in sucursal table
// This hook returns empty data to satisfy existing imports while we migrate

import { useQuery } from "@tanstack/react-query";

export const useProvincias = () => {
  return useQuery({
    queryKey: ["provincias-legacy"],
    queryFn: async () => {
      // Return empty array - not used in new schema
      return [];
    },
  });
};

export default useProvincias;
