import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTurnos } from "@/hooks/useTurnos";
import { useRegiones } from "@/hooks/useRegiones";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useSucursales } from "@/hooks/useSucursales";
import { useCategorias } from "@/hooks/useCategorias";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Search, 
  Filter, 
  RefreshCw,
  Eye
} from "lucide-react";

const Turnos = () => {
  const { data: turnosDB = [], isLoading } = useTurnos();
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: sucursales = [] } = useSucursales();
  const { data: categorias = [] } = useCategorias();
  
  const [busqueda, setBusqueda] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [provinciaFilter, setProvinciaFilter] = useState("all");
  const [ciudadFilter, setCiudadFilter] = useState("all");
  const [sucursalFilter, setSucursalFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<any | null>(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const { toast } = useToast();

  // Filtrar provincias por región
  const provinciasFiltradas = useMemo(() => {
    if (regionFilter === "all") return provincias;
    const regionData = regiones.find(r => r.id === regionFilter);
    if (!regionData) return provincias;
    return provincias.filter((p: any) => regionData.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  // Filtrar ciudades por provincia
  const ciudadesFiltradas = useMemo(() => {
    if (provinciaFilter === "all") return cantones;
    return cantones.filter((c: any) => c.provincia === provinciaFilter);
  }, [provinciaFilter, cantones]);

  // Filtrar sucursales jerárquicamente
  const sucursalesFiltradas = useMemo(() => {
    let filtered = [...sucursales];
    
    if (regionFilter !== "all") {
      const regionData = regiones.find(r => r.id === regionFilter);
      if (regionData) {
        filtered = filtered.filter((s: any) => regionData.provincias.includes(s.provincia));
      }
    }
    
    if (provinciaFilter !== "all") {
      filtered = filtered.filter((s: any) => s.provincia === provinciaFilter);
    }
    
    if (ciudadFilter !== "all") {
      filtered = filtered.filter((s: any) => s.ciudad === ciudadFilter);
    }
    
    return filtered;
  }, [sucursales, regionFilter, provinciaFilter, ciudadFilter, regiones]);

  // Handlers para resetear filtros hijos
  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("all");
    setCiudadFilter("all");
    setSucursalFilter("all");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("all");
    setSucursalFilter("all");
  };

  const handleCiudadChange = (value: string) => {
    setCiudadFilter(value);
    setSucursalFilter("all");
  };

  const turnos = turnosDB.map((t: any) => ({
    id: t.id,
    numero: t.numero,
    cliente: {
      nombre: t.cliente_nombre || "Sin nombre",
      documento: t.cliente_identificacion || "",
    },
    sucursal: t.sucursal?.nombre || "",
    sucursal_id: t.sucursal_id,
    kiosko: t.kiosko?.nombre || "Sin kiosko",
    categoria: t.categoria?.nombre || "",
    categoria_id: t.categoria_id,
    estado: t.estado,
    fechaCreacion: new Date(t.emitido_en || t.fecha_creacion).toLocaleDateString(),
    horaCreacion: new Date(t.emitido_en || t.fecha_creacion).toLocaleTimeString(),
    tiempoEspera: t.tiempo_espera_seg ? Math.round(t.tiempo_espera_seg / 60) : 0
  }));

  // Calcular KPIs
  const kpis = {
    enEspera: turnos.filter(t => t.estado === 'pendiente' || t.estado === 'en_atencion' || t.estado === 'espera').length,
    atendidos: turnos.filter(t => t.estado === 'atendido').length,
    perdidos: turnos.filter(t => t.estado === 'cancelado' || t.estado === 'perdido').length,
    reagendados: turnos.filter(t => t.estado === 'reagendado').length
  };

  // Filtrar turnos
  const turnosFiltrados = turnos.filter(turno => {
    // Búsqueda por identificador
    if (busqueda && !turno.numero.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }
    
    // Filtro por sucursal
    if (sucursalFilter !== "all" && turno.sucursal_id !== sucursalFilter) {
      return false;
    }
    
    // Filtros jerárquicos si no hay sucursal específica
    if (sucursalFilter === "all" && sucursalesFiltradas.length > 0) {
      const sucursalIds = sucursalesFiltradas.map((s: any) => s.id);
      if (!sucursalIds.includes(turno.sucursal_id)) {
        return false;
      }
    }
    
    // Filtro por estado
    if (estadoFilter !== "all" && turno.estado !== estadoFilter) {
      return false;
    }
    
    // Filtro por categoría
    if (categoriaFilter !== "all" && turno.categoria_id !== categoriaFilter) {
      return false;
    }
    
    return true;
  });

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600", label: "Pendiente" },
      en_atencion: { variant: "default" as const, icon: RefreshCw, color: "text-blue-600", label: "En Atención" },
      atendido: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", label: "Atendido" },
      cancelado: { variant: "destructive" as const, icon: XCircle, color: "text-red-600", label: "Cancelado" },
      espera: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600", label: "En Espera" },
      perdido: { variant: "destructive" as const, icon: XCircle, color: "text-red-600", label: "Perdido" },
      reagendado: { variant: "outline" as const, icon: Calendar, color: "text-blue-600", label: "Reagendado" }
    };
    
    const config = variants[estado as keyof typeof variants] || {
      variant: "outline" as const,
      icon: Clock,
      color: "text-gray-600",
      label: estado
    };
    
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setRegionFilter("all");
    setProvinciaFilter("all");
    setCiudadFilter("all");
    setSucursalFilter("all");
    setEstadoFilter("all");
    setCategoriaFilter("all");
    setFechaDesde("");
    setFechaHasta("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Gestión de Turnos</h1>
          <p className="text-admin-text-secondary">Administra y monitorea los turnos en tiempo real</p>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text-secondary">En Espera</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text-primary">{kpis.enEspera}</div>
            <p className="text-xs text-admin-text-muted">Turnos pendientes</p>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text-secondary">Atendidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text-primary">{kpis.atendidos}</div>
            <p className="text-xs text-admin-text-muted">Turnos completados</p>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text-secondary">Perdidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text-primary">{kpis.perdidos}</div>
            <p className="text-xs text-admin-text-muted">No se presentaron</p>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text-secondary">Reagendados</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text-primary">{kpis.reagendados}</div>
            <p className="text-xs text-admin-text-muted">Reprogramados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-admin-text-muted" />
              <Input
                placeholder="Buscar por identificador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={regionFilter} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regiones.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={provinciaFilter} 
              onValueChange={handleProvinciaChange}
              disabled={regionFilter === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provinciasFiltradas.map((p: any) => (
                  <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={ciudadFilter} 
              onValueChange={handleCiudadChange}
              disabled={provinciaFilter === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {ciudadesFiltradas.map((c: any) => (
                  <SelectItem key={c.id} value={c.nombre}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {sucursalesFiltradas.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_atencion">En Atención</SelectItem>
                <SelectItem value="atendido">Atendido</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categorias.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Turnos */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">
            Lista de Turnos ({turnosFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Turno</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Tiempo Espera</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Cargando turnos...
                    </TableCell>
                  </TableRow>
                ) : turnosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No se encontraron turnos con los filtros seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  turnosFiltrados.map((turno) => (
                    <TableRow key={turno.id}>
                      <TableCell className="font-medium">{turno.numero}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{turno.cliente.nombre}</p>
                          <p className="text-sm text-admin-text-muted">{turno.cliente.documento}</p>
                        </div>
                      </TableCell>
                      <TableCell>{turno.sucursal}</TableCell>
                      <TableCell>{turno.categoria}</TableCell>
                      <TableCell>{getEstadoBadge(turno.estado)}</TableCell>
                      <TableCell>
                        <div>
                          <p>{turno.fechaCreacion}</p>
                          <p className="text-sm text-admin-text-muted">{turno.horaCreacion}</p>
                        </div>
                      </TableCell>
                      <TableCell>{turno.tiempoEspera} min</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setTurnoSeleccionado(turno);
                            setModalDetalle(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Dialog open={modalDetalle} onOpenChange={setModalDetalle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Turno</DialogTitle>
            <DialogDescription>
              Información completa del turno {turnoSeleccionado?.numero}
            </DialogDescription>
          </DialogHeader>
          {turnoSeleccionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-admin-text-muted">Número</Label>
                  <p className="font-medium">{turnoSeleccionado.numero}</p>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Estado</Label>
                  <div className="mt-1">{getEstadoBadge(turnoSeleccionado.estado)}</div>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Cliente</Label>
                  <p className="font-medium">{turnoSeleccionado.cliente.nombre}</p>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Documento</Label>
                  <p className="font-medium">{turnoSeleccionado.cliente.documento}</p>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Sucursal</Label>
                  <p className="font-medium">{turnoSeleccionado.sucursal}</p>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Categoría</Label>
                  <p className="font-medium">{turnoSeleccionado.categoria}</p>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Fecha/Hora</Label>
                  <p className="font-medium">{turnoSeleccionado.fechaCreacion} {turnoSeleccionado.horaCreacion}</p>
                </div>
                <div>
                  <Label className="text-sm text-admin-text-muted">Tiempo de Espera</Label>
                  <p className="font-medium">{turnoSeleccionado.tiempoEspera} min</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Turnos;
