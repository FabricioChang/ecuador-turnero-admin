import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Download,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useReportes } from "@/hooks/useReportes";
import { useSucursales } from "@/hooks/useSucursales";
import { useKioskos } from "@/hooks/useKioskos";
import { useCategorias } from "@/hooks/useCategorias";
import { useToast } from "@/hooks/use-toast";
import {
  exportToCSV,
  exportTurnosDetalle,
} from "@/utils/exportReportes";

const Reportes = () => {
  const { toast } = useToast();

  const pieColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ];


  // Filtros de fechas
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = useState<Date>(new Date());

  // Filtros de entidades
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [selectedKiosko, setSelectedKiosko] = useState<string>("all");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all");

  // Catálogos
  const { data: sucursalesData = [] } = useSucursales();
  const { data: kioskosData = [] } = useKioskos();
  const { data: categoriasData = [] } = useCategorias();

  // Datos de reportes
  const { data: reportData, isLoading } = useReportes(
    dateFrom,
    dateTo,
    selectedSucursal,
    selectedKiosko,
    selectedCategoria
  );

const handleExport = () => {
  if (!reportData || !reportData.turnosRaw?.length) {
    toast({
      title: "No hay datos",
      description:
        "No hay turnos para exportar en el rango de fechas y filtros seleccionados.",
    });
    return;
  }

  const filenameBase = `reporte_turnos_${format(dateFrom, "yyyy-MM-dd")}_${format(
    dateTo,
    "yyyy-MM-dd"
  )}`;

  const resumen = reportData.turnosPorDia.map((d) => ({
    Fecha: format(new Date(d.fecha), "dd/MM/yyyy"),
    "Turnos totales": d.turnos,
    "Turnos completados": d.completados,
  }));

  // resumen agregado
  exportToCSV(resumen, filenameBase);
  // detalle de cada turno
  exportTurnosDetalle(reportData.turnosRaw, filenameBase);

  toast({
    title: "Exportación completada",
    description: "Los reportes fueron exportados en formato CSV.",
  });
};

  const metricas = reportData?.metricas;
  const turnosPorDia = reportData?.turnosPorDia ?? [];
  const distribucionCategorias = reportData?.distribucionCategorias ?? [];
  const actividadSucursales = reportData?.actividadSucursales ?? [];
  const actividadKioskos = reportData?.actividadKioskos ?? [];
  const tiemposEsperaPorHora = reportData?.tiemposEsperaPorHora ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary">
            Reportes y métricas
          </h1>
          <p className="text-admin-text-muted">
            Analiza el comportamiento de los turnos por sucursal, kiosko y
            categoría.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFrom(subDays(new Date(), 7));
              setDateTo(new Date());
            }}
          >
            Últimos 7 días
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFrom(subDays(new Date(), 30));
              setDateTo(new Date());
            }}
          >
            Últimos 30 días
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              setDateFrom(today);
              setDateTo(today);
            }}
          >
            Hoy
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {/* Fecha desde */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-admin-text-primary">
              Desde
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  {dateFrom ? (
                    format(dateFrom, "dd 'de' MMMM 'de' yyyy", { locale: es })
                  ) : (
                    <span>Selecciona fecha</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => date && setDateFrom(date)}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Fecha hasta */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-admin-text-primary">
              Hasta
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  {dateTo ? (
                    format(dateTo, "dd 'de' MMMM 'de' yyyy", { locale: es })
                  ) : (
                    <span>Selecciona fecha</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => date && setDateTo(date)}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sucursal */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-admin-text-primary">
              Sucursal
            </span>
            <Select
              value={selectedSucursal}
              onValueChange={setSelectedSucursal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las sucursales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {sucursalesData.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kiosko */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-admin-text-primary">
              Kiosko
            </span>
            <Select
              value={selectedKiosko}
              onValueChange={setSelectedKiosko}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los kioskos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {kioskosData.map((k: any) => (
                  <SelectItem key={k.id} value={String(k.id)}>
                    {k.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categoría */}
          <div className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-admin-text-primary">
              Categoría
            </span>
            <Select
              value={selectedCategoria}
              onValueChange={setSelectedCategoria}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categoriasData.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón exportar */}
          <div className="flex items-end md:justify-end md:col-span-2">
            <Button onClick={handleExport} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <span className="text-admin-text-muted">
            Cargando datos de reportes...
          </span>
        </div>
      )}

      {!isLoading && !metricas && (
        <div className="flex items-center justify-center py-12 text-admin-text-muted">
          <AlertCircle className="mr-2 h-4 w-4" />
          No se encontraron datos para el rango de fechas seleccionado.
        </div>
      )}

      {!isLoading && metricas && (
        <>
          {/* Métricas principales */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Turnos generados
                </CardTitle>
                <Users className="h-4 w-4 text-admin-text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricas.totalTurnos}
                </div>
                <p className="text-xs text-admin-text-muted">
                  Total de turnos en el periodo seleccionado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tiempo promedio de espera
                </CardTitle>
                <Clock className="h-4 w-4 text-admin-text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricas.tiempoPromedioEspera} min
                </div>
                <p className="text-xs text-admin-text-muted">
                  Desde la toma del turno hasta el llamado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tiempo promedio de atención
                </CardTitle>
                <Clock className="h-4 w-4 text-admin-text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricas.tiempoPromedioAtencion} min
                </div>
                <p className="text-xs text-admin-text-muted">
                  Desde el inicio hasta el fin de la atención
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Eficiencia de atención
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-admin-text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricas.eficiencia}%
                </div>
                <p className="text-xs text-admin-text-muted">
                  {metricas.turnosCompletados} turnos completados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos principales */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Turnos por día */}
            <Card>
              <CardHeader>
                <CardTitle>Turnos por día</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    turnos: {
                      label: "Turnos",
                      color: "hsl(var(--chart-1))",
                    },
                    completados: {
                      label: "Completados",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-72"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={turnosPorDia}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="fecha"
                        tickFormatter={(value: string) =>
                          format(new Date(value), "dd/MM", { locale: es })
                        }
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="turnos" name="Turnos" fill="var(--color-turnos)" />
                      <Bar dataKey="completados" name="Completados" fill="var(--color-completados)"/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distribución por categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por categorías</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4 md:flex-row">
                <ChartContainer
                  config={{
                    turnos: {
                      label: "Turnos",
                    },
                  }}
                  className="h-72 w-full md:w-1/2"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={distribucionCategorias}
                        dataKey="turnos"
                        nameKey="nombre"
                        outerRadius={100}
                        label
                      >
                        {distribucionCategorias.map((c, index) => (
                          <Cell key={index} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="w-full md:w-1/2 space-y-2">
                  {distribucionCategorias.map((c, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-admin-text-primary">
                        {c.nombre}
                      </span>
                      <span className="font-medium">
                        {c.turnos} turno{c.turnos !== 1 && "s"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actividad por sucursal / kiosko */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Actividad por sucursal</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    turnos: { label: "Turnos" },
                    eficiencia: { label: "Eficiencia %" },
                  }}
                  className="h-72"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={actividadSucursales}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="sucursal" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="turnos" name="Turnos" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad por kiosko</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    turnos: { label: "Turnos" },
                  }}
                  className="h-72"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={actividadKioskos}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="kiosko" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="turnos" name="Turnos" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tiempo de espera por hora */}
          <Card>
            <CardHeader>
              <CardTitle>Tiempo promedio de espera por hora</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  tiempo: { label: "Tiempo de espera (min)" },
                }}
                className="h-72"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tiemposEsperaPorHora}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tiempo"
                      name="Espera promedio (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reportes;
