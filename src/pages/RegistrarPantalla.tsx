import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Search, Filter } from "lucide-react";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";
import { useSucursales } from "@/hooks/useSucursales";
import { useCreatePantalla } from "@/hooks/usePantallasMutations";

const RegistrarPantalla = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createPantalla = useCreatePantalla();
  
  const { regiones } = useRegiones();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { data: sucursalesDB = [] } = useSucursales();

  const [searchSucursal, setSearchSucursal] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [nombre, setNombre] = useState("");
  const [sucursalId, setSucursalId] = useState<string>("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = "Agregar Pantalla | Panel Admin";
  }, []);

  const sucursales = sucursalesDB.map((s: any) => ({
    id: s.id,
    nombre: s.nombre,
    provincia: s.provincia?.nombre || "",
    ciudad: s.canton?.nombre || ""
  }));

  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter || regionFilter === "all") return provincias;
    const regionSeleccionada = regiones.find(r => r.id === regionFilter);
    return provincias.filter(p => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  const cantonesFiltrados = useMemo(() => {
    if (!provinciaFilter || provinciaFilter === "all") return cantones;
    const provinciaSeleccionada = provincias.find(p => p.nombre === provinciaFilter);
    return cantones.filter(c => c.provincia_id === provinciaSeleccionada?.id);
  }, [provinciaFilter, cantones, provincias]);

  const filteredSucursales = useMemo(() => {
    return sucursales.filter((sucursal: any) => {
      const matchesSearch = sucursal.nombre.toLowerCase().includes(searchSucursal.toLowerCase());
      const matchesProvincia = !provinciaFilter || provinciaFilter === "all" || sucursal.provincia === provinciaFilter;
      const matchesCiudad = !ciudadFilter || ciudadFilter === "all" || sucursal.ciudad === ciudadFilter;
      return matchesSearch && matchesProvincia && matchesCiudad;
    });
  }, [sucursales, searchSucursal, provinciaFilter, ciudadFilter]);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = "El nombre es requerido";
    if (!sucursalId) e.sucursalId = "Seleccione una sucursal";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;

    await createPantalla.mutateAsync({
      nombre,
      sucursal_id: sucursalId,
      estado: "activa",
    });
    
    navigate("/pantallas");
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-xl font-semibold text-admin-text-primary">Agregar Pantalla</h1>
      </header>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la pantalla</Label>
          <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Pantalla Recepción" />
          {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label>Sucursal</Label>
          <Card className="bg-admin-surface border-admin-border-light mb-4">
            <CardHeader>
              <CardTitle className="flex items-center text-admin-text-primary text-sm">
                <Filter className="h-4 w-4 mr-2" />Filtrar Sucursales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                <Input placeholder="Buscar..." value={searchSucursal} onChange={(e) => setSearchSucursal(e.target.value)} className="pl-10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setProvinciaFilter(""); setCiudadFilter(""); }}>
                  <SelectTrigger><SelectValue placeholder="Región" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {regiones.map(r => <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={provinciaFilter} onValueChange={(v) => { setProvinciaFilter(v); setCiudadFilter(""); }} disabled={!regionFilter || regionFilter === "all"}>
                  <SelectTrigger><SelectValue placeholder="Provincia" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {provinciasFiltradas.map(p => <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={ciudadFilter} onValueChange={setCiudadFilter} disabled={!provinciaFilter || provinciaFilter === "all"}>
                  <SelectTrigger><SelectValue placeholder="Ciudad" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {cantonesFiltrados.map(c => <SelectItem key={c.id} value={c.nombre}>{c.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Select value={sucursalId} onValueChange={setSucursalId}>
            <SelectTrigger><SelectValue placeholder="Seleccione la sucursal" /></SelectTrigger>
            <SelectContent>
              {filteredSucursales.map((suc: any) => <SelectItem key={suc.id} value={suc.id}>{suc.nombre} - {suc.provincia}</SelectItem>)}
            </SelectContent>
          </Select>
          {errores.sucursalId && <p className="text-sm text-red-500">{errores.sucursalId}</p>}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit"><Save className="mr-2 h-4 w-4" />Registrar Pantalla</Button>
        </div>
      </form>
    </section>
  );
};

export default RegistrarPantalla;
