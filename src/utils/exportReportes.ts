import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Exporta un arreglo de objetos a CSV.
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];

          // Proteger comas en strings
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value ?? "";
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta el DETALLE de turnos a CSV.
 * Recibe directamente el arreglo de turnos crudos (turnosRaw)
 * como lo devuelve useReportes.
 */
export const exportTurnosDetalle = (turnosRaw: any[], filenameBase: string) => {
  if (!turnosRaw || turnosRaw.length === 0) return;

  const turnosDetallados = turnosRaw.map((turno: any) => ({
    Numero: turno.numero,
    Categoria: turno.categoria?.nombre || "N/A",
    Sucursal: turno.sucursal?.nombre || "N/A",
    // En la nueva BD el kiosko solo tiene id y nombre
    Kiosko: turno.kiosko?.nombre || "N/A",
    Cliente: turno.cliente_nombre || "N/A",
    Identificacion: turno.cliente_identificacion || "N/A",
    Estado: turno.estado,
    "Fecha Creación": turno.fecha_creacion
      ? format(new Date(turno.fecha_creacion), "dd/MM/yyyy HH:mm", {
          locale: es,
        })
      : "",
    "Fecha Llamado": turno.fecha_llamado
      ? format(new Date(turno.fecha_llamado), "dd/MM/yyyy HH:mm", {
          locale: es,
        })
      : "",
    "Fecha Atención": turno.fecha_atencion
      ? format(new Date(turno.fecha_atencion), "dd/MM/yyyy HH:mm", {
          locale: es,
        })
      : "",
    "Fecha Finalización": turno.fecha_finalizacion
      ? format(new Date(turno.fecha_finalizacion), "dd/MM/yyyy HH:mm", {
          locale: es,
        })
      : "",
    "Tiempo Espera (min)": turno.tiempo_espera ?? 0,
    "Tiempo Atención (min)": turno.tiempo_atencion ?? 0,
  }));

  exportToCSV(turnosDetallados, `${filenameBase}_detalle`);
};

/**
 * Versión antigua que recibía todo el reportData y las fechas
 * y exportaba métricas + detalle. La dejo por compatibilidad;
 * si ya no la usas, la puedes borrar.
 */
export const exportReportToCSV = (
  reportData: any,
  dateFrom: Date,
  dateTo: Date
) => {
  if (!reportData) return;

  const filename = `reporte_${format(dateFrom, "dd-MM-yyyy")}_${format(
    dateTo,
    "dd-MM-yyyy"
  )}`;

  // Resumen de métricas si existen
  if (reportData.metricas) {
    const m = reportData.metricas;
    const metricsData = [
      { Metrica: "Total Turnos", Valor: m.totalTurnos },
      { Metrica: "Turnos Completados", Valor: m.turnosCompletados },
      { Metrica: "Tiempo Promedio Espera (min)", Valor: m.tiempoPromedioEspera },
      {
        Metrica: "Tiempo Promedio Atención (min)",
        Valor: m.tiempoPromedioAtencion,
      },
      { Metrica: "Eficiencia (%)", Valor: m.eficiencia },
    ];

    exportToCSV(metricsData, `${filename}_metricas`);
  }

  // Detalle de turnos usando la nueva función
  if (reportData.turnosRaw && reportData.turnosRaw.length > 0) {
    exportTurnosDetalle(reportData.turnosRaw, filename);
  }
};
