import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProvincias } from "@/hooks/useProvincias";
import { useCantones } from "@/hooks/useCantones";
import { useRegiones } from "@/hooks/useRegiones";

// Tipos
interface Usuario {
  id: number;
  codigo: string;
  nombre: string;
  correo: string;
  telefono: string;
  cedula: string;
  rol: string;
  sucursal: string;
  region: string;
  provincia: string;
  ciudad: string;
}

const sucursales = ["Sucursal Centro", "Sucursal Norte", "Sucursal Sur"];
const rolesPosibles = ["Técnico", "Gerente", "Administrador"];

// Esquema de validación
const schema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  correo: z
    .string()
    .email("Ingresa un correo válido"),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "Formato de teléfono inválido"),
  cedula: z
    .string()
    .min(10, "La cédula debe tener 10 dígitos")
    .max(10, "La cédula debe tener 10 dígitos")
    .regex(/^[0-9]+$/, "La cédula solo debe contener números"),
  rol: z.string().min(1, "El rol es obligatorio"),
  sucursal: z.string().min(1, "La sucursal es obligatoria"),
  region: z.string().min(1, "La región es obligatoria"),
  provincia: z.string().min(1, "La provincia es obligatoria"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
});

type FormValues = z.infer<typeof schema>;

const initialData: Usuario[] = [
  {
    id: 1,
    codigo: "0000",
    nombre: "Administrador",
    correo: "admin@empresa.com",
    telefono: "0999999999",
    cedula: "1234567890",
    rol: "Administrador",
    sucursal: "Sucursal Centro",
    region: "sierra",
    provincia: "Pichincha",
    ciudad: "Quito",
  },
  {
    id: 2,
    codigo: "0001",
    nombre: "María Gómez",
    correo: "maria.gomez@empresa.com",
    telefono: "0987654321",
    cedula: "0987654321",
    rol: "Gerente",
    sucursal: "Sucursal Centro",
    region: "sierra",
    provincia: "Pichincha",
    ciudad: "Quito",
  },
  {
    id: 3,
    codigo: "0002",
    nombre: "Juan Pérez",
    correo: "juan.perez@empresa.com",
    telefono: "0912345678",
    cedula: "1122334455",
    rol: "Técnico",
    sucursal: "Sucursal Norte",
    region: "costa",
    provincia: "Guayas",
    ciudad: "Guayaquil",
  },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const { toast } = useToast();

  // Cargar datos desde la base de datos
  const { regiones } = useRegiones();
  const { data: provincias = [], isLoading: loadingProvincias } = useProvincias();
  const { data: cantones = [], isLoading: loadingCantones } = useCantones();

  // Filtrar provincias por región seleccionada para filtros
  const provinciasFiltradas = useMemo(() => {
    if (!regionFilter) return provincias;
    const regionSeleccionada = regiones.find(r => r.id === regionFilter);
    return provincias.filter(p => regionSeleccionada?.provincias.includes(p.nombre));
  }, [regionFilter, provincias, regiones]);

  // Filtrar cantones por provincia seleccionada para filtros
  const cantonesFiltrados = useMemo(() => {
    if (!provinciaFilter) return cantones;
    const provinciaSeleccionada = provincias.find(p => p.nombre === provinciaFilter);
    return cantones.filter(c => c.provincia_id === provinciaSeleccionada?.id);
  }, [provinciaFilter, cantones, provincias]);

  // SEO básico
  useEffect(() => {
    document.title = "Usuarios administrativos | Panel";
    const ensureMeta = (name: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", name);
        document.head.appendChild(m);
      }
      return m;
    };
    const md = ensureMeta("description");
    md.setAttribute(
      "content",
      "Gestión de usuarios administrativos: listar, crear y editar con validaciones."
    );
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/usuarios`);
  }, []);

  const [regionSeleccionada, setRegionSeleccionada] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  // Filtrar provincias por región seleccionada para el formulario
  const provinciasFormulario = useMemo(() => {
    if (!regionSeleccionada) return [];
    const regionSel = regiones.find(r => r.id === regionSeleccionada);
    return provincias.filter(p => regionSel?.provincias.includes(p.nombre));
  }, [regionSeleccionada, provincias, regiones]);

  // Filtrar cantones por provincia seleccionada para el formulario
  const cantonesFormulario = useMemo(() => {
    if (!provinciaSeleccionada) return [];
    const provinciaSel = provincias.find(p => p.nombre === provinciaSeleccionada);
    return cantones.filter(c => c.provincia_id === provinciaSel?.id);
  }, [provinciaSeleccionada, cantones, provincias]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      correo: "",
      telefono: "",
      cedula: "",
      rol: "",
      sucursal: "",
      region: "",
      provincia: "",
      ciudad: "",
    },
    mode: "onBlur",
  });

  const onNueva = () => {
    setEditando(null);
    setRegionSeleccionada("");
    setProvinciaSeleccionada("");
    form.reset({ 
      nombre: "", 
      correo: "", 
      telefono: "",
      cedula: "",
      rol: "", 
      sucursal: "",
      region: "",
      provincia: "",
      ciudad: "",
    });
    setOpen(true);
  };

  const onEditar = (u: Usuario) => {
    setEditando(u);
    setRegionSeleccionada(u.region);
    setProvinciaSeleccionada(u.provincia);
    form.reset({
      nombre: u.nombre,
      correo: u.correo,
      telefono: u.telefono,
      cedula: u.cedula,
      rol: u.rol,
      sucursal: u.sucursal,
      region: u.region,
      provincia: u.provincia,
      ciudad: u.ciudad,
    });
    setOpen(true);
  };

  const correosExistentes = useMemo(
    () => new Set(usuarios.map((u) => u.correo.toLowerCase())),
    [usuarios]
  );

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    // Búsqueda por identificador, nombre o cédula
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        usuario.codigo.toLowerCase().includes(searchLower) ||
        usuario.nombre.toLowerCase().includes(searchLower) ||
        usuario.cedula.includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Filtro por región
    if (regionFilter && regionFilter !== "all" && usuario.region !== regionFilter) {
      return false;
    }
    
    // Filtro por provincia
    if (provinciaFilter && provinciaFilter !== "all" && usuario.provincia !== provinciaFilter) {
      return false;
    }
    
    // Filtro por ciudad
    if (ciudadFilter && ciudadFilter !== "all" && usuario.ciudad !== ciudadFilter) {
      return false;
    }
    
    // Filtro por sucursal
    if (sucursalFilter && sucursalFilter !== "all" && usuario.sucursal !== sucursalFilter) {
      return false;
    }
    
    // Filtro por rol
    if (rolFilter && rolFilter !== "all" && usuario.rol !== rolFilter) {
      return false;
    }
    
    return true;
  });

  const onSubmit = (values: FormValues) => {
    // Validación de duplicado (case-insensitive)
    const esMismoCorreo = (email: string) =>
      editando && editando.correo.toLowerCase() === email.toLowerCase();

    if (correosExistentes.has(values.correo.toLowerCase()) && !esMismoCorreo(values.correo)) {
      form.setError("correo", {
        type: "manual",
        message: "El correo ya existe",
      });
      return;
    }

    if (editando) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editando.id
            ? { ...u, ...values }
            : u
        )
      );
      toast({ title: "Usuario actualizado", description: `${values.nombre} fue editado.` });
    } else {
      const nuevoId = Math.max(0, ...usuarios.map((u) => u.id)) + 1;
      // Generar código incremental
      const maxCodigo = Math.max(0, ...usuarios.map((u) => parseInt(u.codigo)));
      const nuevoCodigo = String(maxCodigo + 1).padStart(4, "0");
      
      const nuevo: Usuario = {
        id: nuevoId,
        codigo: nuevoCodigo,
        nombre: values.nombre,
        correo: values.correo,
        telefono: values.telefono,
        cedula: values.cedula,
        rol: values.rol,
        sucursal: values.sucursal,
        region: values.region,
        provincia: values.provincia,
        ciudad: values.ciudad,
      };
      setUsuarios((prev) => [nuevo, ...prev]);
      toast({ title: "Usuario creado", description: `${values.nombre} fue agregado.` });
    }

    setOpen(false);
  };

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onNueva}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
              <DialogDescription>
                {editando
                  ? "Actualiza los datos del usuario."
                  : "Completa el formulario para crear un nuevo usuario."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="correo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input placeholder="correo@empresa.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="0999999999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" maxLength={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Región</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setRegionSeleccionada(value);
                              form.setValue("provincia", "");
                              form.setValue("ciudad", "");
                              setProvinciaSeleccionada("");
                            }} 
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona región" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="costa">Costa</SelectItem>
                              <SelectItem value="sierra">Sierra</SelectItem>
                              <SelectItem value="amazonia">Amazonía</SelectItem>
                              <SelectItem value="galapagos">Galápagos</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provincia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setProvinciaSeleccionada(value);
                              form.setValue("ciudad", "");
                            }} 
                            value={field.value}
                            disabled={!regionSeleccionada || loadingProvincias}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona provincia" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {provinciasFormulario.map((p) => (
                                <SelectItem key={p.id} value={p.nombre}>
                                  {p.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ciudad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!provinciaSeleccionada || loadingCantones}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona ciudad" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {cantonesFormulario.map((c) => (
                                <SelectItem key={c.id} value={c.nombre}>
                                  {c.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="rol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                              {rolesPosibles.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sucursal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sucursal</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una sucursal" />
                            </SelectTrigger>
                            <SelectContent>
                              {sucursales.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">{editando ? "Guardar cambios" : "Crear usuario"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regiones.map(region => (
                  <SelectItem key={region.id} value={region.id}>{region.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={provinciaFilter} onValueChange={setProvinciaFilter} disabled={loadingProvincias}>
              <SelectTrigger>
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provinciasFiltradas.map(provincia => (
                  <SelectItem key={provincia.id} value={provincia.nombre}>{provincia.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ciudadFilter} onValueChange={setCiudadFilter} disabled={loadingCantones}>
              <SelectTrigger>
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cantonesFiltrados.map(canton => (
                  <SelectItem key={canton.id} value={canton.nombre}>{canton.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sucursales</SelectItem>
                <SelectItem value="Sucursal Centro">Sucursal Centro</SelectItem>
                <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                <SelectItem value="Sucursal Sur">Sucursal Sur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={rolFilter} onValueChange={setRolFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {rolesPosibles.map((rol) => (
                  <SelectItem key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setRegionFilter("");
              setProvinciaFilter("");
              setCiudadFilter("");
              setSucursalFilter("");
              setRolFilter("");
            }}
          >
            Limpiar Filtros
          </Button>
        </CardContent>
      </Card>

      <section>
        <Table>
          <TableCaption>Listado de usuarios administrativos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono">{u.codigo}</TableCell>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.telefono}</TableCell>
                <TableCell>{u.cedula}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>{u.sucursal}</TableCell>
                <TableCell>{u.ciudad}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => onEditar(u)}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
