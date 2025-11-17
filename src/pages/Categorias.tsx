import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Tag, Clock, Users, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categorias = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [prioridadFilter, setPrioridadFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const categorias = [
    {
      id: 1,
      nombre: "Consultas Generales",
      prioridad: "Media",
      tiempoEsperaEstimado: 15,
      estado: "Activa",
      turnosAtendidos: 45,
      turnosEnEspera: 8,
      turnosPerdidos: 2,
      turnosReagendados: 5,
      tiempoReagendamiento: 30
    },
    {
      id: 2,
      nombre: "Trámites Urgentes",
      prioridad: "Alta",
      tiempoEsperaEstimado: 5,
      estado: "Activa",
      turnosAtendidos: 23,
      turnosEnEspera: 12,
      turnosPerdidos: 1,
      turnosReagendados: 3,
      tiempoReagendamiento: 15
    },
    {
      id: 3,
      nombre: "Pagos y Facturación",
      prioridad: "Media",
      tiempoEsperaEstimado: 10,
      estado: "Activa",
      turnosAtendidos: 67,
      turnosEnEspera: 5,
      turnosPerdidos: 4,
      turnosReagendados: 8,
      tiempoReagendamiento: 20
    },
    {
      id: 4,
      nombre: "Soporte Técnico",
      prioridad: "Baja",
      tiempoEsperaEstimado: 25,
      estado: "Mantenimiento",
      turnosAtendidos: 12,
      turnosEnEspera: 0,
      turnosPerdidos: 6,
      turnosReagendados: 15,
      tiempoReagendamiento: 45
    },
    {
      id: 5,
      nombre: "Atención Especial",
      prioridad: "Alta",
      tiempoEsperaEstimado: 8,
      estado: "Inactiva",
      turnosAtendidos: 0,
      turnosEnEspera: 0,
      turnosPerdidos: 0,
      turnosReagendados: 0,
      tiempoReagendamiento: 10
    }
  ];

  const filteredCategorias = categorias.filter(categoria => {
    const matchesSearch = categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrioridad = !prioridadFilter || categoria.prioridad === prioridadFilter;
    const matchesEstado = !estadoFilter || categoria.estado === estadoFilter;

    return matchesSearch && matchesPrioridad && matchesEstado;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setPrioridadFilter("");
    setEstadoFilter("");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text-primary">Prioridad</label>
              <Select value={prioridadFilter} onValueChange={setPrioridadFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          <Card key={categoria.id} className="bg-admin-surface border-admin-border-light">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-admin-text-primary">{categoria.nombre}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  categoria.estado === 'Activa' 
                    ? 'bg-green-100 text-green-800' 
                    : categoria.estado === 'Mantenimiento'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {categoria.estado}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-admin-text-muted" />
                  <span className="text-sm text-admin-text-secondary">Prioridad:</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getPrioridadColor(categoria.prioridad)}`}>
                  {categoria.prioridad}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-admin-text-muted" />
                <div>
                  <p className="text-sm font-medium text-admin-text-primary">{categoria.tiempoEsperaEstimado} min</p>
                  <p className="text-xs text-admin-text-muted">Tiempo estimado</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-admin-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-admin-text-primary">{categoria.turnosAtendidos}</p>
                    <p className="text-xs text-admin-text-muted">Atendidos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-admin-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-admin-text-primary">{categoria.turnosEnEspera}</p>
                    <p className="text-xs text-admin-text-muted">En espera</p>
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