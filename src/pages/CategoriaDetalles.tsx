import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Tag, Clock, TrendingUp, Edit, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoria } from "@/hooks/useCategorias";
import { useTurnos } from "@/hooks/useTurnos";

const CategoriaDetalles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: categoria, isLoading } = useCategoria(id || "");
  const { data: turnosDB = [] } = useTurnos();

  // Filtrar turnos de esta categoría
  const turnosCategoria = turnosDB.filter((t: any) => t.categoria_id === id);
  
  // Calcular estadísticas reales
  const turnosAtendidos = turnosCategoria.filter((t: any) => t.estado === 'atendido').length;
  const turnosEnEspera = turnosCategoria.filter((t: any) => t.estado === 'esperando').length;
  const turnosCancelados = turnosCategoria.filter((t: any) => t.estado === 'cancelado').length;
  const turnosLlamados = turnosCategoria.filter((t: any) => t.estado === 'llamado').length;

  const getEstadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "atendido":
        return "bg-green-100 text-green-800";
      case "esperando":
        return "bg-blue-100 text-blue-800";
      case "llamado":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/categorias')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center py-12">
          <p className="text-admin-text-muted">Categoría no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/categorias')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-admin-text-primary">{categoria.nombre}</h1>
            <p className="text-admin-text-secondary">Detalles de la categoría</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/categorias/${id}/configurar`)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Información General */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-admin-surface border-admin-border-light">
            <CardHeader>
              <CardTitle className="text-admin-text-primary">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Nombre</label>
                  <p className="text-admin-text-primary">{categoria.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Estado</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={categoria.activo ? 'default' : 'secondary'}>
                      {categoria.activo ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Prioridad</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {categoria.prioridad_default || 'Normal'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Tiempo Promedio</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-admin-text-muted" />
                    <p className="text-admin-text-primary">{categoria.tiempo_prom_seg ? Math.round(categoria.tiempo_prom_seg / 60) : 0} minutos</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-admin-text-muted">Descripción</label>
                <p className="text-admin-text-secondary mt-1">{categoria.descripcion || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Turnos Atendidos</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{turnosAtendidos}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">En Espera</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{turnosEnEspera}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Llamados</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{turnosLlamados}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Cancelados</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{turnosCancelados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="space-y-6">
          <Card className="bg-admin-surface border-admin-border-light">
            <CardHeader>
              <CardTitle className="text-admin-text-primary">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Total Turnos</span>
                <span className="text-admin-text-primary font-medium">
                  {turnosCategoria.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Tasa de Éxito</span>
                <span className="text-admin-text-primary font-medium">
                  {turnosCategoria.length > 0 
                    ? Math.round((turnosAtendidos / turnosCategoria.length) * 100) 
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historial de Turnos */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-admin-text-primary">
            <span>Turnos Recientes</span>
            <Button variant="outline" size="sm" onClick={() => navigate('/reportes')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {turnosCategoria.length === 0 ? (
            <p className="text-center text-admin-text-muted py-4">No hay turnos para esta categoría</p>
          ) : (
            <div className="space-y-4">
              {turnosCategoria.slice(0, 10).map((turno: any) => (
                <div key={turno.id} className="flex items-center justify-between p-4 bg-admin-background border border-admin-border-light rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-admin-text-primary">{turno.codigo}</p>
                      <p className="text-sm text-admin-text-muted">{turno.sucursal?.nombre || 'Sin sucursal'}</p>
                    </div>
                    <Badge className={getEstadoColor(turno.estado)}>
                      {turno.estado}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-admin-text-muted">
                      {turno.emitido_en ? new Date(turno.emitido_en).toLocaleString() : 'Sin fecha'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriaDetalles;
