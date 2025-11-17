import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Tag, Clock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const NuevaCategoria = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    prioridad: "",
    tiempoEsperaEstimado: "",
    tiempoReagendamiento: "",
    limiteReagendamientos: "3",
    notificacionesAutomaticas: true,
    alertasAdministrativas: false
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

    if (!formData.prioridad) {
      toast({
        title: "Error",
        description: "La prioridad es requerida",
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
      description: `Categoría "${formData.nombre}" creada exitosamente`,
    });

    // Regresar a la lista
    navigate('/categorias');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/categorias')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Nueva Categoría</h1>
          <p className="text-admin-text-secondary">Crear una nueva categoría de atención</p>
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
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Ej: Consultas Generales"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad *</Label>
                <Select value={formData.prioridad} onValueChange={(value) => handleInputChange('prioridad', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
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
                placeholder="Descripción de la categoría de atención..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Tiempos */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-admin-text-primary">
              <Clock className="h-5 w-5" />
              Configuración de Tiempos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tiempoEsperaEstimado">Tiempo de Espera Estimado (minutos) *</Label>
                <Input
                  id="tiempoEsperaEstimado"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.tiempoEsperaEstimado}
                  onChange={(e) => handleInputChange('tiempoEsperaEstimado', e.target.value)}
                  placeholder="15"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempoReagendamiento">Tiempo de Reagendamiento (minutos) *</Label>
                <Input
                  id="tiempoReagendamiento"
                  type="number"
                  min="1"
                  max="180"
                  value={formData.tiempoReagendamiento}
                  onChange={(e) => handleInputChange('tiempoReagendamiento', e.target.value)}
                  placeholder="30"
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
                  placeholder="3"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Información sobre tiempos</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Tiempo de Espera Estimado:</strong> Tiempo promedio que un usuario esperará para ser atendido</li>
                <li>• <strong>Tiempo de Reagendamiento:</strong> Tiempo mínimo que debe esperar un usuario para reagendar su turno</li>
                <li>• <strong>Límite de Reagendamientos:</strong> Número máximo de veces que un usuario puede reagendar</li>
              </ul>
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

        {/* Resumen de Configuración */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Resumen de Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-admin-text-muted">Nombre:</span>
                <p className="font-medium text-admin-text-primary">{formData.nombre || "Sin especificar"}</p>
              </div>
              <div>
                <span className="text-admin-text-muted">Prioridad:</span>
                <p className="font-medium text-admin-text-primary">{formData.prioridad || "Sin especificar"}</p>
              </div>
              <div>
                <span className="text-admin-text-muted">Tiempo de Espera:</span>
                <p className="font-medium text-admin-text-primary">
                  {formData.tiempoEsperaEstimado ? `${formData.tiempoEsperaEstimado} min` : "Sin especificar"}
                </p>
              </div>
              <div>
                <span className="text-admin-text-muted">Reagendamiento:</span>
                <p className="font-medium text-admin-text-primary">
                  {formData.tiempoReagendamiento ? `${formData.tiempoReagendamiento} min` : "Sin especificar"}
                </p>
              </div>
              <div>
                <span className="text-admin-text-muted">Límite Reagendamientos:</span>
                <p className="font-medium text-admin-text-primary">{formData.limiteReagendamientos}</p>
              </div>
              <div>
                <span className="text-admin-text-muted">Notificaciones:</span>
                <p className="font-medium text-admin-text-primary">
                  {formData.notificacionesAutomaticas ? "Activadas" : "Desactivadas"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/categorias')}
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Crear Categoría
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevaCategoria;