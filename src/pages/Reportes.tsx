import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, TrendingUp, Clock, Users, BarChart3 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
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
} from "recharts";

const Reportes = () => {
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 30));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [selectedKiosko, setSelectedKiosko] = useState<string>("all");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all");
  const [reportType, setReportType] = useState<string>("turnos");

  // Mock data
  const metricas = [
    {
      title: "Total Turnos",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Tiempo Promedio",
      value: "18 min",
      change: "-3.2%",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Turnos Completados",
      value: "2,456",
      change: "+8.1%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Eficiencia",
      value: "86.3%",
      change: "+2.1%",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  const turnosPorDia = [
    { fecha: "2024-01-01", turnos: 120, completados: 98 },
    { fecha: "2024-01-02", turnos: 145, completados: 132 },
    { fecha: "2024-01-03", turnos: 167, completados: 154 },
    { fecha: "2024-01-04", turnos: 189, completados: 171 },
    { fecha: "2024-01-05", turnos: 198, completados: 186 },
    { fecha: "2024-01-06", turnos: 176, completados: 165 },
    { fecha: "2024-01-07", turnos: 156, completados: 142 }
  ];

  const tiemposEspera = [
    { hora: "09:00", tiempo: 8 },
    { hora: "10:00", tiempo: 12 },
    { hora: "11:00", tiempo: 18 },
    { hora: "12:00", tiempo: 25 },
    { hora: "13:00", tiempo: 22 },
    { hora: "14:00", tiempo: 15 },
    { hora: "15:00", tiempo: 20 },
    { hora: "16:00", tiempo: 28 },
    { hora: "17:00", tiempo: 32 },
    { hora: "18:00", tiempo: 19 }
  ];

  const distribucionCategorias = [
    { categoria: "Atención General", turnos: 856, color: "#3b82f6" },
    { categoria: "Servicios Bancarios", turnos: 674, color: "#10b981" },
    { categoria: "Consultas", turnos: 523, color: "#f59e0b" },
    { categoria: "Trámites", turnos: 445, color: "#ef4444" },
    { categoria: "Urgencias", turnos: 349, color: "#8b5cf6" }
  ];

  const actividadSucursales = [
    { sucursal: "Centro", turnos: 1234, eficiencia: 89 },
    { sucursal: "Norte", turnos: 987, eficiencia: 92 },
    { sucursal: "Sur", turnos: 756, eficiencia: 85 },
    { sucursal: "Este", turnos: 654, eficiencia: 88 },
    { sucursal: "Oeste", turnos: 432, eficiencia: 83 }
  ];

  const actividadKioskos = [
    { kiosko: "K-001", turnos: 234, estado: "Activo" },
    { kiosko: "K-002", turnos: 198, estado: "Activo" },
    { kiosko: "K-003", turnos: 176, estado: "Mantenimiento" },
    { kiosko: "K-004", turnos: 156, estado: "Activo" },
    { kiosko: "K-005", turnos: 134, estado: "Activo" }
  ];

  const chartConfig = {
    turnos: {
      label: "Turnos",
      color: "hsl(var(--primary))",
    },
    completados: {
      label: "Completados",
      color: "hsl(var(--secondary))",
    },
    tiempo: {
      label: "Tiempo (min)",
      color: "hsl(var(--accent))",
    },
  };

  const handleExportReport = () => {
    // Mock export functionality
    console.log(`Exportando reporte: ${reportType}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-admin-text-primary">Reportes</h1>
        <p className="text-admin-text-secondary">Informes y estadísticas del sistema turnero</p>
      </div>

      {/* Filtros */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Fecha Desde */}
            <div className="space-y-2">
              <Label className="text-admin-text-secondary">Fecha Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => date && setDateFrom(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Fecha Hasta */}
            <div className="space-y-2">
              <Label className="text-admin-text-secondary">Fecha Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => date && setDateTo(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Sucursal */}
            <div className="space-y-2">
              <Label className="text-admin-text-secondary">Sucursal</Label>
              <Select value={selectedSucursal} onValueChange={setSelectedSucursal}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las sucursales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="norte">Norte</SelectItem>
                  <SelectItem value="sur">Sur</SelectItem>
                  <SelectItem value="este">Este</SelectItem>
                  <SelectItem value="oeste">Oeste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Kiosko */}
            <div className="space-y-2">
              <Label className="text-admin-text-secondary">Kiosko</Label>
              <Select value={selectedKiosko} onValueChange={setSelectedKiosko}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los kioskos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los kioskos</SelectItem>
                  <SelectItem value="k001">K-001</SelectItem>
                  <SelectItem value="k002">K-002</SelectItem>
                  <SelectItem value="k003">K-003</SelectItem>
                  <SelectItem value="k004">K-004</SelectItem>
                  <SelectItem value="k005">K-005</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-admin-text-secondary">Categoría</Label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="general">Atención General</SelectItem>
                  <SelectItem value="bancarios">Servicios Bancarios</SelectItem>
                  <SelectItem value="consultas">Consultas</SelectItem>
                  <SelectItem value="tramites">Trámites</SelectItem>
                  <SelectItem value="urgencias">Urgencias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <Card key={index} className="bg-admin-surface border-admin-border-light">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-admin-text-secondary">
                {metrica.title}
              </CardTitle>
              <metrica.icon className={`h-4 w-4 ${metrica.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-admin-text-primary">{metrica.value}</div>
              <p className={`text-xs ${metrica.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metrica.change} desde el mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnos por Día */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Turnos por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fecha" 
                    tickFormatter={(value) => format(new Date(value), "dd/MM")}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="turnos" fill="var(--color-turnos)" />
                  <Bar dataKey="completados" fill="var(--color-completados)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tiempos de Espera */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Tiempos de Espera por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tiemposEspera}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="tiempo" 
                    stroke="var(--color-tiempo)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribución por Categorías */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Distribución por Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionCategorias}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="turnos"
                  >
                    {distribucionCategorias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Actividad por Sucursal */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Actividad por Sucursal</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actividadSucursales} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="sucursal" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="turnos" fill="var(--color-turnos)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actividad por Kiosko */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">Actividad por Kiosko</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-border-light">
                  <th className="text-left py-2 text-admin-text-secondary">Kiosko</th>
                  <th className="text-left py-2 text-admin-text-secondary">Turnos</th>
                  <th className="text-left py-2 text-admin-text-secondary">Estado</th>
                  <th className="text-right py-2 text-admin-text-secondary">Participación</th>
                </tr>
              </thead>
              <tbody>
                {actividadKioskos.map((kiosko, index) => (
                  <tr key={index} className="border-b border-admin-border-light last:border-0">
                    <td className="py-3 text-admin-text-primary font-medium">{kiosko.kiosko}</td>
                    <td className="py-3 text-admin-text-primary">{kiosko.turnos}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        kiosko.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {kiosko.estado}
                      </span>
                    </td>
                    <td className="py-3 text-right text-admin-text-primary">
                      {((kiosko.turnos / 1200) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Exportar Reportes */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">Exportar Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-admin-text-secondary">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="turnos">Reporte de Turnos</SelectItem>
                  <SelectItem value="tiempos">Reporte de Tiempos de Espera</SelectItem>
                  <SelectItem value="categorias">Reporte por Categorías</SelectItem>
                  <SelectItem value="sucursales">Reporte por Sucursales</SelectItem>
                  <SelectItem value="kioskos">Reporte por Kioskos</SelectItem>
                  <SelectItem value="completo">Reporte Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleExportReport}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Descargar Excel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reportes;