import { useState, useMemo, Suspense, lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Monitor, Wifi, Settings, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useCreateSucursal } from "@/hooks/useSucursalesMutations";
import { PROVINCIAS_ECUADOR, findProvinciaByName, findCiudadInProvincia } from "@/data/ecuadorProvincias";

// Lazy load the map component
const LocationMap = lazy(() => import("@/components/LocationMap"));

interface Kiosko {
  id: number;
  nombre: string;
  categoria: string;
  estado: string;
  ubicacion: string;
  tipo: string;
  region: string;
  provincia: string;
  ciudad: string;
  sucursal: string;
}

const NuevaSucursal = () => {
  const navigate = useNavigate();
  const createSucursal = useCreateSucursal();
  
  const [formData, setFormData] = useState({
    nombre: "",
    provincia_id: "",
    ciudad: "",
    direccion: "",
    email: "",
    telefono_sms: "",
    capacidad_maxima: "",
  });
  
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

  const [searchKioskos, setSearchKioskos] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [selectedKioskos, setSelectedKioskos] = useState<number[]>([]);

  // Get cities for selected province
  const ciudadesDisponibles = useMemo(() => {
    if (!formData.provincia_id) return [];
    const provincia = PROVINCIAS_ECUADOR.find(p => p.id === formData.provincia_id);
    return provincia?.ciudades || [];
  }, [formData.provincia_id]);

  // Filter provinces by region for kiosko filters
  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter || regionFilter === "all") return PROVINCIAS_ECUADOR;
    return PROVINCIAS_ECUADOR.filter(p => p.region.toLowerCase() === regionFilter.toLowerCase());
  }, [regionFilter]);

  const kioskosDisponibles: Kiosko[] = [
    {
      id: 1,
      nombre: "Kiosko Táctil 001",
      categoria: "Autoservicio",
      estado: "Disponible",
      ubicacion: "Sin asignar",
      tipo: "Táctil",
      region: "sierra",
      provincia: "Pichincha",
      ciudad: "Quito",
      sucursal: "Sin asignar"
    },
    {
      id: 2,
      nombre: "Kiosko Táctil 002",
      categoria: "Información",
      estado: "Disponible",
      ubicacion: "Sin asignar",
      tipo: "Táctil",
      region: "sierra",
      provincia: "Pichincha",
      ciudad: "Quito",
      sucursal: "Sin asignar"
    },
    {
      id: 3,
      nombre: "Terminal Digital 001",
      categoria: "Autoservicio",
      estado: "Disponible",
      ubicacion: "Sin asignar",
      tipo: "Terminal",
      region: "costa",
      provincia: "Guayas",
      ciudad: "Guayaquil",
      sucursal: "Sin asignar"
    },
    {
      id: 4,
      nombre: "Kiosko Táctil 003",
      categoria: "Pagos",
      estado: "Disponible",
      ubicacion: "Sin asignar",
      tipo: "Táctil",
      region: "sierra",
      provincia: "Azuay",
      ciudad: "Cuenca",
      sucursal: "Sin asignar"
    },
    {
      id: 5,
      nombre: "Terminal Digital 002",
      categoria: "Información",
      estado: "Mantenimiento",
      ubicacion: "Sin asignar",
      tipo: "Terminal",
      region: "costa",
      provincia: "Guayas",
      ciudad: "Guayaquil",
      sucursal: "Sin asignar"
    },
    {
      id: 6,
      nombre: "Kiosko Táctil 004",
      categoria: "Autoservicio",
      estado: "Disponible",
      ubicacion: "Sin asignar",
      tipo: "Táctil",
      region: "sierra",
      provincia: "Pichincha",
      ciudad: "Quito",
      sucursal: "Sin asignar"
    }
  ];

  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("");
    setCiudadFilter("");
  };

  const handleProvinciaFilterChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("");
  };

  const filteredKioskos = kioskosDisponibles.filter(kiosko => {
    const matchesSearch = kiosko.nombre.toLowerCase().includes(searchKioskos.toLowerCase()) ||
                         kiosko.id.toString().includes(searchKioskos);
    const matchesRegion = !regionFilter || regionFilter === "all" || kiosko.region === regionFilter;
    const matchesProvincia = !provinciaFilter || provinciaFilter === "all" || kiosko.provincia === provinciaFilter;
    const matchesCiudad = !ciudadFilter || ciudadFilter === "all" || kiosko.ciudad === ciudadFilter;
    const matchesSucursal = !sucursalFilter || sucursalFilter === "all" || kiosko.sucursal === sucursalFilter;
    const matchesEstado = !estadoFilter || estadoFilter === "all" || kiosko.estado === estadoFilter;
    
    return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad && matchesSucursal && matchesEstado;
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinciaChange = (provinciaId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      provincia_id: provinciaId,
      ciudad: "" // Reset city when province changes
    }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number; direccion: string; provincia: string; ciudad: string }) => {
    setMapPosition({ lat: location.lat, lng: location.lng });
    
    // Auto-fill address
    if (location.direccion) {
      setFormData(prev => ({ ...prev, direccion: location.direccion }));
    }
    
    // Try to match provincia
    if (location.provincia) {
      const matchedProvincia = findProvinciaByName(location.provincia);
      if (matchedProvincia) {
        setFormData(prev => ({ 
          ...prev, 
          provincia_id: matchedProvincia.id,
          direccion: location.direccion || prev.direccion
        }));
        
        // Try to match ciudad within the provincia
        if (location.ciudad) {
          const matchedCiudad = findCiudadInProvincia(location.ciudad, matchedProvincia.id);
          if (matchedCiudad) {
            setFormData(prev => ({ ...prev, ciudad: matchedCiudad }));
          }
        }
      }
    }
  };

  const handleKioskoToggle = (kioskoId: number) => {
    setSelectedKioskos(prev => 
      prev.includes(kioskoId) 
        ? prev.filter(id => id !== kioskoId)
        : [...prev, kioskoId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la sucursal es requerido",
        variant: "destructive"
      });
      return;
    }

    if (!formData.provincia_id) {
      toast({
        title: "Error",
        description: "La provincia es requerida",
        variant: "destructive"
      });
      return;
    }

    if (!formData.ciudad) {
      toast({
        title: "Error",
        description: "La ciudad es requerida",
        variant: "destructive"
      });
      return;
    }

    // Get provincia name from ID
    const provincia = PROVINCIAS_ECUADOR.find(p => p.id === formData.provincia_id);

    try {
      await createSucursal.mutateAsync({
        nombre: formData.nombre,
        provincia: provincia?.nombre || "",
        ciudad: formData.ciudad,
        direccion: formData.direccion || undefined,
        region: provincia?.region || "Sierra",
      });

      navigate('/sucursales');
    } catch (error) {
      console.error('Error al crear sucursal:', error);
    }
  };

  const clearKioskoFilters = () => {
    setSearchKioskos("");
    setRegionFilter("");
    setProvinciaFilter("");
    setCiudadFilter("");
    setSucursalFilter("");
    setEstadoFilter("");
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return <Wifi className="h-4 w-4 text-green-600" />;
      case "Mantenimiento":
        return <Settings className="h-4 w-4 text-yellow-600" />;
      default:
        return <Monitor className="h-4 w-4 text-admin-text-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sucursales')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Nueva Sucursal</h1>
          <p className="text-admin-text-secondary">Crear una nueva ubicación de atención</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Sucursal *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Sucursal Centro Norte"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia *</Label>
                <Select
                  value={formData.provincia_id}
                  onValueChange={handleProvinciaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PROVINCIAS_ECUADOR.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Select
                  value={formData.ciudad}
                  onValueChange={(value) => handleInputChange('ciudad', value)}
                  disabled={!formData.provincia_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ciudadesDisponibles.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Ej: Av. 10 de Agosto N123 y Av. Colón"
              />
            </div>

            {/* Map Component */}
            <div className="space-y-2">
              <Label>Ubicación en el Mapa</Label>
              <Suspense fallback={
                <div className="h-[300px] rounded-lg border border-admin-border-light flex items-center justify-center bg-muted">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }>
                <LocationMap 
                  onLocationSelect={handleLocationSelect}
                  initialPosition={mapPosition}
                />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        {/* Asignación de Kioskos */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-admin-text-primary">
              <span>Asignación de Kioskos</span>
              <span className="text-sm font-normal text-admin-text-secondary">
                {selectedKioskos.length} seleccionados
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros de Kioskos */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-admin-text-muted" />
                <Input
                  placeholder="Buscar por identificador o nombre..."
                  value={searchKioskos}
                  onChange={(e) => setSearchKioskos(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Región</Label>
                  <Select value={regionFilter} onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Región" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="costa">Costa</SelectItem>
                      <SelectItem value="sierra">Sierra</SelectItem>
                      <SelectItem value="amazonia">Amazonía</SelectItem>
                      <SelectItem value="galapagos">Galápagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Provincia</Label>
                  <Select 
                    value={provinciaFilter} 
                    onValueChange={handleProvinciaFilterChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Provincia" />
                    </SelectTrigger>
                    <SelectContent className="z-50 max-h-[300px]">
                      <SelectItem value="all">Todas</SelectItem>
                      {provinciasFiltradas.map(prov => (
                        <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ciudad</Label>
                  <Select 
                    value={ciudadFilter} 
                    onValueChange={setCiudadFilter}
                    disabled={!provinciaFilter || provinciaFilter === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent className="z-50 max-h-[300px]">
                      <SelectItem value="all">Todas</SelectItem>
                      {provinciaFilter && provinciaFilter !== "all" && 
                        PROVINCIAS_ECUADOR.find(p => p.nombre === provinciaFilter)?.ciudades.map(ciudad => (
                          <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                      <SelectItem value="Sucursal Centro">Sucursal Centro</SelectItem>
                      <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={clearKioskoFilters} className="w-full">
                Limpiar Filtros
              </Button>
            </div>

            {/* Lista de Kioskos */}
            <div className="border border-admin-border-light rounded-lg max-h-96 overflow-y-auto">
              {filteredKioskos.length === 0 ? (
                <div className="p-8 text-center text-admin-text-muted">
                  No se encontraron kioskos disponibles
                </div>
              ) : (
                <div className="divide-y divide-admin-border-light">
                  {filteredKioskos.map((kiosko) => (
                    <div key={kiosko.id} className="p-4 hover:bg-admin-background-hover">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`kiosko-${kiosko.id}`}
                          checked={selectedKioskos.includes(kiosko.id)}
                          onCheckedChange={() => handleKioskoToggle(kiosko.id)}
                          disabled={kiosko.estado === 'Mantenimiento'}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-admin-text-primary truncate">
                              {kiosko.nombre}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {getEstadoIcon(kiosko.estado)}
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                kiosko.estado === 'Disponible' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {kiosko.estado}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-admin-text-muted mt-1">
                            {kiosko.categoria} • {kiosko.tipo} • {kiosko.ciudad}, {kiosko.provincia}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/sucursales')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={createSucursal.isPending}>
            {createSucursal.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Sucursal"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevaSucursal;
