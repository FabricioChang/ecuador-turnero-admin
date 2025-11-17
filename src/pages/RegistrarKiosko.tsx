import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Search, Filter } from "lucide-react";
import { useCreateKiosko } from "@/hooks/useKioskosMutations";
import { useSucursales } from "@/hooks/useSucursales";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";


const RegistrarKiosko = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createKiosko = useCreateKiosko();
  
  // Load data from DB
  const { data: sucursalesDB = [] } = useSucursales();
  const { data: provincias = [] } = useProvincias();
  const { data: cantones = [] } = useCantones();
  const { regiones } = useRegiones();

  useEffect(() => {
    document.title = "Registrar Kiosko | Panel Admin";
  }, []);

  const estados = ["activo", "inactivo", "mantenimiento"] as const;

  // Filtros para buscar sucursal
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    sucursalId: "",
    estado: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar sucursales
  const filteredSucursales = useMemo(() => {
    return sucursalesDB.filter((sucursal: any) => {
      const matchesSearch = 
        sucursal.identificador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sucursal.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = !regionFilter || regionFilter === "all" || 
        regiones.find((r: any) => r.id === regionFilter)?.provincias.includes(sucursal.provincia?.nombre);
      
      const matchesProvincia = !provinciaFilter || provinciaFilter === "all" || 
        sucursal.provincia?.nombre === provinciaFilter;
      
      const matchesCiudad = !ciudadFilter || ciudadFilter === "all" || 
        sucursal.canton?.nombre === ciudadFilter;
      
      return matchesSearch && matchesRegion && matchesProvincia && matchesCiudad;
    });
  }, [sucursalesDB, searchTerm, regionFilter, provinciaFilter, ciudadFilter, regiones]);

  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter || regionFilter === "all") return provincias;
    const region = regiones.find((r: any) => r.id === regionFilter);
    return provincias.filter((p: any) => region?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  const cantonesFiltrados = useMemo(() => {
    if (!provinciaFilter || provinciaFilter === "all") return cantones;
    const provincia = provincias.find((p: any) => p.nombre === provinciaFilter);
    return cantones.filter((c: any) => c.provincia_id === provincia?.id);
  }, [provinciaFilter, cantones, provincias]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!form.sucursalId) e.sucursalId = "Seleccione una sucursal";
    if (!form.estado) e.estado = "Seleccione el estado";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast({ title: "Errores en el formulario", description: "Revise los campos marcados", variant: "destructive" });
      return;
    }

    await createKiosko.mutateAsync({
      nombre: form.nombre,
      sucursal_id: form.sucursalId,
      ubicacion: null,
      estado: form.estado as 'activo' | 'inactivo' | 'mantenimiento',
    });
    
    navigate('/kioskos');
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Registrar Kiosko</h1>
          <p className="text-admin-text-secondary">Cree un kiosko y asígnele su sucursal y estado operativo</p>
        </div>
      </header>

      <main>
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Formulario de registro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Nombre y Estado arriba */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-admin-text-primary">Nombre del kiosko</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, nombre: e.target.value }));
                      if (errors.nombre) setErrors((er) => ({ ...er, nombre: "" }));
                    }}
                    placeholder="Ej: Kiosko Principal Centro"
                    className={`bg-admin-background border-admin-border-light ${errors.nombre ? "border-red-500" : ""}`}
                  />
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-admin-text-primary">Estado operativo</Label>
                  <Select 
                    value={form.estado} 
                    onValueChange={(value) => {
                      setForm((f) => ({ ...f, estado: value }));
                      if (errors.estado) setErrors((er) => ({ ...er, estado: "" }));
                    }}
                  >
                    <SelectTrigger 
                      id="estado" 
                      className={`bg-admin-background border-admin-border-light ${errors.estado ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e.charAt(0).toUpperCase() + e.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
                </div>
              </div>

              {/* Filtros para buscar sucursal */}
              <Card className="bg-admin-background border-admin-border-light">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-admin-text-primary text-base">
                    <Filter className="h-4 w-4" />
                    Filtros de Búsqueda de Sucursal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-admin-text-muted" />
                    <Input
                      placeholder="Buscar por código o nombre de sucursal..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-admin-surface border-admin-border-light"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger className="bg-admin-surface border-admin-border-light">
                        <SelectValue placeholder="Región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las regiones</SelectItem>
                        {regiones.map((r: any) => (
                          <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={provinciaFilter} onValueChange={setProvinciaFilter}>
                      <SelectTrigger className="bg-admin-surface border-admin-border-light">
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las provincias</SelectItem>
                        {provinciasFiltradas.map((p: any) => (
                          <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={ciudadFilter} onValueChange={setCiudadFilter}>
                      <SelectTrigger className="bg-admin-surface border-admin-border-light">
                        <SelectValue placeholder="Ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las ciudades</SelectItem>
                        {cantonesFiltrados.map((c: any) => (
                          <SelectItem key={c.id} value={c.nombre}>{c.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Sucursal asignada */}
              <div className="space-y-2">
                <Label className="text-admin-text-primary">Sucursal asignada</Label>
                <Select
                    value={form.sucursalId}
                    onValueChange={(val) => {
                      setForm((f) => ({ ...f, sucursalId: val }));
                      if (errors.sucursalId) setErrors((er) => ({ ...er, sucursalId: "" }));
                    }}
                  >
                    <SelectTrigger className={`bg-admin-background border-admin-border-light ${errors.sucursalId ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Seleccione una sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSucursales.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.identificador} - {s.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sucursalId && <p className="text-sm text-red-500">{errors.sucursalId}</p>}
                </div>

              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/kioskos')}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Registrar Kiosko
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RegistrarKiosko;
