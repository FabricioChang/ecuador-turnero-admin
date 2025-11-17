import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, TrendingUp, Clock, Users, BarChart3, AlertCircle } from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useReportes } from "@/hooks/useReportes";
import { useSucursales } from "@/hooks/useSucursales";
import { useKioskos } from "@/hooks/useKioskos";
import { useCategorias } from "@/hooks/useCategorias";

const Reportes = () => {
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [selectedKiosko, setSelectedKiosko] = useState<string>("all");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all");

  const { data: sucursalesData = [] } = useSucursales();
  const { data: kioskosData = [] } = useKioskos();
  const { data: categoriasData = [] } = useCategorias();
  
  const { data: reportData, isLoading } = useReportes(dateFrom, dateTo, selectedSucursal, selectedKiosko, selectedCategoria);

  const sucursales = sucursalesData.map((s: any) => ({ id: s.id, nombre: s.nombre }));
  const kioskos = kioskosData.map((k: any) => ({ id: k.id, identificador: k.identificador, nombre: k.nombre }));
  const categorias = categoriasData.map((c: any) => ({ id: c.id, nombre: c.nombre }));

  const metricas = reportData ? [
    {
      title: "Total Turnos",
      value: reportData.metricas.totalTurnos.toString(),
      change: "",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Tiempo Promedio Espera",
      value: `${reportData.metricas.tiempoPromedioEspera} min`,
      change: "",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Turnos Completados",
      value: reportData.metricas.turnosCompletados.toString(),
      change: "",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Eficiencia",
      value: `${reportData.metricas.eficiencia}%`,
      change: "",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ] : [];

  const chartConfig = {
    turnos: { label: "Turnos", color: "hsl(var(--primary))" },
    completados: { label: "Completados", color: "hsl(var(--secondary))" },
    tiempo: { label: "Tiempo (min)", color: "hsl(var(--accent))" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-admin-text-muted">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Reportes</h1>
          <p className="text-admin-text-secondary">Informes y estadísticas del sistema turnero</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateFrom} onSelect={(date) => date && setDateFrom(date)} locale={es} /></PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateTo} onSelect={(date) => date && setDateTo(date)} locale={es} /></PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sucursal</label>
              <Select value={selectedSucursal} onValueChange={setSelectedSucursal}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  {sucursales.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kiosko</label>
              <Select value={selectedKiosko} onValueChange={setSelectedKiosko}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los kioskos</SelectItem>
                  {kioskos.map((k: any) => <SelectItem key={k.id} value={k.id}>{k.identificador}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica, index) => {
          const Icon = metrica.icon;
          return (
            <Card key={index} className="bg-admin-surface border-admin-border-light">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-admin-text-muted">{metrica.title}</p>
                    <h3 className="text-2xl font-bold text-admin-text-primary mt-2">{metrica.value}</h3>
                  </div>
                  <div className={cn("p-3 rounded-lg bg-admin-bg", metrica.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turnos por Día */}
            <Card className="bg-admin-surface border-admin-border-light">
              <CardHeader>
                <CardTitle>Turnos por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.turnosPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" tickFormatter={(val) => format(new Date(val), "dd/MM")} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="turnos" fill="hsl(var(--primary))" name="Total" />
                      <Bar dataKey="completados" fill="hsl(var(--secondary))" name="Completados" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distribución por Categorías */}
            <Card className="bg-admin-surface border-admin-border-light">
              <CardHeader>
                <CardTitle>Distribución por Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={reportData.distribucionCategorias} dataKey="turnos" nameKey="nombre" cx="50%" cy="50%" outerRadius={100} label>
                        {reportData.distribucionCategorias.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tiempos de Espera */}
          {reportData.tiemposEsperaPorHora.length > 0 && (
            <Card className="bg-admin-surface border-admin-border-light">
              <CardHeader>
                <CardTitle>Tiempos de Espera Promedio por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.tiemposEsperaPorHora}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="tiempo" stroke="hsl(var(--accent))" strokeWidth={2} name="Tiempo (min)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Tablas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividad por Sucursales */}
            <Card className="bg-admin-surface border-admin-border-light">
              <CardHeader>
                <CardTitle>Actividad por Sucursales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.actividadSucursales.map((suc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-admin-bg">
                      <div>
                        <p className="font-medium text-admin-text-primary">{suc.sucursal}</p>
                        <p className="text-sm text-admin-text-muted">{suc.turnos} turnos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{suc.eficiencia}%</p>
                        <p className="text-xs text-admin-text-muted">Eficiencia</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actividad por Kioskos */}
            <Card className="bg-admin-surface border-admin-border-light">
              <CardHeader>
                <CardTitle>Actividad por Kioskos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.actividadKioskos.map((kiosko: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-admin-bg">
                      <div>
                        <p className="font-medium text-admin-text-primary">{kiosko.kiosko}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{kiosko.turnos}</p>
                        <p className="text-xs text-admin-text-muted">turnos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reportes;
