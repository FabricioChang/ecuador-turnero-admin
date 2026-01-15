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
import { useRegiones } from "@/hooks/useRegiones";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useSucursales } from "@/hooks/useSucursales";
import { usePantallas } from "@/hooks/usePantallas";
import { usePublicidad } from "@/hooks/usePublicidad";

const Pantallas = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [provinciaFilter, setProvinciaFilter] = useState("all");
  const [ciudadFilter, setCiudadFilter] = useState("all");
  const [sucursalFilter, setSucursalFilter] = useState("all");
  
  // Filtros para el modal de publicidad
  const [modalSearchTerm, setModalSearchTerm] = useState("");

  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: sucursalesDB = [] } = useSucursales();
  const { data: pantallasDB = [], isLoading } = usePantallas();
  const { data: publicidadDB = [] } = usePublicidad();

  useEffect(() => {
    document.title = "Pantallas | Panel Admin";
  }, []);

  // Filtrar provincias por región
  const provinciasFiltradas = useMemo(() => {
    if (regionFilter === "all") return provincias;
    const regionData = regiones.find(r => r.id === regionFilter);
    if (!regionData) return provincias;
    return provincias.filter((p: any) => regionData.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  // Filtrar ciudades por provincia
  const ciudadesFiltradas = useMemo(() => {
    if (provinciaFilter === "all") return cantones;
    return cantones.filter((c: any) => c.provincia === provinciaFilter);
  }, [provinciaFilter, cantones]);

  // Filtrar sucursales jerárquicamente
  const sucursalesFiltradas = useMemo(() => {
    let filtered = [...sucursalesDB];
    
    if (regionFilter !== "all") {
      const regionData = regiones.find(r => r.id === regionFilter);
      if (regionData) {
        filtered = filtered.filter((s: any) => regionData.provincias.includes(s.provincia));
      }
    }
    
    if (provinciaFilter !== "all") {
      filtered = filtered.filter((s: any) => s.provincia === provinciaFilter);
    }
    
    if (ciudadFilter !== "all") {
      filtered = filtered.filter((s: any) => s.ciudad === ciudadFilter);
    }
    
    return filtered;
  }, [sucursalesDB, regionFilter, provinciaFilter, ciudadFilter, regiones]);

  // Handlers para resetear filtros hijos
  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("all");
    setCiudadFilter("all");
    setSucursalFilter("all");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("all");
    setSucursalFilter("all");
  };

  const handleCiudadChange = (value: string) => {
    setCiudadFilter(value);
    setSucursalFilter("all");
  };

  // Asignación de publicidad
  const [dialogOpenFor, setDialogOpenFor] = useState<string | null>(null);
  const [tempAds, setTempAds] = useState<number[]>([]);

  const abrirDialogoAds = (p: any) => {
    setTempAds(p.publicidadIds || []);
    setDialogOpenFor(p.id);
    setModalSearchTerm("");
  };

  const toggleAd = (id: number) => {
    setTempAds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const guardarAds = () => {
    if (dialogOpenFor == null) return;
    setDialogOpenFor(null);
    toast({ title: "Publicidad actualizada", description: "Se guardó la asignación de contenidos." });
  };

  const actualizarSucursal = (idPantalla: string, sucursalId: string) => {
    const suc = sucursalesDB.find((s: any) => s.id === sucursalId);
    if (!suc) return;
    toast({ title: "Sucursal asignada", description: `La pantalla ahora apunta a: ${suc.nombre}` });
  };

  const filteredPublicidad = useMemo(() => {
    return publicidadDB.filter((item: any) => {
      const matchesSearch = item.nombre?.toLowerCase().includes(modalSearchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [publicidadDB, modalSearchTerm]);

  const filteredPantallas = useMemo(() => {
    return pantallasDB.filter((pantalla: any) => {
      const matchesSearch = pantalla.identificador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pantalla.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por sucursal directa (tiene prioridad)
      if (sucursalFilter !== "all") {
        return matchesSearch && pantalla.sucursal_id === sucursalFilter;
      }
      
      // Filtro por región
      let matchesRegion = true;
      if (regionFilter !== "all") {
        const regionData = regiones.find(r => r.id === regionFilter);
        if (regionData && pantalla.sucursal) {
          matchesRegion = regionData.provincias.includes(pantalla.sucursal.provincia);
        }
      }
      
      // Filtro por provincia
      const matchesProvincia = provinciaFilter === "all" || pantalla.sucursal?.provincia === provinciaFilter;
      
      // Filtro por ciudad
      const matchesCiudad = ciudadFilter === "all" || pantalla.sucursal?.ciudad === ciudadFilter;
      
      return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad;
    });
  }, [pantallasDB, searchTerm, sucursalFilter, regionFilter, provinciaFilter, ciudadFilter, regiones]);

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={regionFilter} onValueChange={handleRegionChange}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regiones.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={provinciaFilter} 
              onValueChange={handleProvinciaChange}
              disabled={regionFilter === "all"}
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
              onValueChange={handleCiudadChange}
              disabled={provinciaFilter === "all"}
            >
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {ciudadesFiltradas.map((canton: any) => (
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
                {sucursalesFiltradas.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setRegionFilter("all");
                setProvinciaFilter("all");
                setCiudadFilter("all");
                setSucursalFilter("all");
              }}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-admin-text-secondary mb-2">
        Mostrando {filteredPantallas.length} de {pantallasDB.length} pantallas
      </div>

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
                <TableCell className="font-mono text-admin-text-secondary">{p.codigo || p.identificador}</TableCell>
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
                          filteredPublicidad.map((item: any) => (
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
