import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Monitor, Wifi, Battery, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegiones } from "@/hooks/useRegiones";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useKioskos } from "@/hooks/useKioskos";
import { useSucursales } from "@/hooks/useSucursales";

const Kioskos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [provinciaFilter, setProvinciaFilter] = useState("all");
  const [ciudadFilter, setCiudadFilter] = useState("all");
  const [sucursalFilter, setSucursalFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");

  // Cargar datos desde la base de datos
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: kioskosDB = [], isLoading } = useKioskos();
  const { data: sucursales = [] } = useSucursales();

  // Filtrar provincias por región seleccionada
  const provinciasFiltradas = useMemo(() => {
    if (regionFilter === "all") return provincias;
    const regionSeleccionada = regiones.find(r => r.id === regionFilter);
    return provincias.filter((p: any) => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  // Filtrar cantones por provincia seleccionada
  const cantonesFiltrados = useMemo(() => {
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

  // Mapear kioskos con datos de sucursal
  const kioskos = kioskosDB.map((k: any) => ({
    id: k.id,
    identificador: k.codigo || k.identificador,
    nombre: k.nombre,
    sucursal: k.sucursal?.nombre || "Sin sucursal",
    sucursal_id: k.sucursal_id,
    estado: k.estado,
    ubicacion: k.ubicacion || "No especificada",
    provincia: k.sucursal?.provincia || "",
    ciudad: k.sucursal?.ciudad || ""
  }));

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

  const filteredKioskos = kioskos.filter(kiosko => {
    const matchesSearch = kiosko.identificador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kiosko.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por sucursal directa
    if (sucursalFilter !== "all") {
      return matchesSearch && kiosko.sucursal_id === sucursalFilter;
    }
    
    // Filtros jerárquicos
    const sucursalIds = sucursalesFiltradas.map((s: any) => s.id);
    const matchesSucursal = sucursalIds.length === 0 || sucursalIds.includes(kiosko.sucursal_id);
    
    const matchesEstado = estadoFilter === "all" || kiosko.estado === estadoFilter;
    
    return matchesSearch && matchesSucursal && matchesEstado;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Kioskos</h1>
          <p className="text-admin-text-secondary">Monitoreo y gestión de kioskos táctiles</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/kioskos/registrar')}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Kiosko
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="flex items-center text-admin-text-primary">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted h-4 w-4" />
            <Input
              placeholder="Buscar por identificador o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-admin-bg border-admin-border-light text-admin-text-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Select value={regionFilter} onValueChange={handleRegionChange}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
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
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light z-50">
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provinciasFiltradas.map((prov: any) => (
                  <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={ciudadFilter} 
              onValueChange={handleCiudadChange}
              disabled={provinciaFilter === "all"}
            >
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light z-50">
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cantonesFiltrados.map((ciudad: any) => (
                  <SelectItem key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {sucursalesFiltradas.map((sucursal: any) => (
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setRegionFilter("all");
                setProvinciaFilter("all");
                setCiudadFilter("all");
                setSucursalFilter("all");
                setEstadoFilter("all");
              }}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-admin-text-secondary mb-2">
        Mostrando {filteredKioskos.length} de {kioskos.length} kioskos
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-admin-text-secondary">
            Cargando kioskos...
          </div>
        ) : filteredKioskos.length === 0 ? (
          <div className="col-span-full text-center py-8 text-admin-text-secondary">
            No se encontraron kioskos con los filtros seleccionados
          </div>
        ) : (
          filteredKioskos.map((kiosko) => (
            <Card key={kiosko.id} className="bg-admin-surface border-admin-border-light h-auto overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-admin-text-primary text-lg font-semibold">{kiosko.identificador}</span>
                    <p className="text-sm font-normal text-admin-text-secondary mt-1 truncate">{kiosko.nombre}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 capitalize ${getEstadoColor(kiosko.estado)}`}>
                    {kiosko.estado}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-admin-text-muted mb-1">Sucursal</p>
                  <p className="text-sm font-medium text-admin-text-primary truncate">{kiosko.sucursal}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Monitor className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-admin-text-primary truncate">
                        {kiosko.ubicacion}
                      </p>
                      <p className="text-xs text-admin-text-muted">Ubicación física</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 min-w-0">
                    <Wifi className="h-4 w-4 text-admin-text-muted flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-admin-text-primary truncate">{kiosko.ciudad || "N/A"}</p>
                      <p className="text-xs text-admin-text-muted">Ciudad</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Monitorear
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
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

export default Kioskos;
