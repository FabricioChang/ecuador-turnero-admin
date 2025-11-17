import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useUsuarioRoles } from "@/hooks/useUsuarioRoles";

const Configuracion = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  const [profile, setProfile] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    cedula: "",
    identificador: "",
    provincia: "",
    canton: "",
  });

  const { data: rolesData = [] } = useUsuarioRoles(userId);
  
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
  });

  useEffect(() => {
    document.title = "Configuración - Perfil de Administrador";
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select(`
          *,
          provincia:provincias(nombre),
          canton:cantones(nombre)
        `)
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (profileData) {
        setProfile({
          nombres: profileData.nombres || "",
          apellidos: profileData.apellidos || "",
          email: profileData.email || "",
          telefono: profileData.telefono || "",
          cedula: profileData.cedula || "",
          identificador: profileData.identificador || "",
          provincia: profileData.provincia?.nombre || "",
          canton: profileData.canton?.nombre || "",
        });
        
        setFormData({
          nombres: profileData.nombres || "",
          apellidos: profileData.apellidos || "",
          email: profileData.email || "",
          telefono: profileData.telefono || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "No se encontró el usuario",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({ 
        title: "Perfil actualizado", 
        description: "Los cambios se han guardado correctamente." 
      });
      
      loadUserProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
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
        <Button variant="outline" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Información del Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Identificador</span>
                <span className="text-admin-text-primary font-medium">{profile.identificador}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Nombre Completo</span>
                <span className="text-admin-text-primary font-medium">{profile.nombres} {profile.apellidos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Correo</span>
                <span className="text-admin-text-primary font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Cédula</span>
                <span className="text-admin-text-primary font-medium">{profile.cedula || "No especificada"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Teléfono</span>
                <span className="text-admin-text-primary font-medium">{profile.telefono || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Ubicación</span>
                <span className="text-admin-text-primary font-medium">
                  {profile.provincia && profile.canton 
                    ? `${profile.canton}, ${profile.provincia}` 
                    : "No especificada"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-admin-text-secondary">Roles</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {rolesData.length > 0 ? (
                    rolesData.map((r: any) => (
                      <Badge key={r.id} variant="secondary" className="capitalize">
                        {r.role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-admin-text-muted text-xs">Sin roles asignados</span>
                  )}
                </div>
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
                <label htmlFor="nombres" className="text-sm text-admin-text-secondary">Nombres</label>
                <Input 
                  id="nombres" 
                  value={formData.nombres} 
                  onChange={(e) => setFormData(prev => ({ ...prev, nombres: e.target.value }))}
                  className="bg-admin-background border-admin-border-light"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellidos" className="text-sm text-admin-text-secondary">Apellidos</label>
                <Input 
                  id="apellidos" 
                  value={formData.apellidos} 
                  onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                  className="bg-admin-background border-admin-border-light"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-admin-text-secondary">Correo</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="bg-admin-background border-admin-border-light opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-admin-text-muted">El correo no puede ser modificado</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="telefono" className="text-sm text-admin-text-secondary">Teléfono</label>
                <Input 
                  id="telefono" 
                  value={formData.telefono} 
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="0999999999"
                  className="bg-admin-background border-admin-border-light"
                />
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
