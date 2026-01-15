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

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // Use a more reliable download approach
  const url = URL.createObjectURL(blob);
  
  // Create and configure link
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  
  // Trigger download without adding to DOM (prevents dialog issues)
  link.click();
  
  // Clean up after a delay
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

/**
 * Exporta el DETALLE de turnos a CSV.
 * Recibe directamente el arreglo de turnos crudos (turnosRaw)
 * como lo devuelve useReportes.
 */
export const exportTurnosDetalle = (turnosRaw: any[], filenameBase: string) => {
  if (!turnosRaw || turnosRaw.length === 0) return;

  const turnosDetallados = turnosRaw.map((turno: any) => {
    // Get client name from joined data or fallback fields
    const clienteNombre = turno.cliente
      ? `${turno.cliente.nombres || ""} ${turno.cliente.apellidos || ""}`.trim()
      : turno.cliente_nombre || "";
    
    const clienteIdentificacion = turno.cliente?.cedula || turno.cliente_identificacion || "";

    // Get related entity names
    const categoriaNombre = turno.categoria?.nombre || "";
    const sucursalNombre = turno.sucursal?.nombre || "";
    const kioskoNombre = turno.kiosko?.codigo || "";

    // Format dates - use emitido_en as the main creation date
    const fechaEmision = turno.emitido_en
      ? format(new Date(turno.emitido_en), "dd/MM/yyyy HH:mm", { locale: es })
      : "";
    const fechaLlamado = turno.llamado_en
      ? format(new Date(turno.llamado_en), "dd/MM/yyyy HH:mm", { locale: es })
      : "";
    const fechaAtencion = turno.atendido_en
      ? format(new Date(turno.atendido_en), "dd/MM/yyyy HH:mm", { locale: es })
      : "";
    const fechaFinalizacion = turno.finalizado_en
      ? format(new Date(turno.finalizado_en), "dd/MM/yyyy HH:mm", { locale: es })
      : "";

    // Calculate times in minutes
    const tiempoEsperaMin = turno.tiempo_espera 
      ? Math.round(turno.tiempo_espera / 60) 
      : 0;
    
    // Calculate tiempo de atención from llamado_en to atendido_en
    let tiempoAtencionMin = 0;
    if (turno.llamado_en && turno.atendido_en) {
      const llamado = new Date(turno.llamado_en).getTime();
      const atendido = new Date(turno.atendido_en).getTime();
      const diffSeconds = (atendido - llamado) / 1000;
      if (diffSeconds > 0 && !isNaN(diffSeconds)) {
        tiempoAtencionMin = Math.round(diffSeconds / 60);
      }
    }

    return {
      Numero: turno.numero || turno.codigo || "",
      Categoria: categoriaNombre,
      Sucursal: sucursalNombre,
      Kiosko: kioskoNombre,
      Cliente: clienteNombre,
      Identificacion: clienteIdentificacion,
      Estado: turno.estado || "",
      "Fecha Emisión": fechaEmision,
      "Fecha Llamado": fechaLlamado,
      "Fecha Atención": fechaAtencion,
      "Fecha Finalización": fechaFinalizacion,
      "Tiempo Espera (min)": tiempoEsperaMin,
      "Tiempo Atención (min)": tiempoAtencionMin,
    };
  });

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
