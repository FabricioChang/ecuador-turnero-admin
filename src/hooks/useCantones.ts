// Not used in the new schema - cities are stored directly in sucursal table
// This hook returns empty data to satisfy existing imports while we migrate

import { useQuery } from "@tanstack/react-query";

export const useCantones = (provinciaId?: string) => {
  return useQuery({
    queryKey: ["cantones-legacy", provinciaId],
    queryFn: async () => {
      // Return empty array - not used in new schema
      return [];
    },
  });
};

export default useCantones;
