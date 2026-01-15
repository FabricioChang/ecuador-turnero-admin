import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Play, Image, CheckCircle, XCircle, Monitor, Search, Filter, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegiones } from "@/hooks/useRegiones";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useSucursales } from "@/hooks/useSucursales";
import { usePantallas } from "@/hooks/usePantallas";
import { usePublicidad, useUploadPublicidad, useDeletePublicidad } from "@/hooks/usePublicidad";

const Publicidad = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    archivo: null as File | null,
    duracion: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedPantallas, setSelectedPantallas] = useState<string[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Filtros para el modal
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalRegionFilter, setModalRegionFilter] = useState("all");
  const [modalProvinciaFilter, setModalProvinciaFilter] = useState("all");
  const [modalCiudadFilter, setModalCiudadFilter] = useState("all");
  const [modalSucursalFilter, setModalSucursalFilter] = useState("all");
  
  // Hooks para cargar datos de la BD
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: sucursalesDB = [] } = useSucursales();
  const { data: pantallasDB = [], isLoading: loadingPantallas } = usePantallas();
  const { data: publicidadDB = [], isLoading: loadingPublicidad } = usePublicidad();
  const uploadPublicidad = useUploadPublicidad();
  const deletePublicidad = useDeletePublicidad();
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.archivo) {
      newErrors.archivo = "Debe seleccionar un archivo";
    }
    if (!formData.duracion) {
      newErrors.duracion = "La duración es requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && formData.archivo) {
      setIsUploading(true);
      try {
        await uploadPublicidad.mutateAsync({
          nombre: formData.nombre,
          archivo: formData.archivo,
          duracion: parseInt(formData.duracion, 10),
        });
        setFormData({ nombre: '', archivo: null, duracion: '' });
        setErrors({});
        // Reset file input
        const fileInput = document.getElementById('archivo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (item: any) => {
    if (confirm(`¿Estás seguro de eliminar "${item.nombre}"?`)) {
      await deletePublicidad.mutateAsync(item);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, archivo: file }));
  };

  const handleAssignToPantallas = (item: any) => {
    setSelectedItem(item);
    setSelectedPantallas([]);
    setIsAssignModalOpen(true);
    setModalSearchTerm("");
    setModalRegionFilter("all");
    setModalProvinciaFilter("all");
    setModalCiudadFilter("all");
    setModalSucursalFilter("all");
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
    setSelectedPantallas(prev => {
      if (prev.includes(pantallaId)) {
        return prev.filter(id => id !== pantallaId);
      } else {
        return [...prev, pantallaId];
      }
    });
  };

  // Handlers para resetear filtros hijos
  const handleModalRegionChange = (value: string) => {
    setModalRegionFilter(value);
    setModalProvinciaFilter("all");
    setModalCiudadFilter("all");
    setModalSucursalFilter("all");
  };

  const handleModalProvinciaChange = (value: string) => {
    setModalProvinciaFilter(value);
    setModalCiudadFilter("all");
    setModalSucursalFilter("all");
  };

  const handleModalCiudadChange = (value: string) => {
    setModalCiudadFilter(value);
    setModalSucursalFilter("all");
  };

  // Filtrar provincias por región
  const provinciasFiltradas = useMemo(() => {
    if (modalRegionFilter === "all") return provincias;
    const regionData = regiones.find(r => r.id === modalRegionFilter);
    if (!regionData) return provincias;
    return provincias.filter((p: any) => regionData.provincias.includes(p.nombre));
  }, [modalRegionFilter, provincias, regiones]);

  // Filtrar ciudades por provincia
  const ciudadesFiltradas = useMemo(() => {
    if (modalProvinciaFilter === "all") return cantones;
    return cantones.filter((c: any) => c.provincia === modalProvinciaFilter);
  }, [modalProvinciaFilter, cantones]);

  // Filtrar sucursales jerárquicamente
  const sucursalesFiltradas = useMemo(() => {
    let filtered = [...sucursalesDB];
    
    if (modalRegionFilter !== "all") {
      const regionData = regiones.find(r => r.id === modalRegionFilter);
      if (regionData) {
        filtered = filtered.filter((s: any) => regionData.provincias.includes(s.provincia));
      }
    }
    
    if (modalProvinciaFilter !== "all") {
      filtered = filtered.filter((s: any) => s.provincia === modalProvinciaFilter);
    }
    
    if (modalCiudadFilter !== "all") {
      filtered = filtered.filter((s: any) => s.ciudad === modalCiudadFilter);
    }
    
    return filtered;
  }, [sucursalesDB, modalRegionFilter, modalProvinciaFilter, modalCiudadFilter, regiones]);

  // Filtrar pantallas jerárquicamente
  const filteredPantallas = useMemo(() => {
    return pantallasDB.filter((pantalla: any) => {
      const matchesSearch = 
        pantalla.identificador?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        pantalla.nombre?.toLowerCase().includes(modalSearchTerm.toLowerCase());
      
      // Filtro por sucursal directa
      if (modalSucursalFilter !== "all") {
        return matchesSearch && pantalla.sucursal_id === modalSucursalFilter;
      }
      
      // Filtros jerárquicos
      const sucursalIds = sucursalesFiltradas.map((s: any) => s.id);
      const matchesSucursal = sucursalIds.length === 0 || sucursalIds.includes(pantalla.sucursal_id);
      
      return matchesSearch && matchesSucursal;
    });
  }, [pantallasDB, modalSearchTerm, modalSucursalFilter, sucursalesFiltradas]);

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
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, duracion: e.target.value }))}
                  placeholder="15"
                  min="1"
                  className={`bg-admin-background border-admin-border-light ${errors.duracion ? 'border-red-500' : ''}`}
                />
                {errors.duracion && <p className="text-sm text-red-500">{errors.duracion}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Subiendo..." : "Subir Contenido"}
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
          {loadingPublicidad ? (
            <p className="text-center py-8 text-admin-text-secondary">Cargando contenidos...</p>
          ) : publicidadDB.length === 0 ? (
            <p className="text-center py-8 text-admin-text-secondary">No hay contenidos publicitarios</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-admin-border-light">
                  <TableHead className="text-admin-text-muted">Nombre</TableHead>
                  <TableHead className="text-admin-text-muted">Tipo</TableHead>
                  <TableHead className="text-admin-text-muted">Duración</TableHead>
                  <TableHead className="text-admin-text-muted">Estado</TableHead>
                  <TableHead className="text-admin-text-muted">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicidadDB.map((item: any) => (
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
                    <TableCell className="text-admin-text-secondary capitalize">{item.tipo}</TableCell>
                    <TableCell className="text-admin-text-secondary">{item.duracion}s</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {item.estado === 'activo' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm capitalize ${item.estado === 'activo' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.estado}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignToPantallas(item)}
                          className="text-admin-text-primary"
                        >
                          <Monitor className="h-4 w-4 mr-1" />
                          Asignar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
                      {regiones.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={modalProvinciaFilter} 
                    onValueChange={handleModalProvinciaChange}
                    disabled={modalRegionFilter === "all"}
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
                    onValueChange={handleModalCiudadChange}
                    disabled={modalProvinciaFilter === "all"}
                  >
                    <SelectTrigger className="bg-admin-surface border-admin-border-light text-admin-text-primary">
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-surface border-admin-border-light z-[100]">
                      <SelectItem value="all">Todas las ciudades</SelectItem>
                      {ciudadesFiltradas.map((c: any) => (
                        <SelectItem key={c.id} value={c.nombre}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={modalSucursalFilter} onValueChange={setModalSucursalFilter}>
                    <SelectTrigger className="bg-admin-surface border-admin-border-light text-admin-text-primary">
                      <SelectValue placeholder="Sucursal" />
                    </SelectTrigger>
                    <SelectContent className="bg-admin-surface border-admin-border-light z-[100]">
                      <SelectItem value="all">Todas las sucursales</SelectItem>
                      {sucursalesFiltradas.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de pantallas */}
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              {loadingPantallas ? (
                <p className="text-center py-4 text-admin-text-secondary">Cargando pantallas...</p>
              ) : filteredPantallas.length === 0 ? (
                <p className="text-center py-4 text-admin-text-secondary">
                  No se encontraron pantallas con los filtros seleccionados
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredPantallas.map((pantalla: any) => (
                    <div
                      key={pantalla.id}
                      className="flex items-center space-x-3 p-2 hover:bg-admin-bg rounded"
                    >
                      <Checkbox
                        id={`pantalla-${pantalla.id}`}
                        checked={selectedPantallas.includes(pantalla.id)}
                        onCheckedChange={() => togglePantallaSelection(pantalla.id)}
                      />
                      <label
                        htmlFor={`pantalla-${pantalla.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium text-admin-text-primary">{pantalla.nombre}</span>
                        <span className="text-sm text-admin-text-secondary ml-2">
                          ({pantalla.sucursal?.nombre || "Sin sucursal"})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-admin-text-secondary">
                {selectedPantallas.length} pantalla(s) seleccionada(s)
              </span>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmAssignment}>
                  Confirmar Asignación
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Publicidad;
