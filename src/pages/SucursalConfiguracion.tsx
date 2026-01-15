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

const SucursalConfiguracion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: sucursales = [] } = useSucursales();
  const updateSucursal = useUpdateSucursal();
  const deleteSucursal = useDeleteSucursal();
  
  const [formData, setFormData] = useState({
    nombre: "",
    region: "",
    provincia: "",
    ciudad: "",
    direccion: "",
    estado: "activo",
  });

  const sucursal = sucursales.find((s: any) => s.id === id);

  useEffect(() => {
    if (sucursal) {
      setFormData({
        nombre: sucursal.nombre,
        region: sucursal.region || "",
        provincia: sucursal.provincia || "",
        ciudad: sucursal.ciudad || "",
        direccion: sucursal.direccion || "",
        estado: sucursal.estado,
      });
    }
  }, [sucursal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      toast({ title: "Error", description: "Por favor complete todos los campos requeridos", variant: "destructive" });
      return;
    }
    try {
      await updateSucursal.mutateAsync({ id: id!, ...formData });
      toast({ title: "Éxito", description: "La sucursal ha sido actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar sucursal:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("¿Está seguro de que desea eliminar esta sucursal?")) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(`/sucursales/${id}/detalles`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />Volver a Detalles
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configuración de Sucursal</h1>
            <p className="text-muted-foreground">{formData.nombre}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Configuración General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Sucursal *</Label>
              <Input id="nombre" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Región</Label>
                <Input id="region" value={formData.region} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia</Label>
                <Input id="provincia" value={formData.provincia} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input id="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" value={formData.direccion} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger id="estado"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader><CardTitle className="text-destructive">Zona de Peligro</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Eliminar Sucursal</h4>
                <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer</p>
              </div>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/sucursales/${id}/detalles`)}>Cancelar</Button>
          <Button type="submit"><Save className="mr-2 h-4 w-4" />Guardar Cambios</Button>
        </div>
      </form>
    </div>
  );
};

export default SucursalConfiguracion;
