import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Configuracion = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("Administrador");
  const [email, setEmail] = useState("admin@empresa.com");
  const [password, setPassword] = useState("••••••••");

  useEffect(() => {
    document.title = "Configuración - Perfil de Administrador";
  }, []);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Perfil actualizado", description: "Los cambios se han guardado (prototipo)." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Configuración</h1>
          <p className="text-admin-text-secondary">Gestiona tu perfil de administrador</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/login")}>
          Cerrar sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Nombre</span>
                <span className="text-admin-text-primary font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Correo</span>
                <span className="text-admin-text-primary font-medium">{email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Editar perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-admin-text-secondary">Nombre</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-admin-text-secondary">Correo</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-admin-text-secondary">Contraseña</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Guardar cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracion;
