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

interface SucursalOption {
  id: number;
  nombre: string;
  region: string;
  provincia: string;
  ciudad: string;
}

interface PublicidadItem {
  id: number;
  nombre: string;
}

interface Pantalla {
  id: number;
  identificador: string;
  nombre: string;
  sucursalId: number | null;
  sucursalNombre: string;
  publicidadIds: number[];
  region: string;
  provincia: string;
  ciudad: string;
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

  const regiones = {
    costa: ["Esmeraldas", "Manabí", "Los Ríos", "Guayas", "Santa Elena", "El Oro"],
    sierra: ["Carchi", "Imbabura", "Pichincha", "Cotopaxi", "Tungurahua", "Bolívar", "Chimborazo", "Cañar", "Azuay", "Loja"],
    amazonia: ["Sucumbíos", "Napo", "Orellana", "Pastaza", "Morona Santiago", "Zamora Chinchipe"],
    galapagos: ["Galápagos"]
  };

  const ciudades = {
    "Pichincha": ["Quito", "Cayambe", "Mejía", "Pedro Moncayo", "Rumiñahui"],
    "Guayas": ["Guayaquil", "Durán", "Samborondón", "Daule", "Milagro"],
    "Azuay": ["Cuenca", "Gualaceo", "Paute", "Chordeleg", "Sigsig"]
  };

  useEffect(() => {
    document.title = "Pantallas | Panel Admin";
  }, []);

  const sucursales: SucursalOption[] = useMemo(
    () => [
      { id: 1, nombre: "Sucursal Centro", region: "sierra", provincia: "Pichincha", ciudad: "Quito" },
      { id: 2, nombre: "Sucursal Norte", region: "sierra", provincia: "Pichincha", ciudad: "Quito" },
      { id: 3, nombre: "Sucursal Sur", region: "costa", provincia: "Guayas", ciudad: "Guayaquil" },
      { id: 4, nombre: "Sucursal Guayaquil Centro", region: "costa", provincia: "Guayas", ciudad: "Guayaquil" },
      { id: 5, nombre: "Sucursal Cuenca", region: "sierra", provincia: "Azuay", ciudad: "Cuenca" },
    ],
    []
  );

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

  const [pantallas, setPantallas] = useState<Pantalla[]>([
    { id: 9001, identificador: "PAN-9001", nombre: "Pantalla Recepción", sucursalId: 1, sucursalNombre: "Sucursal Centro", publicidadIds: [101, 103], region: "sierra", provincia: "Pichincha", ciudad: "Quito" },
    { id: 9002, identificador: "PAN-9002", nombre: "Pantalla Sala", sucursalId: 2, sucursalNombre: "Sucursal Norte", publicidadIds: [102], region: "sierra", provincia: "Pichincha", ciudad: "Quito" },
  ]);

  // Si venimos de "/pantallas/nueva" con una pantalla recién creada, agregarla
  useEffect(() => {
    const nueva = (location.state as { newPantalla?: Pantalla })?.newPantalla;

    if (nueva) {
      setPantallas((prev) => {
        if (prev.some((p) => p.id === nueva.id)) return prev;
        return [nueva, ...prev];
      });
    }
  }, [location.state]);

  // Asignación de publicidad
  const [dialogOpenFor, setDialogOpenFor] = useState<number | null>(null);
  const [tempAds, setTempAds] = useState<number[]>([]);

  const abrirDialogoAds = (p: Pantalla) => {
    setTempAds(p.publicidadIds);
    setDialogOpenFor(p.id);
  };

  const toggleAd = (id: number) => {
    setTempAds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const guardarAds = () => {
    if (dialogOpenFor == null) return;
    setPantallas((prev) =>
      prev.map((p) => (p.id === dialogOpenFor ? { ...p, publicidadIds: [...tempAds] } : p))
    );
    setDialogOpenFor(null);
    toast({ title: "Publicidad actualizada", description: "Se guardó la asignación de contenidos." });
  };

  const actualizarSucursal = (idPantalla: number, sucursalId: number) => {
    const suc = sucursales.find((s) => s.id === Number(sucursalId));
    if (!suc) return;
    setPantallas((prev) => prev.map((p) => (p.id === idPantalla ? { ...p, sucursalId: suc.id, sucursalNombre: suc.nombre, region: suc.region, provincia: suc.provincia, ciudad: suc.ciudad } : p)));
    toast({ title: "Sucursal asignada", description: `La pantalla ahora apunta a: ${suc.nombre}` });
  };

  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("");
    setCiudadFilter("");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("");
  };

  const filteredPantallas = pantallas.filter(pantalla => {
    const matchesSearch = pantalla.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pantalla.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !regionFilter || regionFilter === "all" || pantalla.region === regionFilter;
    const matchesProvincia = !provinciaFilter || provinciaFilter === "all" || pantalla.provincia === provinciaFilter;
    const matchesCiudad = !ciudadFilter || ciudadFilter === "all" || pantalla.ciudad === ciudadFilter;
    const matchesSucursal = !sucursalFilter || sucursalFilter === "all" || pantalla.sucursalNombre === sucursalFilter;
    
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
                {regionFilter && regionFilter !== "all" && regiones[regionFilter as keyof typeof regiones].map(prov => (
                  <SelectItem key={prov} value={prov}>{prov}</SelectItem>
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
                {provinciaFilter && provinciaFilter !== "all" && ciudades[provinciaFilter as keyof typeof ciudades]?.map(ciudad => (
                  <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
              <SelectTrigger className="bg-admin-bg border-admin-border-light text-admin-text-primary">
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent className="bg-admin-surface border-admin-border-light">
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {sucursales.map((s) => (
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
          {filteredPantallas.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-admin-text-secondary">{p.identificador}</TableCell>
              <TableCell className="font-medium text-admin-text-primary">{p.nombre}</TableCell>
              <TableCell>
                <Select
                  value={String(p.sucursalId ?? "")}
                  onValueChange={(val) => actualizarSucursal(p.id, Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-admin-text-secondary">
                  <Layers3 className="h-4 w-4" />
                  <span>{p.publicidadIds.length} elementos</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Dialog open={dialogOpenFor === p.id} onOpenChange={(o) => setDialogOpenFor(o ? p.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Asignar publicidad</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Asignar publicidad</DialogTitle>
                      <DialogDescription>Seleccione el contenido a mostrar en "{p.nombre}"</DialogDescription>
                    </DialogHeader>

                    <div className="max-h-64 overflow-auto space-y-2 pr-1">
                      {publicidadCatalogo.map((item) => (
                        <label key={item.id} className="flex items-center gap-3">
                          <Checkbox
                            checked={tempAds.includes(item.id)}
                            onCheckedChange={() => toggleAd(item.id)}
                            aria-label={`Seleccionar ${item.nombre}`}
                          />
                          <span className="text-admin-text-primary">{item.nombre}</span>
                        </label>
                      ))}
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
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default Pantallas;
