import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Building2, Users, Clock } from "lucide-react";
import { useKioskos } from "@/hooks/useKioskos";
import { useSucursales } from "@/hooks/useSucursales";
import { useTurnos } from "@/hooks/useTurnos";
import { useCuenta } from "@/contexts/CuentaContext";

const Dashboard = () => {
  const { cuenta } = useCuenta();
  const { data: kioskosData = [] } = useKioskos();
  const { data: sucursalesData = [] } = useSucursales();
  const { data: turnosData = [] } = useTurnos();

  const kioskosActivos = kioskosData.filter((k) => k.estado === "activo").length;
  const kioskosMantenimiento = kioskosData.filter((k) => k.estado === "inactivo").length;
  const sucursalesActivas = sucursalesData.filter((s) => s.estado === "activo").length;
  
  const hoy = new Date().toISOString().split('T')[0];
  const turnosHoy = turnosData.filter((t) => t.emitido_dia === hoy);
  const turnosCompletadosHoy = turnosHoy.filter((t) => t.estado === "atendido").length;
  const turnosEnEspera = turnosData.filter((t) => t.estado === "emitido" || t.estado === "llamado").length;
  
  const tiemposEspera = turnosHoy.filter((t) => t.tiempo_espera !== null).map((t) => t.tiempo_espera as number);
  const tiempoPromedio = tiemposEspera.length > 0 ? Math.round(tiemposEspera.reduce((a, b) => a + b, 0) / tiemposEspera.length / 60) : 0;

  const stats = [
    {
      title: "Kioskos Activos",
      value: kioskosActivos.toString(),
      icon: Monitor,
      description: `${kioskosMantenimiento} inactivos`
    },
    {
      title: "Sucursales",
      value: sucursalesActivas.toString(),
      icon: Building2,
      description: "Operativas"
    },
    {
      title: "En Espera",
      value: turnosEnEspera.toString(),
      icon: Users,
      description: `Tiempo promedio: ${tiempoPromedio} min`
    },
    {
      title: "Turnos Hoy",
      value: turnosHoy.length.toString(),
      icon: Clock,
      description: `${turnosCompletadosHoy} completados`
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-admin-text-primary">Dashboard</h1>
        <p className="text-admin-text-secondary">
          {cuenta ? `Cuenta: ${cuenta.nombre}` : "Vista general del sistema turnero"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-admin-surface border-admin-border-light">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-admin-text-secondary">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-admin-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-admin-text-primary">{stat.value}</div>
              <p className="text-xs text-admin-text-muted">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {turnosData.slice(0, 5).map((turno, index) => {
                const fecha = new Date(turno.emitido_en);
                const tiempo = fecha.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
                const estadoLabel = turno.estado === "atendido" ? "completado" : turno.estado;
                return (
                  <div key={turno.id} className="flex items-center space-x-4 text-sm">
                    <span className="text-xs text-admin-text-muted w-12">{tiempo}</span>
                    <div className="flex-1">
                      <p className="text-admin-text-primary">Turno {estadoLabel} #{turno.codigo}</p>
                      <p className="text-admin-text-muted">{turno.sucursal?.nombre || "Sin sucursal"}</p>
                    </div>
                  </div>
                );
              })}
              {turnosData.length === 0 && (
                <p className="text-admin-text-muted text-center py-4">No hay actividad reciente</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Sucursales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sucursalesData.slice(0, 5).map((sucursal) => (
                <div key={sucursal.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-admin-text-primary font-medium">{sucursal.nombre}</p>
                    <p className="text-admin-text-muted text-sm">{sucursal.ciudad}, {sucursal.provincia}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    sucursal.estado === "activo" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {sucursal.estado}
                  </span>
                </div>
              ))}
              {sucursalesData.length === 0 && (
                <p className="text-admin-text-muted text-center py-4">No hay sucursales registradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
