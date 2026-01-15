import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Plus, Monitor, Wifi, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";
import { useCreateSucursal } from "@/hooks/useSucursalesMutations";
import { AddressInput } from "@/components/AddressInput";

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
    canton_id: "",
    direccion: "",
    email: "",
    telefono_sms: "",
    capacidad_maxima: "",
  });
  
  const [selectedRegion, setSelectedRegion] = useState("");

  const [searchKioskos, setSearchKioskos] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [selectedKioskos, setSelectedKioskos] = useState<number[]>([]);

  // Cargar datos desde la base de datos
  const { regiones } = useRegiones();
  const provincias = useProvincias();
  const cantones = useCantones(formData.provincia_id);

  // Filtrar provincias por región seleccionada
  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter) return provincias.data || [];
    const regionSeleccionada = regiones.find(r => r.id === regionFilter);
    return (provincias.data || []).filter(p => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias.data, regiones]);

  // Filtrar cantones por provincia seleccionada en el formulario
  const cantonesFiltrados = useMemo(() => {
    if (!formData.provincia_id) return [];
    return (cantones.data || []).filter((c: any) => c.provincia === formData.provincia_id);
  }, [formData.provincia_id, cantones.data]);

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

  const handleProvinciaChange = (value: string) => {
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

    if (!formData.canton_id) {
      toast({
        title: "Error",
        description: "El cantón es requerido",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSucursal.mutateAsync({
        nombre: formData.nombre,
        provincia_id: formData.provincia_id,
        canton_id: formData.canton_id,
        direccion: formData.direccion || undefined,
      });

      navigate('/sucursales');
    } catch (error) {
      // El error ya se maneja en el hook
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
            <div className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <AddressInput
                  id="direccion"
                  value={formData.direccion}
                  onChange={(value) => handleInputChange('direccion', value)}
                  placeholder="Ej: Av. 10 de Agosto 123"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia *</Label>
                <Select
                  value={formData.provincia_id}
                  onValueChange={(value) => {
                    handleInputChange('provincia_id', value);
                    handleInputChange('canton_id', ''); // Reset canton when province changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinciasFiltradas.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón *</Label>
                <Select
                  value={formData.canton_id}
                  onValueChange={(value) => handleInputChange('canton_id', value)}
                  disabled={!formData.provincia_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cantón" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantonesFiltrados.map((canton) => (
                      <SelectItem key={canton.id} value={canton.id}>
                        {canton.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    onValueChange={handleProvinciaChange}
                    disabled={provincias.isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Provincia" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
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
                    disabled={!provinciaFilter || provinciaFilter === "all" || cantones.isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="all">Todas</SelectItem>
                      {cantonesFiltrados.map(ciudad => (
                        <SelectItem key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</SelectItem>
                      ))}
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
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {kiosko.estado}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-xs text-admin-text-muted">
                            <span>Categoría: {kiosko.categoria}</span>
                            <span>Tipo: {kiosko.tipo}</span>
                          </div>
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
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Crear Sucursal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevaSucursal;