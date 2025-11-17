import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { z } from "zod";

const registroSchema = z.object({
  nombres: z.string()
    .trim()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los nombres solo pueden contener letras"),
  apellidos: z.string()
    .trim()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los apellidos solo pueden contener letras"),
  cedula: z.string()
    .trim()
    .length(10, "La cédula debe tener 10 dígitos")
    .regex(/^\d+$/, "La cédula solo puede contener números"),
  email: z.string()
    .trim()
    .email("Ingresa un email válido")
    .max(255, "El email no puede exceder 255 caracteres"),
  telefono: z.string()
    .trim()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "El teléfono solo puede contener números y símbolos válidos"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const Registro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: provincias = [] } = useProvincias();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provinciaId, setProvinciaId] = useState("");
  const [cantonId, setCantonId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: cantones = [] } = useCantones(provinciaId || undefined);

  useEffect(() => {
    document.title = "Registro - Sistema Turnero";
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validar datos del formulario
    const formData = {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      password,
      confirmPassword,
    };

    const validation = registroSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nombres,
            apellidos,
            cedula,
            telefono,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Redirigiendo al dashboard...",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error al crear tu cuenta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl">Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="nombres">Nombres *</label>
                <Input 
                  id="nombres" 
                  value={nombres} 
                  onChange={(e) => setNombres(e.target.value)} 
                  placeholder="Ej: Juan Carlos"
                  className={errors.nombres ? "border-destructive" : ""}
                />
                {errors.nombres && <p className="text-xs text-destructive">{errors.nombres}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="apellidos">Apellidos *</label>
                <Input 
                  id="apellidos" 
                  value={apellidos} 
                  onChange={(e) => setApellidos(e.target.value)} 
                  placeholder="Ej: Pérez González"
                  className={errors.apellidos ? "border-destructive" : ""}
                />
                {errors.apellidos && <p className="text-xs text-destructive">{errors.apellidos}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="cedula">Cédula *</label>
                <Input 
                  id="cedula" 
                  value={cedula} 
                  onChange={(e) => setCedula(e.target.value)} 
                  placeholder="0123456789"
                  maxLength={10}
                  className={errors.cedula ? "border-destructive" : ""}
                />
                {errors.cedula && <p className="text-xs text-destructive">{errors.cedula}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="telefono">Teléfono *</label>
                <Input 
                  id="telefono" 
                  value={telefono} 
                  onChange={(e) => setTelefono(e.target.value)} 
                  placeholder="0987654321"
                  className={errors.telefono ? "border-destructive" : ""}
                />
                {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email *</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="tu@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="provincia">Provincia</label>
                <Select value={provinciaId} onValueChange={(value) => {
                  setProvinciaId(value);
                  setCantonId("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="canton">Cantón</label>
                <Select value={cantonId} onValueChange={setCantonId} disabled={!provinciaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cantón" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantones.map((canton) => (
                      <SelectItem key={canton.id} value={canton.id}>
                        {canton.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Contraseña *</label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Mínimo 6 caracteres"
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">Confirmar Contraseña *</label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Repite tu contraseña"
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">* Campos obligatorios</p>
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
