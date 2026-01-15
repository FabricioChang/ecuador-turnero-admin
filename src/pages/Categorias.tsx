import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Tag, Clock, Users, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategorias } from "@/hooks/useCategorias";
import { useSucursales } from "@/hooks/useSucursales";

const Categorias = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const { data: categoriasDB = [], isLoading } = useCategorias();
  const { data: sucursales = [] } = useSucursales();

  const categorias = categoriasDB.map((cat: any) => ({
    id: cat.id,
    nombre: cat.nombre,
    descripcion: cat.descripcion || "Sin descripción",
    tiempoEsperaEstimado: cat.tiempo_estimado ?? 0,
    estado: cat.estado,
    color: cat.color,
    sucursal: cat.sucursal?.nombre || "General",
    sucursal_id: cat.sucursal_id
  }));

  const filteredCategorias = useMemo(() => {
    return categorias.filter(categoria => {
      const matchesSearch = categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSucursal = !sucursalFilter || categoria.sucursal_id === sucursalFilter;
      const matchesEstado = !estadoFilter || categoria.estado === estadoFilter;
      return matchesSearch && matchesSucursal && matchesEstado;
    });
  }, [categorias, searchTerm, sucursalFilter, estadoFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setSucursalFilter("");
    setEstadoFilter("");
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800";
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800";
      case "inactivo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "activo":
        return "Activo";
      case "mantenimiento":
        return "Mantenimiento";
      case "inactivo":
        return "Inactivo";
      default:
        return estado;
    }
  };

  const handleVerDetalles = (id: number) => {
    navigate(`/categorias/${id}/detalles`);
  };

  const handleConfigurar = (id: number) => {
    navigate(`/categorias/${id}/configurar`);
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-yellow-100 text-yellow-800";
      case "Baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Categorías</h1>
          <p className="text-admin-text-secondary">Gestión de categorías de atención y turnos</p>
        </div>
        <Button 
          onClick={() => navigate('/categorias/nueva')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-admin-text-primary">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-admin-text-muted" />
            <Input
              placeholder="Buscar por nombre de categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-admin-text-primary">Sucursal</Label>
              <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las sucursales" />
                </SelectTrigger>
                <SelectContent>
                  {sucursales.map((sucursal) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-admin-text-primary">Estado</Label>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-admin-text-secondary">
          Mostrando {filteredCategorias.length} de {categorias.length} categorías
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategorias.map((categoria) => (
          <Card key={categoria.id} className="bg-admin-surface border-admin-border-light h-auto overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="text-admin-text-primary truncate leading-relaxed pb-1">{categoria.nombre}</span>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getEstadoColor(categoria.estado)}`}>
                  {getEstadoLabel(categoria.estado)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 min-w-0">
                <Clock className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text-primary">{categoria.tiempoEsperaEstimado} minutos</p>
                  <p className="text-xs text-admin-text-muted">Tiempo estimado</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 min-w-0">
                  <Tag className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-admin-text-primary truncate">{categoria.sucursal}</p>
                    <p className="text-xs text-admin-text-muted">Sucursal</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 min-w-0">
                  <Users className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-admin-text-primary truncate leading-relaxed pb-1" title={categoria.descripcion}>{categoria.descripcion}</p>
                    <p className="text-xs text-admin-text-muted">Descripción</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleVerDetalles(categoria.id)}
                >
                  Ver Detalles
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleConfigurar(categoria.id)}
                >
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategorias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-admin-text-muted">No se encontraron categorías que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default Categorias;