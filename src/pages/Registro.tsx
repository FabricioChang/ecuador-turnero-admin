import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Registro = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Registro - Sistema Turnero";
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototipo: tras registrarse, enviar al login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl">Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm" htmlFor="name">Nombre</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="username">Usuario</label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Elige un usuario" />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="password">Contraseña</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crea una contraseña" />
            </div>
            <Button type="submit" className="w-full">Registrarse</Button>
          </form>

          <div className="mt-4 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="underline underline-offset-4">Inicia sesión</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;
