import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const CategoriaConfiguracion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "Consultas Generales",
    descripcion: "Categoría para atención de consultas generales y solicitudes de información básica sobre servicios y trámites.",
    prioridad: "Media",
    tiempoEsperaEstimado: "15",
    tiempoReagendamiento: "30",
    estado: "Activa",
    limiteReagendamientos: "3",
    notificacionesAutomaticas: true,
    alertasAdministrativas: false,
    modoMantenimiento: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido",
        variant: "destructive"
      });
      return;
    }

    if (!formData.tiempoEsperaEstimado || parseInt(formData.tiempoEsperaEstimado) <= 0) {
      toast({
        title: "Error",
        description: "El tiempo de espera estimado debe ser mayor a 0",
        variant: "destructive"
      });
      return;
    }

    if (!formData.tiempoReagendamiento || parseInt(formData.tiempoReagendamiento) <= 0) {
      toast({
        title: "Error",
        description: "El tiempo de reagendamiento debe ser mayor a 0",
        variant: "destructive"
      });
      return;
    }

    // Simular guardado
    toast({
      title: "Éxito",
      description: "Configuración de la categoría actualizada exitosamente",
    });
  };

  const handleDelete = () => {
    if (window.confirm("¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.")) {
      toast({
        title: "Categoría Eliminada",
        description: "La categoría ha sido eliminada exitosamente",
      });
      navigate('/categorias');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/categorias/${id}/detalles`)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Detalles
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
            <CardTitle className="text-admin-text-primary">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Categoría *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Mantenimiento">En Mantenimiento</SelectItem>
                    <SelectItem value="Inactiva">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad *</Label>
                <Select value={formData.prioridad} onValueChange={(value) => handleInputChange('prioridad', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempoEsperaEstimado">Tiempo de Espera Estimado (min) *</Label>
                <Input
                  id="tiempoEsperaEstimado"
                  type="number"
                  min="1"
                  value={formData.tiempoEsperaEstimado}
                  onChange={(e) => handleInputChange('tiempoEsperaEstimado', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempoReagendamiento">Tiempo de Reagendamiento (min) *</Label>
                <Input
                  id="tiempoReagendamiento"
                  type="number"
                  min="1"
                  value={formData.tiempoReagendamiento}
                  onChange={(e) => handleInputChange('tiempoReagendamiento', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Turnos */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Configuración de Turnos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <CardTitle className="text-admin-text-primary">Notificaciones</CardTitle>
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
                  Recibir alertas cuando los tiempos de espera excedan los límites
                </p>
              </div>
              <Switch
                checked={formData.alertasAdministrativas}
                onCheckedChange={(checked) => handleInputChange('alertasAdministrativas', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración Avanzada */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Configuración Avanzada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Mantenimiento</Label>
                <p className="text-sm text-admin-text-muted">
                  Pausar temporalmente la asignación de nuevos turnos para esta categoría
                </p>
              </div>
              <Switch
                checked={formData.modoMantenimiento}
                onCheckedChange={(checked) => handleInputChange('modoMantenimiento', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Zona de Peligro */}
        <Card className="bg-admin-surface border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-admin-text-primary">Eliminar Categoría</h4>
                <p className="text-sm text-admin-text-muted">
                  Una vez eliminada, toda la información será removida permanentemente.
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/categorias/${id}/detalles`)}
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaConfiguracion;