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

const SucursalConfiguracion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "Sucursal Centro",
    descripcion: "Sucursal principal ubicada en el centro histórico de Quito, atiende principalmente trámites administrativos y consultas generales.",
    direccion: "Av. 10 de Agosto 123, Quito, Pichincha",
    horarioApertura: "08:00",
    horarioCierre: "17:00",
    estado: "Activa",
    capacidadMaxima: "50",
    tiempoPromedioAtencion: "15",
    notificacionesEmail: true,
    notificacionesSMS: false,
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
        description: "El nombre de la sucursal es requerido",
        variant: "destructive"
      });
      return;
    }

    if (!formData.direccion.trim()) {
      toast({
        title: "Error",
        description: "La dirección es requerida",
        variant: "destructive"
      });
      return;
    }

    // Simular guardado
    toast({
      title: "Éxito",
      description: "Configuración de la sucursal actualizada exitosamente",
    });
  };

  const handleDelete = () => {
    if (window.confirm("¿Está seguro de que desea eliminar esta sucursal? Esta acción no se puede deshacer.")) {
      toast({
        title: "Sucursal Eliminada",
        description: "La sucursal ha sido eliminada exitosamente",
      });
      navigate('/sucursales');
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
            onClick={() => navigate(`/sucursales/${id}/detalles`)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Detalles
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-admin-text-primary">Configurar Sucursal</h1>
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
                <Label htmlFor="nombre">Nombre de la Sucursal *</Label>
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
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                required
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioApertura">Horario de Apertura *</Label>
                <Input
                  id="horarioApertura"
                  type="time"
                  value={formData.horarioApertura}
                  onChange={(e) => handleInputChange('horarioApertura', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioCierre">Horario de Cierre *</Label>
                <Input
                  id="horarioCierre"
                  type="time"
                  value={formData.horarioCierre}
                  onChange={(e) => handleInputChange('horarioCierre', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración Operativa */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Configuración Operativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidadMaxima">Capacidad Máxima (personas)</Label>
                <Input
                  id="capacidadMaxima"
                  type="number"
                  min="1"
                  value={formData.capacidadMaxima}
                  onChange={(e) => handleInputChange('capacidadMaxima', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempoPromedioAtencion">Tiempo Promedio de Atención (minutos)</Label>
                <Input
                  id="tiempoPromedioAtencion"
                  type="number"
                  min="1"
                  value={formData.tiempoPromedioAtencion}
                  onChange={(e) => handleInputChange('tiempoPromedioAtencion', e.target.value)}
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
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-admin-text-muted">
                  Recibir alertas y reportes por correo electrónico
                </p>
              </div>
              <Switch
                checked={formData.notificacionesEmail}
                onCheckedChange={(checked) => handleInputChange('notificacionesEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por SMS</Label>
                <p className="text-sm text-admin-text-muted">
                  Recibir alertas críticas por mensaje de texto
                </p>
              </div>
              <Switch
                checked={formData.notificacionesSMS}
                onCheckedChange={(checked) => handleInputChange('notificacionesSMS', checked)}
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
                  Activar para pausar operaciones temporalmente
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
                <h4 className="font-medium text-admin-text-primary">Eliminar Sucursal</h4>
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
            onClick={() => navigate(`/sucursales/${id}/detalles`)}
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

export default SucursalConfiguracion;