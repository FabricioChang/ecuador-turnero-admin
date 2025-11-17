import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useSucursales } from "@/hooks/useSucursales";
import { useUpdateSucursal, useDeleteSucursal } from "@/hooks/useSucursalesMutations";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { AddressInput } from "@/components/AddressInput";
import { useRegiones } from "@/hooks/useRegiones";

const SucursalConfiguracion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: sucursales = [] } = useSucursales();
  const updateSucursal = useUpdateSucursal();
  const deleteSucursal = useDeleteSucursal();
  
  const [formData, setFormData] = useState({
    nombre: "",
    provincia_id: "",
    canton_id: "",
    direccion: "",
    email: "",
    telefono_sms: "",
    capacidad_maxima: "",
    estado: "activo",
  });
  
  const [selectedRegion, setSelectedRegion] = useState("");

  const provincias = useProvincias();
  const cantones = useCantones(formData.provincia_id);
  const { regiones } = useRegiones();

  const sucursal = sucursales.find((s: any) => s.id === id);

  useEffect(() => {
    if (sucursal) {
      setFormData({
        nombre: sucursal.nombre,
        provincia_id: sucursal.provincia_id,
        canton_id: sucursal.canton_id,
        direccion: sucursal.direccion || "",
        email: (sucursal as any).email || "",
        telefono_sms: (sucursal as any).telefono_sms || "",
        capacidad_maxima: (sucursal as any).capacidad_maxima?.toString() || "",
        estado: sucursal.estado,
      });
      
      // Detectar región basada en la provincia
      if (sucursal.provincia_id && provincias.data) {
        const provincia = provincias.data.find(p => p.id === sucursal.provincia_id);
        if (provincia && regiones) {
          const region = regiones.find(r => 
            r.provincias.some(p => p.toLowerCase() === provincia.nombre.toLowerCase())
          );
          if (region) {
            setSelectedRegion(region.nombre);
          }
        }
      }
    }
  }, [sucursal, provincias.data, regiones]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.provincia_id || !formData.canton_id) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateSucursal.mutateAsync({
        id: id!,
        nombre: formData.nombre,
        provincia_id: formData.provincia_id,
        canton_id: formData.canton_id,
        direccion: formData.direccion || null,
        email: formData.email || null,
        telefono_sms: formData.telefono_sms || null,
        capacidad_maxima: formData.capacidad_maxima ? parseInt(formData.capacidad_maxima) : null,
        estado: formData.estado,
      });

      toast({
        title: "Éxito",
        description: "La sucursal ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar sucursal:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm("¿Está seguro de que desea eliminar esta sucursal? Esta acción no se puede deshacer.")) {
      try {
        await deleteSucursal.mutateAsync(id);
        navigate('/sucursales');
      } catch (error) {
        console.error("Error al eliminar sucursal:", error);
      }
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Detalles
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configuración de Sucursal</h1>
            <p className="text-muted-foreground">{formData.nombre}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Sucursal *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Sucursal Centro"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Región</Label>
                  <Input
                    id="region"
                    value={selectedRegion}
                    readOnly
                    disabled
                    placeholder="Se detectará automáticamente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia_id">Provincia *</Label>
                  <Select
                    value={formData.provincia_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, provincia_id: value, canton_id: "" })
                    }
                  >
                    <SelectTrigger id="provincia_id">
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provincias.data?.map((provincia) => (
                        <SelectItem key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canton_id">Cantón *</Label>
                  <Select
                    value={formData.canton_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, canton_id: value })
                    }
                    disabled={!formData.provincia_id}
                  >
                    <SelectTrigger id="canton_id">
                      <SelectValue placeholder="Seleccionar cantón" />
                    </SelectTrigger>
                    <SelectContent>
                      {cantones.data?.map((canton) => (
                        <SelectItem key={canton.id} value={canton.id}>
                          {canton.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <AddressInput
                  id="direccion"
                  value={formData.direccion}
                  onChange={(value) =>
                    setFormData({ ...formData, direccion: value })
                  }
                  placeholder="Ingrese la dirección"
                  provincias={provincias.data || []}
                  cantones={cantones.data || []}
                  regiones={regiones}
                  onProvinciaChange={(provinciaId) => 
                    setFormData({ ...formData, provincia_id: provinciaId, canton_id: "" })
                  }
                  onCantonChange={(cantonId) =>
                    setFormData({ ...formData, canton_id: cantonId })
                  }
                  onRegionChange={(regionNombre) =>
                    setSelectedRegion(regionNombre)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad_maxima">Capacidad Máxima</Label>
                <Input
                  id="capacidad_maxima"
                  type="number"
                  value={formData.capacidad_maxima}
                  onChange={handleInputChange}
                  placeholder="Ej: 100"
                />
                <p className="text-sm text-muted-foreground">
                  Número máximo de personas que pueden estar en espera
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) =>
                    setFormData({ ...formData, estado: value })
                  }
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notificaciones</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email para Notificaciones</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                />
                <p className="text-sm text-muted-foreground">
                  Recibir alertas y actualizaciones por correo electrónico
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono_sms">Teléfono para SMS</Label>
                <Input
                  id="telefono_sms"
                  type="tel"
                  value={formData.telefono_sms}
                  onChange={handleInputChange}
                  placeholder="+593 99 999 9999"
                />
                <p className="text-sm text-muted-foreground">
                  Recibir alertas urgentes por mensaje de texto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zona de Peligro */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Eliminar Sucursal</h4>
                <p className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/sucursales/${id}/detalles`)}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SucursalConfiguracion;
