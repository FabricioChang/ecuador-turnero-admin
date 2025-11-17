import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Layers3, Save, Search, Filter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";
import { useSucursales } from "@/hooks/useSucursales";
import { usePantallas } from "@/hooks/usePantallas";
import { usePublicidad } from "@/hooks/usePublicidad";

interface PublicidadItem {
  id: number;
  nombre: string;
}

const Pantallas = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  
  // Filtros para el modal de publicidad
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalRegionFilter, setModalRegionFilter] = useState("");
  const [modalProvinciaFilter, setModalProvinciaFilter] = useState("");
  const [modalCiudadFilter, setModalCiudadFilter] = useState("");
  const [modalSucursalFilter, setModalSucursalFilter] = useState("");

  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: sucursalesDB = [] } = useSucursales();
  const { data: pantallasDB = [], isLoading } = usePantallas();
  const { data: publicidadDB = [] } = usePublicidad();

  useEffect(() => {
    document.title = "Pantallas | Panel Admin";
  }, []);

  const publicidadCatalogo: PublicidadItem[] = useMemo(
    () => [
      { id: 101, nombre: "Promo 2x1" },
      { id: 102, nombre: "Descuento Fin de Semana" },
      { id: 103, nombre: "Nuevos Servicios" },
      { id: 104, nombre: "Tarifas Actualizadas" },
      { id: 105, nombre: "Campaña Temporada" },
    ],
    []
  );

  // Si venimos de "/pantallas/nueva" con una pantalla recién creada, refetch
  useEffect(() => {
    const nueva = (location.state as { newPantalla?: any })?.newPantalla;
    if (nueva) {
      // El query se actualizará automáticamente
    }
  }, [location.state]);

  // Asignación de publicidad
  const [dialogOpenFor, setDialogOpenFor] = useState<string | null>(null);
  const [tempAds, setTempAds] = useState<number[]>([]);

  const abrirDialogoAds = (p: any) => {
    setTempAds(p.publicidadIds || []);
    setDialogOpenFor(p.id);
    // Reset filtros del modal
    setModalSearchTerm("");
    setModalRegionFilter("");
    setModalProvinciaFilter("");
    setModalCiudadFilter("");
    setModalSucursalFilter("");
  };

  const toggleAd = (id: number) => {
    setTempAds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const guardarAds = () => {
    if (dialogOpenFor == null) return;
    // Aquí se guardaría en la BD
    setDialogOpenFor(null);
    toast({ title: "Publicidad actualizada", description: "Se guardó la asignación de contenidos." });
  };

  const actualizarSucursal = (idPantalla: string, sucursalId: string) => {
    // Aquí se actualizaría en la BD
    const suc = sucursalesDB.find((s: any) => s.id === sucursalId);
    if (!suc) return;
    toast({ title: "Sucursal asignada", description: `La pantalla ahora apunta a: ${suc.nombre}` });
  };

  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter) return provincias;
    const regionSeleccionada = regiones.find((r: any) => r.id === regionFilter);
    return provincias.filter((p: any) => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  const cantonesFiltrados = useMemo(() => {
    if (!provinciaFilter) return cantones;
    const provinciaSeleccionada = provincias.find((p: any) => p.nombre === provinciaFilter);
    return cantones.filter((c: any) => c.provincia_id === provinciaSeleccionada?.id);
  }, [provinciaFilter, cantones, provincias]);

  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("");
    setCiudadFilter("");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("");
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

  const provinciasFiltradas2 = useMemo(() => {
    if (!modalRegionFilter) return provincias;
    const regionSeleccionada = regiones.find((r: any) => r.id === modalRegionFilter);
    return provincias.filter((p: any) => regionSeleccionada?.provincias.includes(p.nombre));
  }, [modalRegionFilter, provincias, regiones]);

  const cantonesFiltrados2 = useMemo(() => {
    if (!modalProvinciaFilter) return cantones;
    const provinciaSeleccionada = provincias.find((p: any) => p.nombre === modalProvinciaFilter);
    return cantones.filter((c: any) => c.provincia_id === provinciaSeleccionada?.id);
  }, [modalProvinciaFilter, cantones, provincias]);

  const filteredPublicidad = useMemo(() => {
    return publicidadDB.filter(item => {
      const matchesSearch = item.nombre.toLowerCase().includes(modalSearchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [publicidadDB, modalSearchTerm]);

  const filteredPantallas = pantallasDB.filter((pantalla: any) => {
    const matchesSearch = pantalla.identificador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pantalla.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = !regionFilter || regionFilter === "all" || 
      regiones.find((r: any) => r.id === regionFilter)?.provincias.includes(pantalla.sucursal?.provincia?.nombre);
    
    const matchesProvincia = !provinciaFilter || provinciaFilter === "all" || 
      pantalla.sucursal?.provincia?.nombre === provinciaFilter;
    
    const matchesCiudad = !ciudadFilter || ciudadFilter === "all" || 
      pantalla.sucursal?.canton?.nombre === ciudadFilter;
    
    const matchesSucursal = !sucursalFilter || sucursalFilter === "all" || 
      pantalla.sucursal?.nombre === sucursalFilter;
    
    return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad && matchesSucursal;
  });

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-admin-text-primary">Pantallas</h1>
        <Button onClick={() => navigate("/pantallas/nueva")}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Pantalla
        </Button>
      </header>

      {/* Filtros */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="flex items-center text-admin-text-primary">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted h-4 w-4" />
            <Input
              placeholder="Buscar por identificador o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-admin-bg border-admin-border-light text-admin-text-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={regionFilter} onValueChange={handleRegionChange}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las regiones</SelectItem>
                <SelectItem value="costa">Costa</SelectItem>
                <SelectItem value="sierra">Sierra</SelectItem>
                <SelectItem value="amazonia">Amazonía</SelectItem>
                <SelectItem value="galapagos">Galápagos</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={provinciaFilter} 
              onValueChange={handleProvinciaChange}
              disabled={!regionFilter || regionFilter === "all"}
            >
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provinciasFiltradas.map((prov: any) => (
                  <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={ciudadFilter} 
              onValueChange={setCiudadFilter}
              disabled={!provinciaFilter || provinciaFilter === "all"}
            >
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cantonesFiltrados.map((canton: any) => (
                  <SelectItem key={canton.id} value={canton.nombre}>{canton.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {sucursalesDB.map((s: any) => (
                  <SelectItem key={s.id} value={s.nombre}>{s.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableCaption className="text-admin-text-secondary">Administración de pantallas y su contenido publicitario.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Identificador</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Publicidad</TableHead>
            <TableHead className="w-[160px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-admin-text-secondary">
                Cargando pantallas...
              </TableCell>
            </TableRow>
          ) : filteredPantallas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-admin-text-secondary">
                No se encontraron pantallas con los filtros seleccionados
              </TableCell>
            </TableRow>
          ) : (
            filteredPantallas.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-admin-text-secondary">{p.identificador}</TableCell>
                <TableCell className="font-medium text-admin-text-primary">{p.nombre}</TableCell>
                <TableCell>
                  <Select
                    value={p.sucursal_id || ""}
                    onValueChange={(val) => actualizarSucursal(p.id, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {sucursalesDB.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-admin-text-secondary">
                    <Layers3 className="h-4 w-4" />
                    <span>{0} elementos</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={dialogOpenFor === p.id} onOpenChange={(o) => setDialogOpenFor(o ? p.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Asignar publicidad</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Asignar publicidad</DialogTitle>
                        <DialogDescription>Seleccione el contenido a mostrar en "{p.nombre}"</DialogDescription>
                      </DialogHeader>

                      {/* Filtros del modal */}
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted h-4 w-4" />
                          <Input
                            placeholder="Buscar por nombre..."
                            value={modalSearchTerm}
                            onChange={(e) => setModalSearchTerm(e.target.value)}
                            className="pl-10 bg-admin-bg border-admin-border-light text-admin-text-primary"
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-auto space-y-2 pr-1 mt-4">
                        {filteredPublicidad.length === 0 ? (
                          <p className="text-center text-admin-text-secondary py-4">No se encontraron resultados</p>
                        ) : (
                          filteredPublicidad.map((item) => (
                            <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-admin-surface rounded cursor-pointer">
                              <Checkbox
                                checked={tempAds.includes(Number(item.id))}
                                onCheckedChange={() => toggleAd(Number(item.id))}
                                aria-label={`Seleccionar ${item.nombre}`}
                              />
                              <div className="flex-1">
                                <span className="text-admin-text-primary font-medium">{item.nombre}</span>
                                <span className="text-xs text-admin-text-secondary ml-2">({item.tipo})</span>
                              </div>
                            </label>
                          ))
                        )}
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setDialogOpenFor(null)}>Cancelar</Button>
                        <Button onClick={guardarAds}>
                          <Save className="mr-2 h-4 w-4" /> Guardar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default Pantallas;
