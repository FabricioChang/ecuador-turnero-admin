import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import type { Turno } from "@/types/database";

export interface TurnoRow extends Turno {
  categoria?: {
    nombre: string;
  };
  sucursal?: {
    nombre: string;
    region?: string;
    provincia?: string;
    ciudad?: string;
  };
  kiosko?: {
    codigo: string;
  };
  cliente?: {
    cedula: string;
    nombres: string;
    apellidos: string;
  };
}

export interface TurnoFilters {
  sucursalId?: string;
  categoriaId?: string;
  estado?: string;
  busqueda?: string;
}

export interface TurnoKPIs {
  enEspera: number;
  atendidos: number;
  perdidos: number;
  reagendados: number;
  total: number;
}

// Hook para obtener KPIs con counts reales de la base de datos
export const useTurnoKPIs = () => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["turno-kpis", cuenta?.id],
    queryFn: async (): Promise<TurnoKPIs> => {
      if (!cuenta?.id) {
        return { enEspera: 0, atendidos: 0, perdidos: 0, reagendados: 0, total: 0 };
      }

      // Get counts for each status using separate count queries
      const [enEsperaResult, atendidosResult, perdidosResult, reagendadosResult, totalResult] = await Promise.all([
        // En espera: pendiente + en_atencion
        supabaseExternal
          .from("turno")
          .select("*", { count: "exact", head: true })
          .eq("cuenta_id", cuenta.id)
          .in("estado", ["pendiente", "en_atencion", "espera"]),
        
        // Atendidos
        supabaseExternal
          .from("turno")
          .select("*", { count: "exact", head: true })
          .eq("cuenta_id", cuenta.id)
          .eq("estado", "atendido"),
        
        // Perdidos: cancelado + perdido
        supabaseExternal
          .from("turno")
          .select("*", { count: "exact", head: true })
          .eq("cuenta_id", cuenta.id)
          .in("estado", ["cancelado", "perdido"]),
        
        // Reagendados
        supabaseExternal
          .from("turno")
          .select("*", { count: "exact", head: true })
          .eq("cuenta_id", cuenta.id)
          .eq("estado", "reagendado"),
        
        // Total
        supabaseExternal
          .from("turno")
          .select("*", { count: "exact", head: true })
          .eq("cuenta_id", cuenta.id),
      ]);

      return {
        enEspera: enEsperaResult.count ?? 0,
        atendidos: atendidosResult.count ?? 0,
        perdidos: perdidosResult.count ?? 0,
        reagendados: reagendadosResult.count ?? 0,
        total: totalResult.count ?? 0,
      };
    },
    enabled: !!cuenta?.id,
  });
};

// Hook con paginación
export const useTurnosWithPagination = (
  page: number = 1,
  pageSize: number = 10,
  filters?: TurnoFilters
) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["turnos-paginated", cuenta?.id, page, pageSize, filters],
    queryFn: async () => {
      if (!cuenta?.id) return { data: [], count: 0, totalPages: 0 };

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabaseExternal
        .from("turno")
        .select(
          `
          *,
          categoria:categoria(nombre),
          sucursal:sucursal(nombre, region, provincia, ciudad),
          kiosko:kiosko(codigo),
          cliente:cliente(cedula, nombres, apellidos)
        `,
          { count: "exact" }
        )
        .eq("cuenta_id", cuenta.id)
        .order("emitido_en", { ascending: false })
        .range(from, to);

      if (filters?.sucursalId && filters.sucursalId !== "all") {
        query = query.eq("sucursal_id", filters.sucursalId);
      }
      if (filters?.categoriaId && filters.categoriaId !== "all") {
        query = query.eq("categoria_id", filters.categoriaId);
      }
      if (filters?.estado && filters.estado !== "all") {
        query = query.eq("estado", filters.estado);
      }
      if (filters?.busqueda) {
        query = query.ilike("numero", `%${filters.busqueda}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      const totalPages = Math.ceil((count ?? 0) / pageSize);

      return {
        data: data as TurnoRow[],
        count: count ?? 0,
        totalPages,
        currentPage: page,
        pageSize,
      };
    },
    enabled: !!cuenta?.id,
  });
};

export default useTurnosWithPagination;
