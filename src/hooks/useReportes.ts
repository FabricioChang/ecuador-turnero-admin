import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, format, eachDayOfInterval } from "date-fns";

export const useReportes = (dateFrom: Date, dateTo: Date, sucursalId?: string, kioskosId?: string, categoriaId?: string) => {
  return useQuery({
    queryKey: ["reportes", dateFrom, dateTo, sucursalId, kioskosId, categoriaId],
    queryFn: async () => {
      let query = supabase
        .from("turnos")
        .select(`
          *,
          categoria:categorias(nombre, color),
          sucursal:sucursales(nombre),
          kiosko:kioskos(identificador, nombre)
        `)
        .gte("fecha_creacion", startOfDay(dateFrom).toISOString())
        .lte("fecha_creacion", endOfDay(dateTo).toISOString());

      if (sucursalId && sucursalId !== "all") {
        query = query.eq("sucursal_id", sucursalId);
      }
      if (kioskosId && kioskosId !== "all") {
        query = query.eq("kiosko_id", kioskosId);
      }
      if (categoriaId && categoriaId !== "all") {
        query = query.eq("categoria_id", categoriaId);
      }

      const { data, error } = await query.order("fecha_creacion", { ascending: true });

      if (error) throw error;

      // Calcular métricas
      const totalTurnos = data.length;
      const turnosCompletados = data.filter((t: any) => t.estado === "atendido").length;
      const turnosEnAtencion = data.filter((t: any) => t.estado === "en_atencion").length;
      const turnosPendientes = data.filter((t: any) => t.estado === "pendiente").length;
      const turnosCancelados = data.filter((t: any) => t.estado === "cancelado").length;

      // Tiempo promedio de espera
      const tiemposEspera = data
        .filter((t: any) => t.tiempo_espera !== null)
        .map((t: any) => t.tiempo_espera);
      const tiempoPromedioEspera = tiemposEspera.length > 0
        ? Math.round(tiemposEspera.reduce((a: number, b: number) => a + b, 0) / tiemposEspera.length)
        : 0;

      // Tiempo promedio de atención
      const tiemposAtencion = data
        .filter((t: any) => t.tiempo_atencion !== null)
        .map((t: any) => t.tiempo_atencion);
      const tiempoPromedioAtencion = tiemposAtencion.length > 0
        ? Math.round(tiemposAtencion.reduce((a: number, b: number) => a + b, 0) / tiemposAtencion.length)
        : 0;

      // Eficiencia (turnos completados / total)
      const eficiencia = totalTurnos > 0 ? Math.round((turnosCompletados / totalTurnos) * 100) : 0;

      // Turnos por día
      const dias = eachDayOfInterval({ start: dateFrom, end: dateTo });
      const turnosPorDia = dias.map((dia) => {
        const turnosDelDia = data.filter((t: any) => {
          const fechaTurno = new Date(t.fecha_creacion);
          return format(fechaTurno, "yyyy-MM-dd") === format(dia, "yyyy-MM-dd");
        });
        return {
          fecha: format(dia, "yyyy-MM-dd"),
          turnos: turnosDelDia.length,
          completados: turnosDelDia.filter((t: any) => t.estado === "atendido").length,
        };
      });

      // Distribución por categorías
      const categoriaMap: Record<string, { turnos: number; color: string; nombre: string }> = {};
      data.forEach((turno: any) => {
        const catNombre = turno.categoria?.nombre || "Sin categoría";
        const catColor = turno.categoria?.color || "#gray";
        if (!categoriaMap[catNombre]) {
          categoriaMap[catNombre] = { turnos: 0, color: catColor, nombre: catNombre };
        }
        categoriaMap[catNombre].turnos++;
      });
      const distribucionCategorias = Object.values(categoriaMap);

      // Actividad por sucursales
      const sucursalMap: Record<string, { turnos: number; completados: number }> = {};
      data.forEach((turno: any) => {
        const sucNombre = turno.sucursal?.nombre || "Sin sucursal";
        if (!sucursalMap[sucNombre]) {
          sucursalMap[sucNombre] = { turnos: 0, completados: 0 };
        }
        sucursalMap[sucNombre].turnos++;
        if (turno.estado === "atendido") {
          sucursalMap[sucNombre].completados++;
        }
      });
      const actividadSucursales = Object.entries(sucursalMap).map(([sucursal, stats]) => ({
        sucursal,
        turnos: stats.turnos,
        eficiencia: stats.turnos > 0 ? Math.round((stats.completados / stats.turnos) * 100) : 0,
      }));

      // Actividad por kioskos
      const kioskoMap: Record<string, { turnos: number; identificador: string }> = {};
      data.forEach((turno: any) => {
        const kioskoId = turno.kiosko?.identificador || "Sin kiosko";
        if (!kioskoMap[kioskoId]) {
          kioskoMap[kioskoId] = { turnos: 0, identificador: kioskoId };
        }
        kioskoMap[kioskoId].turnos++;
      });
      const actividadKioskos = Object.values(kioskoMap).map((k) => ({
        kiosko: k.identificador,
        turnos: k.turnos,
      }));

      // Tiempos de espera por hora (aproximado desde fecha_creacion)
      const tiemposPorHora: Record<string, number[]> = {};
      data.forEach((turno: any) => {
        if (turno.tiempo_espera !== null) {
          const hora = format(new Date(turno.fecha_creacion), "HH:00");
          if (!tiemposPorHora[hora]) {
            tiemposPorHora[hora] = [];
          }
          tiemposPorHora[hora].push(turno.tiempo_espera);
        }
      });
      const tiemposEsperaPorHora = Object.entries(tiemposPorHora)
        .map(([hora, tiempos]) => ({
          hora,
          tiempo: Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length),
        }))
        .sort((a, b) => a.hora.localeCompare(b.hora));

      return {
        metricas: {
          totalTurnos,
          turnosCompletados,
          turnosEnAtencion,
          turnosPendientes,
          turnosCancelados,
          tiempoPromedioEspera,
          tiempoPromedioAtencion,
          eficiencia,
        },
        turnosPorDia,
        distribucionCategorias,
        actividadSucursales,
        actividadKioskos,
        tiemposEsperaPorHora,
        turnosRaw: data,
      };
    },
  });
};
