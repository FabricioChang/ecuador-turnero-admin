import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Search, Filter } from "lucide-react";

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

const RegistrarPantalla = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchSucursal, setSearchSucursal] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");

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
    document.title = "Agregar Pantalla | Panel Admin";
  }, []);

  // Generar identificador incremental automático
  const pantallasExistentes = [9001, 9002]; // Simulación - en producción vendría de la base de datos
  const nuevoIdentificador = String(Math.max(...pantallasExistentes, 0) + 1);
  const [identificador] = useState(`PAN-${nuevoIdentificador}`);

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

  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setProvinciaFilter("");
    setCiudadFilter("");
  };

  const handleProvinciaChange = (value: string) => {
    setProvinciaFilter(value);
    setCiudadFilter("");
  };

  const filteredSucursales = sucursales.filter(sucursal => {
    const matchesSearch = sucursal.nombre.toLowerCase().includes(searchSucursal.toLowerCase()) ||
                         sucursal.id.toString().includes(searchSucursal);
    const matchesRegion = !regionFilter || regionFilter === "all" || sucursal.region === regionFilter;
    const matchesProvincia = !provinciaFilter || provinciaFilter === "all" || sucursal.provincia === provinciaFilter;
    const matchesCiudad = !ciudadFilter || ciudadFilter === "all" || sucursal.ciudad === ciudadFilter;
    
    return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad;
  });

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

  const [nombre, setNombre] = useState("");
  const [sucursalId, setSucursalId] = useState<string>("");
  const [seleccionPublicidad, setSeleccionPublicidad] = useState<number[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const toggleContenido = (id: number) => {
    setSeleccionPublicidad((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = "El nombre es requerido";
    if (!sucursalId) e.sucursalId = "Seleccione una sucursal";
    if (seleccionPublicidad.length === 0) e.publicidad = "Seleccione al menos un contenido";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;

    const suc = filteredSucursales.find((s) => String(s.id) === sucursalId)!;
    const payload = {
      id: Date.now(),
      identificador,
      nombre,
      sucursalId: suc.id,
      sucursalNombre: suc.nombre,
      publicidadIds: [...seleccionPublicidad],
      region: suc.region,
      provincia: suc.provincia,
      ciudad: suc.ciudad,
    };

    toast({ title: "Pantalla creada", description: `Se creó "${nombre}" correctamente.` });
    navigate("/pantallas", { state: { newPantalla: payload } });
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
          <Label htmlFor="identificador">Identificador</Label>
          <Input id="identificador" value={identificador} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">Este código se genera automáticamente</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la pantalla</Label>
          <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Pantalla Recepción" />
          {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label>Sucursal a la que va dirigida</Label>
          
          {/* Filtros de Sucursal */}
          <Card className="bg-admin-surface border-admin-border-light mb-4">
            <CardHeader>
              <CardTitle className="flex items-center text-admin-text-primary text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar Sucursales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-admin-text-muted" />
                <Input
                  placeholder="Buscar por identificador o nombre..."
                  value={searchSucursal}
                  onChange={(e) => setSearchSucursal(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Región</Label>
                  <Select value={regionFilter} onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Región" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="costa">Costa</SelectItem>
                      <SelectItem value="sierra">Sierra</SelectItem>
                      <SelectItem value="amazonia">Amazonía</SelectItem>
                      <SelectItem value="galapagos">Galápagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Provincia</Label>
                  <Select 
                    value={provinciaFilter} 
                    onValueChange={handleProvinciaChange}
                    disabled={!regionFilter || regionFilter === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {regionFilter && regionFilter !== "all" && regiones[regionFilter as keyof typeof regiones].map(prov => (
                        <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Ciudad</Label>
                  <Select 
                    value={ciudadFilter} 
                    onValueChange={setCiudadFilter}
                    disabled={!provinciaFilter || provinciaFilter === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {provinciaFilter && provinciaFilter !== "all" && ciudades[provinciaFilter as keyof typeof ciudades]?.map(ciudad => (
                        <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Select value={sucursalId} onValueChange={setSucursalId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una sucursal" />
            </SelectTrigger>
            <SelectContent>
              {filteredSucursales.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errores.sucursalId && <p className="text-sm text-red-500">{errores.sucursalId}</p>}
        </div>

        <div className="space-y-3">
          <Label>Contenido publicitario a mostrar</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publicidadCatalogo.map((item) => (
              <label key={item.id} className="flex items-center gap-3 rounded-md border border-admin-border-light p-3">
                <Checkbox checked={seleccionPublicidad.includes(item.id)} onCheckedChange={() => toggleContenido(item.id)} />
                <span className="text-admin-text-primary">{item.nombre}</span>
              </label>
            ))}
          </div>
          {errores.publicidad && <p className="text-sm text-red-500">{errores.publicidad}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Guardar pantalla
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RegistrarPantalla;
