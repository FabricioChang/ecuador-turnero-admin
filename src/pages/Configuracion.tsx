import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCuenta } from "@/contexts/CuentaContext";
import { Badge } from "@/components/ui/badge";

const Configuracion = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { usuario, cuenta, clearSession } = useCuenta();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });

  useEffect(() => {
    document.title = "Configuración - Perfil de Administrador";
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
      });
    }
  }, [usuario]);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-admin-text-muted">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Configuración</h1>
          <p className="text-admin-text-secondary">Gestiona tu perfil de usuario</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader><CardTitle className="text-admin-text-primary">Información del Perfil</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Nombre</span>
                <span className="text-admin-text-primary font-medium">{usuario.nombre || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Correo</span>
                <span className="text-admin-text-primary font-medium">{usuario.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Cuenta Activa</span>
                <span className="text-admin-text-primary font-medium">{cuenta?.nombre || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-admin-text-secondary">Super Admin</span>
                <Badge variant={usuario.super_admin ? "default" : "secondary"}>
                  {usuario.super_admin ? "Sí" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader><CardTitle className="text-admin-text-primary">Editar perfil</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm text-admin-text-secondary">Nombre</label>
                <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))} className="bg-admin-background border-admin-border-light" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-admin-text-secondary">Correo</label>
                <Input id="email" type="email" value={formData.email} disabled className="bg-admin-background border-admin-border-light opacity-60 cursor-not-allowed" />
                <p className="text-xs text-admin-text-muted">El correo no puede ser modificado</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: "Guardado", description: "Perfil actualizado" })}>Guardar cambios</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracion;
