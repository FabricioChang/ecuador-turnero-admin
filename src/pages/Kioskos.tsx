import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Monitor, Wifi, Battery, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";
import { useKioskos } from "@/hooks/useKioskos";

const Kioskos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  // Cargar datos desde la base de datos
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: kioskosDB = [], isLoading } = useKioskos();

  const kioskos = kioskosDB.map((k: any) => ({
    id: k.id,
    identificador: k.identificador,
    nombre: k.nombre,
    sucursal: k.sucursal?.nombre || "Sin sucursal",
    estado: k.estado,
    ubicacion: k.ubicacion || "No especificada",
    provincia: k.sucursal?.provincia?.nombre || "",
    ciudad: k.sucursal?.canton?.nombre || ""
  }));

  // Filtrar provincias por región seleccionada
  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter) return provincias;
    const regionSeleccionada = regiones.find(r => r.id === regionFilter);
    return provincias.filter(p => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  // Filtrar cantones por provincia seleccionada
  const cantonesFiltrados = useMemo(() => {
    if (!provinciaFilter) return cantones;
    const provinciaSeleccionada = provincias.find(p => p.nombre === provinciaFilter);
    return cantones.filter(c => c.provincia_id === provinciaSeleccionada?.id);
  }, [provinciaFilter, cantones, provincias]);

  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("");
    setCiudadFilter("");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("");
  };

  const filteredKioskos = kioskos.filter(kiosko => {
    const matchesSearch = kiosko.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kiosko.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !regionFilter || kiosko.region === regionFilter;
    const matchesProvincia = !provinciaFilter || kiosko.provincia === provinciaFilter;
    const matchesCiudad = !ciudadFilter || kiosko.ciudad === ciudadFilter;
    const matchesSucursal = !sucursalFilter || kiosko.sucursal === sucursalFilter;
    const matchesEstado = !estadoFilter || kiosko.estado === estadoFilter;
    
    return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad && matchesSucursal && matchesEstado;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'bg-green-100 text-green-800';
      case 'Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConexionColor = (conexion: string) => {
    switch (conexion) {
      case 'Excelente':
        return 'text-green-600';
      case 'Buena':
        return 'text-blue-600';
      case 'Regular':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={regionFilter} onValueChange={handleRegionChange}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las regiones</SelectItem>
                <SelectItem value="costa">Costa</SelectItem>
                <SelectItem value="sierra">Sierra</SelectItem>
                <SelectItem value="amazonia">Amazonía</SelectItem>
                <SelectItem value="galapagos">Galápagos</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={provinciaFilter} 
              onValueChange={handleProvinciaChange}
              disabled={loadingProvincias}
            >
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light z-50">
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provinciasFiltradas.map(prov => (
                  <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={ciudadFilter} 
              onValueChange={setCiudadFilter}
              disabled={!provinciaFilter || provinciaFilter === "all" || loadingCantones}
            >
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light z-50">
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cantonesFiltrados.map(ciudad => (
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
                <SelectItem value="Sucursal Centro">Sucursal Centro</SelectItem>
                <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                <SelectItem value="Sucursal Sur">Sucursal Sur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Operativo">Operativo</SelectItem>
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKioskos.map((kiosko) => (
          <Card key={kiosko.id} className="bg-admin-surface border-admin-border-light">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="text-admin-text-primary">{kiosko.id}</span>
                  <p className="text-sm font-normal text-admin-text-secondary">{kiosko.nombre}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getEstadoColor(kiosko.estado)}`}>
                  {kiosko.estado}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-admin-text-muted">Ubicación</p>
                <p className="text-sm font-medium text-admin-text-primary">{kiosko.sucursal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-admin-text-muted" />
                  <div>
                    <p className={`text-sm font-medium ${getConexionColor(kiosko.conexion)}`}>
                      {kiosko.conexion}
                    </p>
                    <p className="text-xs text-admin-text-muted">Conexión</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Battery className="h-4 w-4 text-admin-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-admin-text-primary">{kiosko.bateria}%</p>
                    <p className="text-xs text-admin-text-muted">Batería</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-admin-text-muted">Última actividad</p>
                <p className="text-sm text-admin-text-secondary">{kiosko.ultimaActividad}</p>
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
        ))}
      </div>
    </div>
  );
};

export default Kioskos;