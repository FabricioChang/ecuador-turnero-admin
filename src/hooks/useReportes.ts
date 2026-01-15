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

      // Query with joins to get related data
      let query = (supabaseExternal as any)
        .from("turno")
        .select(`
          *,
          categoria:categoria(id, nombre),
          sucursal:sucursal(id, nombre, region, provincia, ciudad),
          kiosko:kiosko(id, codigo),
          cliente:cliente(cedula, nombres, apellidos)
        `)
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

      const tiemposAtencion = turnos
        .filter((t: any) => t.tiempo_atencion !== null)
        .map((t: any) => t.tiempo_atencion as number);
      
      const tiempoPromedioAtencion = tiemposAtencion.length > 0
        ? Math.round(tiemposAtencion.reduce((a: number, b: number) => a + b, 0) / tiemposAtencion.length / 60)
        : 0;

      const eficiencia = totalTurnos > 0
        ? Math.round((turnosCompletados / totalTurnos) * 100)
        : 0;

      // Group by day
      const turnosPorDia = turnos.reduce((acc: any[], turno: any) => {
        const fecha = turno.emitido_dia || turno.emitido_en?.split('T')[0];
        if (!fecha) return acc;
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

      // Group by category with real names - assign colors dynamically
      const categoryColors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-6))",
      ];
      const distribucionCategorias = turnos.reduce((acc: any[], turno: any) => {
        const catId = turno.categoria_id;
        const catNombre = turno.categoria?.nombre || 'Sin categoría';
        const existing = acc.find((c: any) => c.id === catId);
        if (existing) {
          existing.turnos++;
        } else {
          acc.push({
            id: catId,
            nombre: catNombre,
            color: categoryColors[acc.length % categoryColors.length],
            turnos: 1
          });
        }
        return acc;
      }, []);

      // Group by sucursal
      const actividadSucursales = turnos.reduce((acc: any[], turno: any) => {
        const sucId = turno.sucursal_id;
        const sucNombre = turno.sucursal?.nombre || 'Sin sucursal';
        const existing = acc.find((s: any) => s.id === sucId);
        if (existing) {
          existing.turnos++;
        } else {
          acc.push({
            id: sucId,
            nombre: sucNombre,
            turnos: 1
          });
        }
        return acc;
      }, []).sort((a: any, b: any) => b.turnos - a.turnos).slice(0, 10);

      // Group by kiosko
      const actividadKioskos = turnos.reduce((acc: any[], turno: any) => {
        const kioId = turno.kiosko_id;
        const kioNombre = turno.kiosko?.codigo || 'Sin kiosko';
        const existing = acc.find((k: any) => k.id === kioId);
        if (existing) {
          existing.turnos++;
        } else {
          acc.push({
            id: kioId,
            nombre: kioNombre,
            turnos: 1
          });
        }
        return acc;
      }, []).sort((a: any, b: any) => b.turnos - a.turnos).slice(0, 10);

      // Group wait times by hour
      const tiemposEsperaPorHora = turnos.reduce((acc: any[], turno: any) => {
        if (!turno.emitido_en || turno.tiempo_espera === null) return acc;
        const hora = new Date(turno.emitido_en).getHours();
        const horaStr = `${hora.toString().padStart(2, '0')}:00`;
        const existing = acc.find((h: any) => h.hora === horaStr);
        if (existing) {
          existing.tiempos.push(turno.tiempo_espera);
          existing.tiempoEspera = Math.round(
            existing.tiempos.reduce((a: number, b: number) => a + b, 0) / existing.tiempos.length / 60
          );
        } else {
          acc.push({
            hora: horaStr,
            tiempos: [turno.tiempo_espera],
            tiempoEspera: Math.round(turno.tiempo_espera / 60)
          });
        }
        return acc;
      }, []).sort((a: any, b: any) => a.hora.localeCompare(b.hora));

      return {
        metricas: {
          totalTurnos,
          turnosCompletados,
          tiempoPromedioEspera,
          tiempoPromedioAtencion,
          eficiencia
        },
        turnosPorDia,
        distribucionCategorias,
        actividadSucursales,
        actividadKioskos,
        tiemposEsperaPorHora,
        turnosRaw: turnos
      };
    },
    enabled: !!cuenta?.id,
  });
};

export default useReportes;
