// Publicidad is not in the new schema yet
// This hook returns empty data

import { useQuery } from "@tanstack/react-query";

export const usePublicidad = () => {
  return useQuery({
    queryKey: ["publicidad-legacy"],
    queryFn: async () => {
      // Return empty array - not implemented in new schema yet
      return [];
    },
  });
};

export default usePublicidad;
