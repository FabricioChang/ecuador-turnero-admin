import { format } from "date-fns";
import { es } from "date-fns/locale";

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportReportToCSV = (
  reportData: any,
  dateFrom: Date,
  dateTo: Date
) => {
  const filename = `reporte_${format(dateFrom, "dd-MM-yyyy")}_${format(
    dateTo,
    "dd-MM-yyyy"
  )}`;

  // Exportar resumen de métricas
  const metricsData = [
    {
      metrica: "Total Turnos",
      valor: reportData.metricas.totalTurnos,
    },
    {
      metrica: "Turnos Completados",
      valor: reportData.metricas.turnosCompletados,
    },
    {
      metrica: "Turnos En Atención",
      valor: reportData.metricas.turnosEnAtencion,
    },
    {
      metrica: "Turnos Pendientes",
      valor: reportData.metricas.turnosPendientes,
    },
    {
      metrica: "Turnos Cancelados",
      valor: reportData.metricas.turnosCancelados,
    },
    {
      metrica: "Tiempo Promedio Espera (min)",
      valor: reportData.metricas.tiempoPromedioEspera,
    },
    {
      metrica: "Tiempo Promedio Atención (min)",
      valor: reportData.metricas.tiempoPromedioAtencion,
    },
    {
      metrica: "Eficiencia (%)",
      valor: reportData.metricas.eficiencia,
    },
  ];

  exportToCSV(metricsData, `${filename}_metricas`);

  // Exportar datos detallados de turnos
  const turnosDetallados = reportData.turnosRaw.map((turno: any) => ({
    Numero: turno.numero,
    Categoria: turno.categoria?.nombre || "N/A",
    Sucursal: turno.sucursal?.nombre || "N/A",
    Kiosko: turno.kiosko?.identificador || "N/A",
    Cliente: turno.cliente_nombre || "N/A",
    Identificacion: turno.cliente_identificacion || "N/A",
    Estado: turno.estado,
    "Fecha Creación": format(
      new Date(turno.fecha_creacion),
      "dd/MM/yyyy HH:mm",
      { locale: es }
    ),
    "Tiempo Espera (min)": turno.tiempo_espera || 0,
    "Tiempo Atención (min)": turno.tiempo_atencion || 0,
  }));

  exportToCSV(turnosDetallados, `${filename}_detalle`);
};
