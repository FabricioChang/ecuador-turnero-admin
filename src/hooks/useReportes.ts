import { useQuery } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";

export const useReportes = (
  dateFrom: Date,
  dateTo: Date,
  sucursalId: string,
  kioskoId: string,
  categoriaId: string
) => {
  const { cuenta } = useCuenta();

  return useQuery({
    queryKey: ["reportes", cuenta?.id, dateFrom, dateTo, sucursalId, kioskoId, categoriaId],
    queryFn: async () => {
      if (!cuenta?.id) return null;

      let query = (supabaseExternal as any)
        .from("turno")
        .select("*")
        .eq("cuenta_id", cuenta.id)
        .gte("emitido_en", dateFrom.toISOString())
        .lte("emitido_en", dateTo.toISOString());

      if (sucursalId && sucursalId !== "all") {
        query = query.eq("sucursal_id", sucursalId);
      }
      if (kioskoId && kioskoId !== "all") {
        query = query.eq("kiosko_id", kioskoId);
      }
      if (categoriaId && categoriaId !== "all") {
        query = query.eq("categoria_id", categoriaId);
      }

      const { data: turnos, error } = await query;
      if (error) throw error;

      if (!turnos || turnos.length === 0) {
        return null;
      }

      // Calculate metrics
      const totalTurnos = turnos.length;
      const turnosCompletados = turnos.filter((t: any) => t.estado === 'atendido').length;
      const tiemposEspera = turnos
        .filter((t: any) => t.tiempo_espera !== null)
        .map((t: any) => t.tiempo_espera as number);
      
      const tiempoPromedioEspera = tiemposEspera.length > 0
        ? Math.round(tiemposEspera.reduce((a: number, b: number) => a + b, 0) / tiemposEspera.length / 60)
        : 0;

      const eficiencia = totalTurnos > 0
        ? Math.round((turnosCompletados / totalTurnos) * 100)
        : 0;

      // Group by day
      const turnosPorDia = turnos.reduce((acc: any[], turno: any) => {
        const fecha = turno.emitido_dia;
        const existing = acc.find(d => d.fecha === fecha);
        if (existing) {
          existing.turnos++;
          if (turno.estado === 'atendido') existing.completados++;
        } else {
          acc.push({
            fecha,
            turnos: 1,
            completados: turno.estado === 'atendido' ? 1 : 0
          });
        }
        return acc;
      }, []).sort((a: any, b: any) => a.fecha.localeCompare(b.fecha));

      // Group by category
      const distribucionCategorias = turnos.reduce((acc: any[], turno: any) => {
        const categoriaId = turno.categoria_id;
        const existing = acc.find((c: any) => c.id === categoriaId);
        if (existing) {
          existing.turnos++;
        } else {
          acc.push({
            id: categoriaId,
            nombre: `Categoría ${categoriaId.slice(0, 8)}`,
            turnos: 1
          });
        }
        return acc;
      }, []);

      return {
        metricas: {
          totalTurnos,
          turnosCompletados,
          tiempoPromedioEspera,
          tiempoPromedioAtencion: Math.round(tiempoPromedioEspera * 0.8),
          eficiencia
        },
        turnosPorDia,
        distribucionCategorias,
        actividadSucursales: [],
        actividadKioskos: [],
        tiemposEsperaPorHora: [],
        turnosRaw: turnos
      };
    },
    enabled: !!cuenta?.id,
  });
};

export default useReportes;
