import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Building2, Users, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Kioskos Activos",
      value: "12",
      icon: Monitor,
      description: "3 en mantenimiento"
    },
    {
      title: "Sucursales",
      value: "8",
      icon: Building2,
      description: "Todas operativas"
    },
    {
      title: "Usuarios en Espera",
      value: "47",
      icon: Users,
      description: "Tiempo promedio: 15 min"
    },
    {
      title: "Turnos Hoy",
      value: "234",
      icon: Clock,
      description: "156 completados"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-admin-text-primary">Dashboard</h1>
        <p className="text-admin-text-secondary">Vista general del sistema turnero</p>
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
              {[
                { time: "10:45", action: "Kiosko K-003 reiniciado", location: "Sucursal Centro" },
                { time: "10:32", action: "Nuevo usuario registrado", location: "Kiosko K-001" },
                { time: "10:28", action: "Turno completado #A-234", location: "Sucursal Norte" },
                { time: "10:15", action: "Pantalla P-005 actualizada", location: "Sucursal Sur" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 text-sm">
                  <span className="text-xs text-admin-text-muted w-12">{activity.time}</span>
                  <div className="flex-1">
                    <p className="text-admin-text-primary">{activity.action}</p>
                    <p className="text-admin-text-muted">{activity.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { component: "Servidor Principal", status: "Operativo", color: "text-green-600" },
                { component: "Base de Datos", status: "Operativo", color: "text-green-600" },
                { component: "Red Kioskos", status: "Operativo", color: "text-green-600" },
                { component: "Sistema Notificaciones", status: "En mantenimiento", color: "text-yellow-600" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-admin-text-primary">{item.component}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;