import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Users, Monitor, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegiones } from "@/hooks/useRegiones";
import { useProvinciasDB } from "@/hooks/useProvinciasDB";
import { useCantonesDB } from "@/hooks/useCantonesDB";
import { useSucursales } from "@/hooks/useSucursales";

const Sucursales = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [provinciaFilter, setProvinciaFilter] = useState("all");
  const [ciudadFilter, setCiudadFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");

  // Cargar datos desde la base de datos
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvinciasDB();
  const { data: sucursalesDB = [], isLoading: loadingSucursales } = useSucursales();

  // Obtener el ID de provincia seleccionada
  const provinciaSeleccionada = useMemo(() => {
    return provincias.find((p: any) => p.nombre === provinciaFilter);
  }, [provinciaFilter, provincias]);

  // Cargar cantones filtrados por provincia
  const { data: cantones = [] } = useCantonesDB(provinciaSeleccionada?.id);

  // Filtrar provincias por región seleccionada
  const provinciasFiltradas = useMemo(() => {
    if (regionFilter === "all") return provincias;
    const regionSeleccionada = regiones.find(r => r.id === regionFilter);
    return provincias.filter((p: any) => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  // Datos desde la base de datos
  const sucursales = sucursalesDB.map((suc: any) => ({
    id: suc.id,
    identificador: suc.identificador,
    nombre: suc.nombre,
    direccion: suc.direccion || "Sin dirección",
    estado: suc.estado,
    provincia: suc.provincia || "",
    ciudad: suc.ciudad || "",
  }));

  // Handlers para resetear filtros hijos
  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("all");
    setCiudadFilter("all");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("all");
  };

  const filteredSucursales = sucursales.filter(sucursal => {
    const matchesSearch = sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por región
    let matchesRegion = true;
    if (regionFilter !== "all") {
      const regionData = regiones.find(r => r.id === regionFilter);
      if (regionData) {
        matchesRegion = regionData.provincias.includes(sucursal.provincia);
      }
    }
    
    const matchesProvincia = provinciaFilter === "all" || sucursal.provincia === provinciaFilter;
    const matchesCiudad = ciudadFilter === "all" || sucursal.ciudad === ciudadFilter;
    const matchesEstado = estadoFilter === "all" || sucursal.estado === estadoFilter;

    return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad && matchesEstado;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setRegionFilter("all");
    setProvinciaFilter("all");
    setCiudadFilter("all");
    setEstadoFilter("all");
  };

  const handleVerDetalles = (id: string) => {
    navigate(`/sucursales/${id}/detalles`);
  };

  const handleConfigurar = (id: string) => {
    navigate(`/sucursales/${id}/configurar`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Sucursales</h1>
          <p className="text-admin-text-secondary">Gestión de ubicaciones y puntos de atención</p>
        </div>
        <Button 
          onClick={() => navigate('/sucursales/nueva')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sucursal
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
              placeholder="Buscar por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label className="text-admin-text-secondary text-xs">Región</Label>
              <Select value={regionFilter} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {regiones.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-admin-text-secondary text-xs">Provincia</Label>
              <Select 
                value={provinciaFilter} 
                onValueChange={handleProvinciaChange}
                disabled={regionFilter === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar provincia" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">Todas las provincias</SelectItem>
                  {provinciasFiltradas.map((provincia: any) => (
                    <SelectItem key={provincia.id} value={provincia.nombre}>{provincia.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-admin-text-secondary text-xs">Ciudad / Cantón</Label>
              <Select 
                value={ciudadFilter} 
                onValueChange={setCiudadFilter}
                disabled={provinciaFilter === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ciudad" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {cantones.map((canton: any) => (
                    <SelectItem key={canton.id} value={canton.nombre}>{canton.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-admin-text-secondary text-xs">Estado</Label>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-admin-text-secondary text-xs invisible">Acción</Label>
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
          Mostrando {filteredSucursales.length} de {sucursales.length} sucursales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingSucursales ? (
          <div className="col-span-full text-center py-8 text-admin-text-secondary">
            Cargando sucursales...
          </div>
        ) : filteredSucursales.length === 0 ? (
          <div className="col-span-full text-center py-8 text-admin-text-secondary">
            No se encontraron sucursales con los filtros seleccionados
          </div>
        ) : (
          filteredSucursales.map((sucursal) => (
            <Card key={sucursal.id} className="bg-admin-surface border-admin-border-light h-auto overflow-hidden">
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-admin-text-primary font-semibold truncate">{sucursal.nombre}</span>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 capitalize ${
                      sucursal.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : sucursal.estado === 'mantenimiento'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sucursal.estado}
                    </span>
                  </div>
                  <p className="text-xs text-admin-text-muted font-mono">{sucursal.identificador}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2 min-w-0">
                  <MapPin className="h-4 w-4 text-admin-text-muted mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-admin-text-secondary break-words">{sucursal.direccion}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Monitor className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-admin-text-primary">{sucursal.provincia}</p>
                      <p className="text-xs text-admin-text-muted">Provincia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 min-w-0">
                    <Users className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-admin-text-primary">{sucursal.ciudad || "N/A"}</p>
                      <p className="text-xs text-admin-text-muted">Ciudad</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleVerDetalles(sucursal.id)}
                  >
                    Ver Detalles
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleConfigurar(sucursal.id)}
                  >
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Sucursales;
