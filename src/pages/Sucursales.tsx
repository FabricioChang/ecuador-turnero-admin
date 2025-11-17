import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Users, Monitor, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sucursales = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [kioskosFilter, setKioskosFilter] = useState("");

  const regiones = {
    costa: ["Esmeraldas", "Manabí", "Los Ríos", "Guayas", "Santa Elena", "El Oro"],
    sierra: ["Carchi", "Imbabura", "Pichincha", "Cotopaxi", "Tungurahua", "Bolívar", "Chimborazo", "Cañar", "Azuay", "Loja"],
    amazonia: ["Sucumbíos", "Napo", "Orellana", "Pastaza", "Morona Santiago", "Zamora Chinchipe"],
    galapagos: ["Galápagos"]
  };

  const ciudades = {
    "Pichincha": ["Quito", "Cayambe", "Mejía", "Pedro Moncayo", "Rumiñahui", "San Miguel de los Bancos"],
    "Guayas": ["Guayaquil", "Durán", "Samborondón", "Daule", "Milagro", "Naranjal"],
    "Azuay": ["Cuenca", "Gualaceo", "Paute", "Chordeleg", "Sigsig"]
  };

  const sucursales = [
    {
      id: 1,
      identificador: "SUC-0001",
      nombre: "Sucursal Centro",
      direccion: "Av. 10 de Agosto 123, Quito",
      estado: "Activa",
      kioskos: 3,
      usuariosEspera: 12,
      region: "sierra",
      provincia: "Pichincha",
      ciudad: "Quito"
    },
    {
      id: 2,
      identificador: "SUC-0002",
      nombre: "Sucursal Norte",
      direccion: "Av. Eloy Alfaro 456, Quito",
      estado: "Activa",
      kioskos: 2,
      usuariosEspera: 8,
      region: "sierra",
      provincia: "Pichincha",
      ciudad: "Quito"
    },
    {
      id: 3,
      identificador: "SUC-0003",
      nombre: "Sucursal Sur",
      direccion: "Av. Maldonado 789, Quito",
      estado: "Mantenimiento",
      kioskos: 4,
      usuariosEspera: 0,
      region: "sierra",
      provincia: "Pichincha",
      ciudad: "Quito"
    },
    {
      id: 4,
      identificador: "SUC-0004",
      nombre: "Sucursal Guayaquil Centro",
      direccion: "Av. 9 de Octubre 100, Guayaquil",
      estado: "Activa",
      kioskos: 5,
      usuariosEspera: 15,
      region: "costa",
      provincia: "Guayas",
      ciudad: "Guayaquil"
    },
    {
      id: 5,
      identificador: "SUC-0005",
      nombre: "Sucursal Cuenca",
      direccion: "Calle Bolívar 200, Cuenca",
      estado: "Inactiva",
      kioskos: 0,
      usuariosEspera: 0,
      region: "sierra",
      provincia: "Azuay",
      ciudad: "Cuenca"
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

  const filteredSucursales = sucursales.filter(sucursal => {
    const matchesSearch = sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = !regionFilter || sucursal.region === regionFilter;
    const matchesProvincia = !provinciaFilter || sucursal.provincia === provinciaFilter;
    const matchesCiudad = !ciudadFilter || sucursal.ciudad === ciudadFilter;
    const matchesEstado = !estadoFilter || sucursal.estado === estadoFilter;
    
    let matchesKioskos = true;
    if (kioskosFilter) {
      if (kioskosFilter === "0") matchesKioskos = sucursal.kioskos === 0;
      else if (kioskosFilter === "1-3") matchesKioskos = sucursal.kioskos >= 1 && sucursal.kioskos <= 3;
      else if (kioskosFilter === "4+") matchesKioskos = sucursal.kioskos >= 4;
    }

    return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad && matchesEstado && matchesKioskos;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setRegionFilter("");
    setProvinciaFilter("");
    setCiudadFilter("");
    setEstadoFilter("");
    setKioskosFilter("");
  };

  const handleVerDetalles = (id: number) => {
    navigate(`/sucursales/${id}/detalles`);
  };

  const handleConfigurar = (id: number) => {
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

          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text-primary">Región</label>
              <Select value={regionFilter} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="costa">Costa</SelectItem>
                  <SelectItem value="sierra">Sierra</SelectItem>
                  <SelectItem value="amazonia">Amazonía</SelectItem>
                  <SelectItem value="galapagos">Galápagos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text-primary">Provincia</label>
              <Select 
                value={provinciaFilter} 
                onValueChange={handleProvinciaChange}
                disabled={!regionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar provincia" />
                </SelectTrigger>
                <SelectContent>
                  {regionFilter && regiones[regionFilter as keyof typeof regiones]?.map(provincia => (
                    <SelectItem key={provincia} value={provincia}>{provincia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text-primary">Ciudad</label>
              <Select 
                value={ciudadFilter} 
                onValueChange={setCiudadFilter}
                disabled={!provinciaFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {provinciaFilter && ciudades[provinciaFilter as keyof typeof ciudades]?.map(ciudad => (
                    <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text-primary">Estado</label>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="Inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text-primary">Cantidad de Kioskos</label>
              <Select value={kioskosFilter} onValueChange={setKioskosFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cantidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 kioskos</SelectItem>
                  <SelectItem value="1-3">1 a 3 kioskos</SelectItem>
                  <SelectItem value="4+">Más de 4 kioskos</SelectItem>
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
          Mostrando {filteredSucursales.length} de {sucursales.length} sucursales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSucursales.map((sucursal) => (
          <Card key={sucursal.id} className="bg-admin-surface border-admin-border-light">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-primary font-semibold">{sucursal.nombre}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sucursal.estado === 'Activa' 
                      ? 'bg-green-100 text-green-800' 
                      : sucursal.estado === 'Mantenimiento'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sucursal.estado}
                  </span>
                </div>
                <p className="text-xs text-admin-text-muted font-mono">{sucursal.identificador}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-admin-text-muted mt-0.5" />
                <span className="text-sm text-admin-text-secondary">{sucursal.direccion}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-admin-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-admin-text-primary">{sucursal.kioskos}</p>
                    <p className="text-xs text-admin-text-muted">Kioskos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-admin-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-admin-text-primary">{sucursal.usuariosEspera}</p>
                    <p className="text-xs text-admin-text-muted">En espera</p>
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
        ))}
      </div>

      {filteredSucursales.length === 0 && (
        <div className="text-center py-12">
          <p className="text-admin-text-muted">No se encontraron sucursales que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default Sucursales;