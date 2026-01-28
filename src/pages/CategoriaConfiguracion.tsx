import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2, Tag, Clock, Settings } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";
import { useUpdateCategoria, useDeleteCategoria } from "@/hooks/useCategoriasMutations";

const CategoriaConfiguracion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: categorias = [] } = useCategorias();
  const updateCategoria = useUpdateCategoria();
  const deleteCategoria = useDeleteCategoria();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    prioridad: "regular",
    activo: true,
    tiempoReagendamiento: "30",
    limiteReagendamientos: "3",
    notificacionesAutomaticas: true,
    alertasAdministrativas: false
  });

  useEffect(() => {
    const categoria = categorias.find((c: any) => c.id === id);
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || "",
        prioridad: categoria.prioridad || "regular",
        activo: categoria.activo ?? true,
        tiempoReagendamiento: (categoria.tiempo_reagendamiento_min || 30).toString(),
        limiteReagendamientos: (categoria.limite_reagendamientos || 3).toString(),
        notificacionesAutomaticas: categoria.notificaciones_automaticas ?? true,
        alertasAdministrativas: categoria.alertas_administrativas ?? false
      });
    }
  }, [categorias, id]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast({ title: "Error", description: "El nombre de la categoría es requerido", variant: "destructive" });
      return;
    }

    if (!id) return;

    await updateCategoria.mutateAsync({
      id,
      nombre: formData.nombre,
      descripcion: formData.descripcion || undefined,
      prioridad: formData.prioridad as 'regular' | 'preferente',
      activo: formData.activo,
      tiempo_reagendamiento_min: parseInt(formData.tiempoReagendamiento) || 30,
      limite_reagendamientos: parseInt(formData.limiteReagendamientos) || 3,
      notificaciones_automaticas: formData.notificacionesAutomaticas,
      alertas_administrativas: formData.alertasAdministrativas
    });
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("¿Está seguro de que desea eliminar esta categoría?")) {
      await deleteCategoria.mutateAsync(id);
      navigate('/categorias');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(`/categorias/${id}/detalles`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />Volver a Detalles
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-admin-text-primary">Configurar Categoría</h1>
            <p className="text-admin-text-secondary">Editar configuración y parámetros</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-admin-text-primary">
              <Tag className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Categoría *</Label>
                <Input id="nombre" value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={formData.prioridad} onValueChange={(value) => handleInputChange('prioridad', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preferente">Preferente</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" value={formData.descripcion} onChange={(e) => handleInputChange('descripcion', e.target.value)} rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Estado</Label>
                <p className="text-sm text-admin-text-muted">
                  Activar o desactivar esta categoría
                </p>
              </div>
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => handleInputChange('activo', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Reagendamiento */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-admin-text-primary">
              <Clock className="h-5 w-5" />
              Configuración de Reagendamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tiempoReagendamiento">Tiempo de Reagendamiento (minutos) *</Label>
                <Input
                  id="tiempoReagendamiento"
                  type="number"
                  min="1"
                  max="180"
                  value={formData.tiempoReagendamiento}
                  onChange={(e) => handleInputChange('tiempoReagendamiento', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limiteReagendamientos">Límite de Reagendamientos</Label>
                <Input
                  id="limiteReagendamientos"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.limiteReagendamientos}
                  onChange={(e) => handleInputChange('limiteReagendamientos', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-admin-text-primary">
              <Settings className="h-5 w-5" />
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones Automáticas</Label>
                <p className="text-sm text-admin-text-muted">
                  Enviar notificaciones automáticas a usuarios sobre el estado de sus turnos
                </p>
              </div>
              <Switch
                checked={formData.notificacionesAutomaticas}
                onCheckedChange={(checked) => handleInputChange('notificacionesAutomaticas', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas Administrativas</Label>
                <p className="text-sm text-admin-text-muted">
                  Recibir alertas cuando los tiempos de espera excedan los límites establecidos
                </p>
              </div>
              <Switch
                checked={formData.alertasAdministrativas}
                onCheckedChange={(checked) => handleInputChange('alertasAdministrativas', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Zona de Peligro */}
        <Card className="bg-admin-surface border-red-200">
          <CardHeader><CardTitle className="text-red-600">Zona de Peligro</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-admin-text-primary">Eliminar Categoría</h4>
                <p className="text-sm text-admin-text-muted">Una vez eliminada, toda la información será removida permanentemente.</p>
              </div>
              <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" />Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/categorias/${id}/detalles`)}>Cancelar</Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaConfiguracion;
