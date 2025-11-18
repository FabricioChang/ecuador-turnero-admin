import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns";

export const useReportes = (
  dateFrom: Date,
  dateTo: Date,
  sucursalId?: string,
  kioskosId?: string,
  categoriaId?: string
) => {
  return useQuery({
    queryKey: ["reportes", dateFrom, dateTo, sucursalId, kioskosId, categoriaId],
    queryFn: async () => {
      let query = supabase
        .from("turnos")
        .select(
          `
          id,
          categoria_id,
          sucursal_id,
          kiosko_id,
          cliente_nombre,
          cliente_identificacion,
          estado,
          fecha_creacion,
          fecha_llamado,
          fecha_atencion,
          fecha_finalizacion,
          tiempo_espera,
          tiempo_atencion,
          categoria:categorias(id, nombre, color),
          sucursal:sucursales(id, nombre),
          kiosko:kioskos(id, nombre)
        `
        )
        .gte("fecha_creacion", startOfDay(dateFrom).toISOString())
        .lte("fecha_creacion", endOfDay(dateTo).toISOString());

      if (sucursalId && sucursalId !== "all") {
        query = query.eq("sucursal_id", Number(sucursalId));
      }

      if (kioskosId && kioskosId !== "all") {
        query = query.eq("kiosko_id", Number(kioskosId));
      }

      if (categoriaId && categoriaId !== "all") {
        query = query.eq("categoria_id", Number(categoriaId));
      }

      const { data, error } = await query;

      if (error) throw error;

      const turnos = (data ?? []) as any[];

      // ---------------- Métricas globales ----------------
      const totalTurnos = turnos.length;
      const turnosCompletados = turnos.filter(
        (t) => t.estado === "atendido"
      ).length;

      const tiemposEspera = turnos
        .map((t) => t.tiempo_espera)
        .filter((v) => typeof v === "number" && !Number.isNaN(v));

      const tiempoPromedioEspera =
        tiemposEspera.length > 0
          ? Math.round(
              tiemposEspera.reduce((acc, v) => acc + v, 0) / tiemposEspera.length
            )
          : 0;

      const tiemposAtencion = turnos
        .map((t) => t.tiempo_atencion)
        .filter((v) => typeof v === "number" && !Number.isNaN(v));

      const tiempoPromedioAtencion =
        tiemposAtencion.length > 0
          ? Math.round(
              tiemposAtencion.reduce((acc, v) => acc + v, 0) /
                tiemposAtencion.length
            )
          : 0;

      const eficiencia =
        totalTurnos > 0
          ? Math.round((turnosCompletados / totalTurnos) * 100)
          : 0;

      const metricas = {
        totalTurnos,
        tiempoPromedioEspera,
        tiempoPromedioAtencion,
        turnosCompletados,
        eficiencia,
      };

      // ---------------- Turnos por día ----------------
      const dias = eachDayOfInterval({
        start: startOfDay(dateFrom),
        end: startOfDay(dateTo),
      });

      const turnosPorDia = dias.map((d) => {
        const dayStart = startOfDay(d).getTime();
        const turnosDia = turnos.filter((t) => {
          const fecha = t.fecha_creacion
            ? startOfDay(new Date(t.fecha_creacion)).getTime()
            : NaN;
          return fecha === dayStart;
        });

        const total = turnosDia.length;
        const completadosDia = turnosDia.filter(
          (t) => t.estado === "atendido"
        ).length;

        return {
          fecha: d.toISOString(),
          turnos: total,
          completados: completadosDia,
        };
      });

      // ---------------- Distribución por categorías ----------------
      const categoriasMap: Record<
        string,
        { nombre: string; turnos: number; color: string }
      > = {};

      for (const t of turnos) {
        const cat = t.categoria;
        const key = cat?.id ? String(cat.id) : "sin_categoria";
        const nombre = cat?.nombre || "Sin categoría";
        const color = cat?.color || "#8884d8";

        if (!categoriasMap[key]) {
          categoriasMap[key] = { nombre, turnos: 0, color };
        }
        categoriasMap[key].turnos += 1;
      }

      const distribucionCategorias = Object.values(categoriasMap);

      // ---------------- Actividad por sucursal ----------------
      const sucursalesMap: Record<
        string,
        { sucursal: string; turnos: number; completados: number }
      > = {};

      for (const t of turnos) {
        const key = t.sucursal_id ? String(t.sucursal_id) : "sin_sucursal";
        const nombre = t.sucursal?.nombre || "Sin sucursal";

        if (!sucursalesMap[key]) {
          sucursalesMap[key] = { sucursal: nombre, turnos: 0, completados: 0 };
        }

        sucursalesMap[key].turnos += 1;
        if (t.estado === "atendido") {
          sucursalesMap[key].completados += 1;
        }
      }

      const actividadSucursales = Object.values(sucursalesMap).map((s) => ({
        ...s,
        eficiencia:
          s.turnos > 0
            ? Math.round((s.completados / s.turnos) * 100)
            : 0,
      }));

      // ---------------- Actividad por kiosko ----------------
      const kioskosMap: Record<string, { kiosko: string; turnos: number }> = {};

      for (const t of turnos) {
        const key = t.kiosko_id ? String(t.kiosko_id) : "sin_kiosko";
        const nombre = t.kiosko?.nombre || "Sin kiosko";

        if (!kioskosMap[key]) {
          kioskosMap[key] = { kiosko: nombre, turnos: 0 };
        }
        kioskosMap[key].turnos += 1;
      }

      const actividadKioskos = Object.values(kioskosMap);

      // ---------------- Tiempo de espera promedio por hora ----------------
      const tiemposPorHora: Record<string, number[]> = {};

      for (const t of turnos) {
        if (!t.fecha_creacion || t.tiempo_espera == null) continue;
        const d = new Date(t.fecha_creacion);
        const hora = format(d, "HH:00");
        if (!tiemposPorHora[hora]) {
          tiemposPorHora[hora] = [];
        }
        tiemposPorHora[hora].push(t.tiempo_espera);
      }

      const tiemposEsperaPorHora = Object.entries(tiemposPorHora)
        .sort(([h1], [h2]) => (h1 < h2 ? -1 : 1))
        .map(([hora, valores]) => ({
          hora,
          tiempo:
            valores.length > 0
              ? Math.round(
                  valores.reduce((acc, v) => acc + v, 0) / valores.length
                )
              : 0,
        }));

      return {
        metricas,
        turnosPorDia,
        distribucionCategorias,
        actividadSucursales,
        actividadKioskos,
        tiemposEsperaPorHora,
        turnosRaw: turnos,
      };
    },
  });
};
