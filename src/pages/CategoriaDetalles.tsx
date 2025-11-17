import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Tag, Clock, Users, TrendingUp, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const CategoriaDetalles = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - en una aplicación real esto vendría de una API
  const categoria = {
    id: parseInt(id || "1"),
    nombre: "Consultas Generales",
    descripcion: "Categoría para atención de consultas generales y solicitudes de información básica sobre servicios y trámites.",
    prioridad: "Media",
    tiempoEsperaEstimado: 15,
    estado: "Activa",
    turnosAtendidos: 45,
    turnosEnEspera: 8,
    turnosPerdidos: 2,
    turnosReagendados: 5,
    tiempoReagendamiento: 30,
    fechaCreacion: "2024-01-15",
    ultimaActualizacion: "2024-08-07"
  };

  const estadisticas = [
    { titulo: "Turnos Atendidos Hoy", valor: "45", cambio: "+8%" },
    { titulo: "Tiempo Promedio Espera", valor: "12 min", cambio: "-3 min" },
    { titulo: "Turnos en Espera", valor: "8", cambio: "+2" },
    { titulo: "Eficiencia", valor: "92%", cambio: "+5%" }
  ];

  const historialTurnos = [
    {
      id: 1,
      numeroTurno: "A-001",
      estado: "Atendido",
      tiempoEspera: "8 min",
      fechaHora: "2024-08-07 14:30",
      sucursal: "Sucursal Centro"
    },
    {
      id: 2,
      numeroTurno: "A-002",
      estado: "En espera",
      tiempoEspera: "5 min",
      fechaHora: "2024-08-07 14:35",
      sucursal: "Sucursal Norte"
    },
    {
      id: 3,
      numeroTurno: "A-003",
      estado: "Reagendado",
      tiempoEspera: "20 min",
      fechaHora: "2024-08-07 14:20",
      sucursal: "Sucursal Sur"
    },
    {
      id: 4,
      numeroTurno: "A-004",
      estado: "Perdido",
      tiempoEspera: "25 min",
      fechaHora: "2024-08-07 14:10",
      sucursal: "Sucursal Centro"
    }
  ];

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

  const getEstadoTurnoColor = (estado: string) => {
    switch (estado) {
      case "Atendido":
        return "bg-green-100 text-green-800";
      case "En espera":
        return "bg-blue-100 text-blue-800";
      case "Reagendado":
        return "bg-yellow-100 text-yellow-800";
      case "Perdido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                    <Badge variant={categoria.estado === 'Activa' ? 'default' : 'secondary'}>
                      {categoria.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Prioridad</label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPrioridadColor(categoria.prioridad)}`}>
                      {categoria.prioridad}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Tiempo de Reagendamiento</label>
                  <p className="text-admin-text-primary">{categoria.tiempoReagendamiento} minutos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Fecha de Creación</label>
                  <p className="text-admin-text-primary">{new Date(categoria.fechaCreacion).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Tiempo Estimado de Espera</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-admin-text-muted" />
                    <p className="text-admin-text-primary">{categoria.tiempoEsperaEstimado} minutos</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-admin-text-muted">Descripción</label>
                <p className="text-admin-text-secondary mt-1">{categoria.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Turnos Atendidos</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{categoria.turnosAtendidos}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">En Espera</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{categoria.turnosEnEspera}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Perdidos</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{categoria.turnosPerdidos}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-admin-text-muted">Reagendados</label>
                  <p className="text-lg font-semibold text-admin-text-primary">{categoria.turnosReagendados}</p>
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
                <span className="text-sm text-admin-text-muted">Total Turnos Hoy</span>
                <span className="text-admin-text-primary font-medium">
                  {categoria.turnosAtendidos + categoria.turnosEnEspera + categoria.turnosPerdidos}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Tasa de Éxito</span>
                <span className="text-admin-text-primary font-medium">
                  {Math.round((categoria.turnosAtendidos / (categoria.turnosAtendidos + categoria.turnosPerdidos)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-admin-text-muted">Última Actualización</span>
                <span className="text-admin-text-primary font-medium">
                  {new Date(categoria.ultimaActualizacion).toLocaleDateString()}
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
            <span>Historial de Turnos Recientes</span>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historialTurnos.map((turno) => (
              <div key={turno.id} className="flex items-center justify-between p-4 bg-admin-background border border-admin-border-light rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-admin-text-primary">{turno.numeroTurno}</p>
                    <p className="text-sm text-admin-text-muted">{turno.sucursal}</p>
                  </div>
                  <div>
                    <Badge className={getEstadoTurnoColor(turno.estado)}>
                      {turno.estado}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-admin-text-primary">Espera: {turno.tiempoEspera}</p>
                  <p className="text-xs text-admin-text-muted">{turno.fechaHora}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriaDetalles;