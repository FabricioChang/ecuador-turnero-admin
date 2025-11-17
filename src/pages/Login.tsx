import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Iniciar Sesión - Sistema Turnero";
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/"); // Redirige al Dashboard (prototipo)
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm" htmlFor="username">Usuario</label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tu usuario" />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="password">Contraseña</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />
            </div>
            <Button type="submit" className="w-full">Iniciar Sesión</Button>
          </form>

          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="underline underline-offset-4">Regístrate</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
