import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Monitor, Users, Settings, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SucursalDetalles = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - en una aplicación real esto vendría de una API
  const sucursal = {
    id: parseInt(id || "1"),
    nombre: "Sucursal Centro",
    descripcion: "Sucursal principal ubicada en el centro histórico de Quito, atiende principalmente trámites administrativos y consultas generales.",
    direccion: "Av. 10 de Agosto 123, Quito, Pichincha",
    estado: "Activa",
    horarioApertura: "08:00",
    horarioCierre: "17:00",
    kioskos: 3,
    usuariosEspera: 12,
    region: "Sierra",
    provincia: "Pichincha",
    ciudad: "Quito",
    fechaCreacion: "2024-01-15",
    ultimaActualizacion: "2024-08-07"
  };

  const kioskosAsignados = [
    {
      id: 1,
      nombre: "Kiosko Táctil 001",
      categoria: "Autoservicio",
      estado: "Activo",
      ubicacion: "Entrada principal",
      ultimaConexion: "2024-08-07 14:30"
    },
    {
      id: 2,
      nombre: "Kiosko Táctil 002",
      categoria: "Información",
      estado: "Activo",
      ubicacion: "Sala de espera",
      ultimaConexion: "2024-08-07 14:28"
    },
    {
      id: 3,
      nombre: "Terminal Digital 001",
      categoria: "Pagos",
      estado: "Mantenimiento",
      ubicacion: "Área de cajas",
      ultimaConexion: "2024-08-06 16:45"
    }
  ];

  const estadisticas = [
    { titulo: "Turnos Atendidos Hoy", valor: "127", cambio: "+15%" },
    { titulo: "Tiempo Promedio Espera", valor: "8 min", cambio: "-12%" },
    { titulo: "Usuarios Activos", valor: "12", cambio: "+3" },
    { titulo: "Eficiencia", valor: "94%", cambio: "+2%" }
  ];

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
                    <Badge variant={sucursal.estado === 'Activa' ? 'default' : 'secondary'}>
                      {sucursal.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Región</label>
                  <p className="text-admin-text-primary">{sucursal.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Provincia</label>
                  <p className="text-admin-text-primary">{sucursal.provincia}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Ciudad</label>
                  <p className="text-admin-text-primary">{sucursal.ciudad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Fecha de Creación</label>
                  <p className="text-admin-text-primary">{new Date(sucursal.fechaCreacion).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-admin-text-muted">Dirección</label>
                <div className="flex items-start space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-admin-text-muted mt-0.5" />
                  <p className="text-admin-text-primary">{sucursal.direccion}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-admin-text-muted">Descripción</label>
                <p className="text-admin-text-secondary mt-1">{sucursal.descripcion}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Horario de Apertura</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-admin-text-muted" />
                    <p className="text-admin-text-primary">{sucursal.horarioApertura}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Horario de Cierre</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-admin-text-muted" />
                    <p className="text-admin-text-primary">{sucursal.horarioCierre}</p>
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
              <CardTitle className="text-admin-text-primary">Estadísticas de Hoy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {estadisticas.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-admin-text-muted">{stat.titulo}</span>
                    <span className="text-xs text-green-600">{stat.cambio}</span>
                  </div>
                  <p className="text-lg font-semibold text-admin-text-primary">{stat.valor}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-admin-surface border-admin-border-light">
            <CardHeader>
              <CardTitle className="text-admin-text-primary">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Kioskos Asignados</span>
                <span className="text-admin-text-primary font-medium">{sucursal.kioskos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Usuarios en Espera</span>
                <span className="text-admin-text-primary font-medium">{sucursal.usuariosEspera}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Última Actualización</span>
                <span className="text-admin-text-primary font-medium">
                  {new Date(sucursal.ultimaActualizacion).toLocaleDateString()}
                </span>
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
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Gestionar Kioskos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kioskosAsignados.map((kiosko) => (
              <Card key={kiosko.id} className="bg-admin-background border-admin-border-light">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-admin-text-primary">{kiosko.nombre}</h4>
                    <Badge variant={kiosko.estado === 'Activo' ? 'default' : 'secondary'}>
                      {kiosko.estado}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-admin-text-muted">
                    <p>Categoría: {kiosko.categoria}</p>
                    <p>Ubicación: {kiosko.ubicacion}</p>
                    <p>Última conexión: {kiosko.ultimaConexion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SucursalDetalles;