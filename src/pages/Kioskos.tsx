import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Monitor, Wifi, Battery } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Kioskos = () => {
  const navigate = useNavigate();
  const kioskos = [
    {
      id: "K-001",
      nombre: "Kiosko Principal Centro",
      sucursal: "Sucursal Centro",
      estado: "Operativo",
      conexion: "Excelente",
      bateria: 95,
      ultimaActividad: "Hace 2 min"
    },
    {
      id: "K-002",
      nombre: "Kiosko Secundario Centro",
      sucursal: "Sucursal Centro",
      estado: "Operativo",
      conexion: "Buena",
      bateria: 78,
      ultimaActividad: "Hace 5 min"
    },
    {
      id: "K-003",
      nombre: "Kiosko Norte A",
      sucursal: "Sucursal Norte",
      estado: "Mantenimiento",
      conexion: "Sin conexión",
      bateria: 0,
      ultimaActividad: "Hace 2 horas"
    },
    {
      id: "K-004",
      nombre: "Kiosko Sur Principal",
      sucursal: "Sucursal Sur",
      estado: "Operativo",
      conexion: "Regular",
      bateria: 45,
      ultimaActividad: "Hace 1 min"
    }
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kioskos.map((kiosko) => (
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