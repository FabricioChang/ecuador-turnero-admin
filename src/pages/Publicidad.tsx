import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Play, Image, Calendar, CheckCircle, XCircle, Monitor, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";
import { useSucursales } from "@/hooks/useSucursales";
import { usePantallas } from "@/hooks/usePantallas";

interface PublicidadItem {
  id: number;
  nombre: string;
  tipo: 'imagen' | 'video';
  archivo: string;
  duracion: number;
  fecha: string;
  estado: 'activo' | 'inactivo';
}

const Publicidad = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    archivo: null as File | null,
    duracion: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<PublicidadItem | null>(null);
  const [selectedPantallas, setSelectedPantallas] = useState<string[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Filtros para el modal
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalRegionFilter, setModalRegionFilter] = useState("");
  const [modalProvinciaFilter, setModalProvinciaFilter] = useState("");
  const [modalCiudadFilter, setModalCiudadFilter] = useState("");
  const [modalSucursalFilter, setModalSucursalFilter] = useState("");
  
  // Hooks para cargar datos de la BD
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: sucursalesDB = [] } = useSucursales();
  const { data: pantallasDB = [], isLoading: loadingPantallas } = usePantallas();

  const publicidadItems: PublicidadItem[] = [
    {
      id: 1,
      nombre: "Promoción Verano 2024",
      tipo: "imagen",
      archivo: "promo_verano.jpg",
      duracion: 15,
      fecha: "2024-01-15",
      estado: "activo"
    },
    {
      id: 2,
      nombre: "Video Corporativo",
      tipo: "video", 
      archivo: "video_corp.mp4",
      duracion: 30,
      fecha: "2024-01-10",
      estado: "activo"
    },
    {
      id: 3,
      nombre: "Oferta Especial",
      tipo: "imagen",
      archivo: "oferta_especial.png",
      duracion: 10,
      fecha: "2024-01-08",
      estado: "inactivo"
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.archivo) {
      newErrors.archivo = "Debe seleccionar un archivo";
    } else {
      const validExtensions = ['jpg', 'jpeg', 'png', 'mp4', 'avi', 'mov'];
      const fileExtension = formData.archivo.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        newErrors.archivo = "Formato no válido. Use: jpg, jpeg, png, mp4, avi, mov";
      }
    }

    if (!formData.duracion) {
      newErrors.duracion = "La duración es requerida";
    } else if (isNaN(Number(formData.duracion)) || Number(formData.duracion) <= 0) {
      newErrors.duracion = "La duración debe ser un número mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Contenido agregado",
        description: "El contenido publicitario se ha subido correctamente",
      });
      
      setFormData({ nombre: '', archivo: null, duracion: '' });
      setErrors({});
      
      // Reset file input
      const fileInput = document.getElementById('archivo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, archivo: file }));
    if (errors.archivo) {
      setErrors(prev => ({ ...prev, archivo: '' }));
    }
  };

  const handleAssignToPantallas = (item: PublicidadItem) => {
    setSelectedItem(item);
    setSelectedPantallas([]);
    setIsAssignModalOpen(true);
    // Reset filtros
    setModalSearchTerm("");
    setModalRegionFilter("");
    setModalProvinciaFilter("");
    setModalCiudadFilter("");
    setModalSucursalFilter("");
  };

  const confirmAssignment = () => {
    if (selectedPantallas.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos una pantalla",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Asignación completada",
      description: `Contenido asignado a ${selectedPantallas.length} pantalla(s)`,
    });
    
    setIsAssignModalOpen(false);
    setSelectedItem(null);
    setSelectedPantallas([]);
  };

  const togglePantallaSelection = (pantallaId: string) => {
    setSelectedPantallas(prev => 
      prev.includes(pantallaId) 
        ? prev.filter(id => id !== pantallaId)
        : [...prev, pantallaId]
    );
  };

  const handleModalRegionChange = (value: string) => {
    setModalRegionFilter(value);
    setModalProvinciaFilter("");
    setModalCiudadFilter("");
  };

  const handleModalProvinciaChange = (value: string) => {
    setModalProvinciaFilter(value);
    setModalCiudadFilter("");
  };

  const provinciasFiltradas = useMemo(() => {
    if (!modalRegionFilter) return provincias;
    const regionSeleccionada = regiones.find((r: any) => r.id === modalRegionFilter);
    return provincias.filter((p: any) => regionSeleccionada?.provincias.includes(p.nombre));
  }, [modalRegionFilter, provincias, regiones]);

  const cantonesFiltrados = useMemo(() => {
    if (!modalProvinciaFilter) return cantones;
    const provinciaSeleccionada = provincias.find((p: any) => p.nombre === modalProvinciaFilter);
    return cantones.filter((c: any) => c.provincia_id === provinciaSeleccionada?.id);
  }, [modalProvinciaFilter, cantones, provincias]);

  const filteredPantallas = useMemo(() => {
    return pantallasDB.filter((pantalla: any) => {
      const matchesSearch = 
        pantalla.identificador?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        pantalla.nombre?.toLowerCase().includes(modalSearchTerm.toLowerCase());
      
      const matchesRegion = !modalRegionFilter || modalRegionFilter === "all" || 
        regiones.find((r: any) => r.id === modalRegionFilter)?.provincias.includes(pantalla.sucursal?.provincia?.nombre);
      
      const matchesProvincia = !modalProvinciaFilter || modalProvinciaFilter === "all" || 
        pantalla.sucursal?.provincia?.nombre === modalProvinciaFilter;
      
      const matchesCiudad = !modalCiudadFilter || modalCiudadFilter === "all" || 
        pantalla.sucursal?.canton?.nombre === modalCiudadFilter;
      
      const matchesSucursal = !modalSucursalFilter || modalSucursalFilter === "all" || 
        pantalla.sucursal?.nombre === modalSucursalFilter;
      
      return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad && matchesSucursal;
    });
  }, [pantallasDB, modalSearchTerm, modalRegionFilter, modalProvinciaFilter, modalCiudadFilter, modalSucursalFilter, regiones]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Publicidad</h1>
          <p className="text-admin-text-secondary">Gestión de contenido publicitario para pantallas</p>
        </div>
      </div>

      {/* Formulario de subida */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Agregar Contenido Publicitario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-admin-text-primary">Nombre del contenido</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, nombre: e.target.value }));
                    if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' }));
                  }}
                  placeholder="Ej: Promoción Verano 2024"
                  className={`bg-admin-background border-admin-border-light ${errors.nombre ? 'border-red-500' : ''}`}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="archivo" className="text-admin-text-primary">Archivo (Imagen/Video)</Label>
                <Input
                  id="archivo"
                  type="file"
                  accept=".jpg,.jpeg,.png,.mp4,.avi,.mov"
                  onChange={handleFileChange}
                  className={`bg-admin-background border-admin-border-light ${errors.archivo ? 'border-red-500' : ''}`}
                />
                {errors.archivo && <p className="text-sm text-red-500">{errors.archivo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion" className="text-admin-text-primary">Duración (segundos)</Label>
                <Input
                  id="duracion"
                  type="number"
                  value={formData.duracion}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, duracion: e.target.value }));
                    if (errors.duracion) setErrors(prev => ({ ...prev, duracion: '' }));
                  }}
                  placeholder="15"
                  min="1"
                  className={`bg-admin-background border-admin-border-light ${errors.duracion ? 'border-red-500' : ''}`}
                />
                {errors.duracion && <p className="text-sm text-red-500">{errors.duracion}</p>}
              </div>
            </div>

            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Subir Contenido
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de contenidos */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">Contenidos Publicitarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-admin-border-light">
                <TableHead className="text-admin-text-muted">Nombre</TableHead>
                <TableHead className="text-admin-text-muted">Tipo</TableHead>
                <TableHead className="text-admin-text-muted">Duración</TableHead>
                <TableHead className="text-admin-text-muted">Fecha</TableHead>
                <TableHead className="text-admin-text-muted">Estado</TableHead>
                <TableHead className="text-admin-text-muted">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publicidadItems.map((item) => (
                <TableRow key={item.id} className="border-admin-border-light">
                  <TableCell className="text-admin-text-primary font-medium">
                    <div className="flex items-center space-x-2">
                      {item.tipo === 'imagen' ? (
                        <Image className="h-4 w-4 text-admin-text-muted" />
                      ) : (
                        <Play className="h-4 w-4 text-admin-text-muted" />
                      )}
                      <span>{item.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary">
                    <span className="capitalize">{item.tipo}</span>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary">{item.duracion}s</TableCell>
                  <TableCell className="text-admin-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-admin-text-muted" />
                      <span>{item.fecha}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {item.estado === 'activo' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm capitalize ${
                        item.estado === 'activo' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.estado}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignToPantallas(item)}
                      className="text-admin-text-primary"
                    >
                      <Monitor className="h-4 w-4 mr-1" />
                      Asignar a Pantallas
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de asignación a pantallas */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="bg-admin-surface border-admin-border-light max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-admin-text-primary">
              Asignar "{selectedItem?.nombre}" a Pantallas
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-admin-text-secondary">
              Seleccione las pantallas donde desea mostrar este contenido:
            </p>

            {/* Filtros */}
            <Card className="bg-admin-background border-admin-border-light">
              <CardHeader>
                <CardTitle className="flex items-center text-admin-text-primary text-base">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted h-4 w-4" />
                  <Input
                    placeholder="Buscar por identificador o nombre..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="pl-10 bg-admin-surface border-admin-border-light text-admin-text-primary"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={modalRegionFilter} onValueChange={handleModalRegionChange}>
                    <SelectTrigger className="bg-admin-surface border-admin-border-light text-admin-text-primary">
                      <SelectValue placeholder="Región" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-surface border-admin-border-light z-[100]">
                      <SelectItem value="all">Todas las regiones</SelectItem>
                      <SelectItem value="costa">Costa</SelectItem>
                      <SelectItem value="sierra">Sierra</SelectItem>
                      <SelectItem value="amazonia">Amazonía</SelectItem>
                      <SelectItem value="galapagos">Galápagos</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={modalProvinciaFilter} 
                    onValueChange={handleModalProvinciaChange}
                    disabled={!modalRegionFilter || modalRegionFilter === "all"}
                  >
                    <SelectTrigger className="bg-admin-surface border-admin-border-light text-admin-text-primary">
                      <SelectValue placeholder="Provincia" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-surface border-admin-border-light z-[100]">
                      <SelectItem value="all">Todas las provincias</SelectItem>
                      {provinciasFiltradas.map((prov: any) => (
                        <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={modalCiudadFilter} 
                    onValueChange={setModalCiudadFilter}
                    disabled={!modalProvinciaFilter || modalProvinciaFilter === "all"}
                  >
                    <SelectTrigger className="bg-admin-surface border-admin-border-light text-admin-text-primary">
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-surface border-admin-border-light z-[100]">
                      <SelectItem value="all">Todas las ciudades</SelectItem>
                      {cantonesFiltrados.map((canton: any) => (
                        <SelectItem key={canton.id} value={canton.nombre}>{canton.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={modalSucursalFilter} onValueChange={setModalSucursalFilter}>
                    <SelectTrigger className="bg-admin-surface border-admin-border-light text-admin-text-primary">
                      <SelectValue placeholder="Sucursal" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-surface border-admin-border-light z-[100]">
                      <SelectItem value="all">Todas las sucursales</SelectItem>
                      {sucursalesDB.map((s: any) => (
                        <SelectItem key={s.id} value={s.nombre}>{s.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {loadingPantallas ? (
              <div className="text-center py-8 text-admin-text-secondary">Cargando pantallas...</div>
            ) : filteredPantallas.length === 0 ? (
              <div className="text-center py-8 text-admin-text-secondary">No se encontraron pantallas con los filtros seleccionados</div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredPantallas.map((pantalla: any) => (
                  <div
                    key={pantalla.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      pantalla.estado === 'activa' 
                        ? 'border-admin-border-light bg-admin-background' 
                        : 'border-admin-border-light bg-admin-surface opacity-50'
                    }`}
                  >
                    <Checkbox
                      id={`pantalla-${pantalla.id}`}
                      checked={selectedPantallas.includes(pantalla.id)}
                      onCheckedChange={() => togglePantallaSelection(pantalla.id)}
                      disabled={pantalla.estado === 'inactiva'}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`pantalla-${pantalla.id}`}
                        className={`text-sm font-medium cursor-pointer ${
                          pantalla.estado === 'activa' ? 'text-admin-text-primary' : 'text-admin-text-muted'
                        }`}
                      >
                        {pantalla.identificador} - {pantalla.nombre}
                      </label>
                      <p className="text-xs text-admin-text-muted">
                        {pantalla.sucursal?.nombre} - {pantalla.sucursal?.provincia?.nombre}, {pantalla.sucursal?.canton?.nombre}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      pantalla.estado === 'activa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {pantalla.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAssignment}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Confirmar Asignación ({selectedPantallas.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Publicidad;