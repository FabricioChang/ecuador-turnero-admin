import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Settings, Edit, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSucursal } from "@/hooks/useSucursales";
import { useKioskos } from "@/hooks/useKioskos";
import { useTurnos } from "@/hooks/useTurnos";

const SucursalDetalles = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: sucursal, isLoading } = useSucursal(id || "");
  const { data: kioskosDB = [] } = useKioskos();
  const { data: turnosDB = [] } = useTurnos();

  // Filtrar kioskos de esta sucursal
  const kioskosAsignados = kioskosDB.filter((k: any) => k.sucursal_id === id);
  
  // Filtrar turnos de esta sucursal
  const turnosSucursal = turnosDB.filter((t: any) => t.sucursal_id === id);
  const turnosEnEspera = turnosSucursal.filter((t: any) => t.estado === 'esperando').length;
  const turnosAtendidos = turnosSucursal.filter((t: any) => t.estado === 'atendido').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sucursal) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sucursales')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center py-12">
          <p className="text-admin-text-muted">Sucursal no encontrada</p>
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
            onClick={() => navigate('/sucursales')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-admin-text-primary">{sucursal.nombre}</h1>
            <p className="text-admin-text-secondary">Detalles de la sucursal</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/sucursales/${id}/configurar`)}
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
                  <p className="text-admin-text-primary">{sucursal.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Estado</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={sucursal.estado === 'activo' ? 'default' : 'secondary'}>
                      {sucursal.estado === 'activo' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Región</label>
                  <p className="text-admin-text-primary">{sucursal.region || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Provincia</label>
                  <p className="text-admin-text-primary">{sucursal.provincia || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Ciudad</label>
                  <p className="text-admin-text-primary">{sucursal.ciudad || 'No especificada'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-admin-text-muted">Dirección</label>
                <div className="flex items-start space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-admin-text-muted mt-0.5" />
                  <p className="text-admin-text-primary">{sucursal.direccion || 'Sin dirección'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Horario de Apertura</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-admin-text-muted" />
                    <p className="text-admin-text-primary">{sucursal.hora_apertura || '08:00'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Horario de Cierre</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-admin-text-muted" />
                    <p className="text-admin-text-primary">{sucursal.hora_cierre || '17:00'}</p>
                  </div>
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
                <span className="text-sm text-admin-text-muted">Kioskos Asignados</span>
                <span className="text-admin-text-primary font-medium">{kioskosAsignados.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Usuarios en Espera</span>
                <span className="text-admin-text-primary font-medium">{turnosEnEspera}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Turnos Atendidos Hoy</span>
                <span className="text-admin-text-primary font-medium">{turnosAtendidos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Total Turnos</span>
                <span className="text-admin-text-primary font-medium">{turnosSucursal.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kioskos Asignados */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-admin-text-primary">
            <span>Kioskos Asignados</span>
            <Button variant="outline" size="sm" onClick={() => navigate('/kioskos')}>
              <Settings className="h-4 w-4 mr-2" />
              Gestionar Kioskos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kioskosAsignados.length === 0 ? (
            <p className="text-center text-admin-text-muted py-4">No hay kioskos asignados a esta sucursal</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kioskosAsignados.map((kiosko: any) => (
                <Card key={kiosko.id} className="bg-admin-background border-admin-border-light">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-admin-text-primary">{kiosko.nombre || kiosko.codigo}</h4>
                      <Badge variant={kiosko.activo ? 'default' : 'secondary'}>
                        {kiosko.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-admin-text-muted">
                      <p>Código: {kiosko.codigo}</p>
                      <p>Tipo: {kiosko.tipo || 'General'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SucursalDetalles;
