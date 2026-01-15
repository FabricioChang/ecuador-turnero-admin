import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useCuentas } from "@/hooks/useCuentas";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Cuenta, UsuarioAdmin, MiembroCuenta } from "@/types/database";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCuenta, setUsuario, setMiembro, cuenta: cuentaActiva, usuario: usuarioActivo } = useCuenta();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);
  const [openCuentas, setOpenCuentas] = useState(false);
  const [searchCuenta, setSearchCuenta] = useState("");

  const { data: cuentas = [], isLoading: loadingCuentas } = useCuentas(searchCuenta);

  useEffect(() => { document.title = "Iniciar Sesión - Sistema Turnero"; }, []);

  useEffect(() => {
    if (cuentaActiva && usuarioActivo) navigate("/");
  }, [cuentaActiva, usuarioActivo, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCuenta) {
      toast({ title: "Selecciona una cuenta", description: "Debes seleccionar la cuenta al que deseas acceder.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { data: usuarioData, error: usuarioError } = await (supabaseExternal as any)
        .from("usuario_admin").select("*").eq("email", email).maybeSingle();

      if (usuarioError) throw usuarioError;
      if (!usuarioData) throw new Error("No existe un usuario con ese email");

      const { data: miembroData, error: miembroError } = await (supabaseExternal as any)
        .from("miembro_cuenta").select("*").eq("usuario_id", usuarioData.id).eq("cuenta_id", selectedCuenta.id).eq("estado", "activo").maybeSingle();

      if (miembroError) throw miembroError;
      if (!miembroData) throw new Error("No tienes acceso a esta cuenta.");

      setCuenta(selectedCuenta);
      setUsuario(usuarioData as UsuarioAdmin);
      setMiembro(miembroData as MiembroCuenta);

      toast({ title: "¡Bienvenido!", description: `Has iniciado sesión en ${selectedCuenta.nombre}` });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error al iniciar sesión", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Sistema Turnero</CardTitle>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder al panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Cuenta (Negocio)</Label>
              <Popover open={openCuentas} onOpenChange={setOpenCuentas}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedCuenta ? <span className="flex items-center gap-2"><Building2 className="h-4 w-4" />{selectedCuenta.nombre}</span> : <span className="text-muted-foreground">Selecciona una cuenta...</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar cuenta..." value={searchCuenta} onValueChange={setSearchCuenta} />
                    <CommandList>
                      <CommandEmpty>{loadingCuentas ? "Buscando..." : "No se encontraron cuentas."}</CommandEmpty>
                      <CommandGroup>
                        {cuentas.map((cuenta: any) => (
                          <CommandItem key={cuenta.id} value={cuenta.nombre} onSelect={() => { setSelectedCuenta(cuenta); setOpenCuentas(false); }}>
                            <Check className={cn("mr-2 h-4 w-4", selectedCuenta?.id === cuenta.id ? "opacity-100" : "opacity-0")} />
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />{cuenta.nombre}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !selectedCuenta}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
