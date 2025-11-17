import React, { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Rol {
  id: number;
  nombre: string;
  permisos: string[];
}

interface Permiso {
  id: string;
  label: string;
}

interface Categoria {
  nombre: string;
  permisos: Permiso[];
}

const categorias: Categoria[] = [
  {
    nombre: "Usuarios",
    permisos: [
      { id: "usuarios_crear", label: "Crear" },
      { id: "usuarios_editar", label: "Editar" },
      { id: "usuarios_eliminar", label: "Eliminar" },
    ],
  },
  {
    nombre: "Roles",
    permisos: [
      { id: "roles_crear", label: "Crear" },
      { id: "roles_editar", label: "Editar" },
      { id: "roles_eliminar", label: "Eliminar" },
    ],
  },
  {
    nombre: "Sucursales",
    permisos: [
      { id: "sucursales_crear", label: "Crear" },
      { id: "sucursales_editar", label: "Editar" },
      { id: "sucursales_eliminar", label: "Eliminar" },
    ],
  },
  {
    nombre: "Kioskos",
    permisos: [
      { id: "kioskos_crear", label: "Crear" },
      { id: "kioskos_editar", label: "Editar" },
      { id: "kioskos_eliminar", label: "Eliminar" },
    ],
  },
  {
    nombre: "Pantallas",
    permisos: [
      { id: "pantallas_crear", label: "Crear" },
      { id: "pantallas_editar", label: "Editar" },
      { id: "pantallas_eliminar", label: "Eliminar" },
    ],
  },
  {
    nombre: "Publicidad",
    permisos: [
      { id: "publicidad_crear", label: "Crear" },
      { id: "publicidad_editar", label: "Editar" },
      { id: "publicidad_eliminar", label: "Eliminar" },
    ],
  },
  {
    nombre: "Reportes",
    permisos: [
      { id: "reportes_generar", label: "Generar" },
    ],
  },
];

const permisosDisponibles = categorias.flatMap(cat => cat.permisos);

const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  permisos: z
    .array(z.string())
    .min(1, "Selecciona al menos un permiso"),
});

type FormValues = z.infer<typeof schema>;

const inicial: Rol[] = [
  { id: 1, nombre: "Técnico", permisos: ["kioskos_crear", "kioskos_editar", "pantallas_crear", "pantallas_editar"] },
  { id: 2, nombre: "Gerente", permisos: ["reportes_generar"] },
  { id: 3, nombre: "Administrador", permisos: permisosDisponibles.map(p => p.id) },
];

export default function Roles() {
  const [roles, setRoles] = useState<Rol[]>(inicial);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Rol | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [categoriasTabla, setCategoriasTabla] = useState<Record<number, string>>({});
  const { toast } = useToast();
  
  const todosLosPermisos = permisosDisponibles.map(p => p.id);
  
  const tieneTodasLosPermisos = (permisos: string[]) => {
    return todosLosPermisos.every(p => permisos.includes(p));
  };

  // SEO básico
  useEffect(() => {
    document.title = "Roles y permisos | Panel";
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
      "Crea y edita roles con permisos asignables. Prototipo con validaciones."
    );
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/roles`);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      permisos: [],
    },
    mode: "onBlur",
  });

  const onNuevo = () => {
    setEditando(null);
    form.reset({ nombre: "", permisos: [] });
    setCategoriaSeleccionada("");
    setEsAdministrador(false);
    setOpen(true);
  };

  const onEditar = (r: Rol) => {
    setEditando(r);
    form.reset({ nombre: r.nombre, permisos: r.permisos });
    setCategoriaSeleccionada("");
    setEsAdministrador(tieneTodasLosPermisos(r.permisos));
    setOpen(true);
  };
  
  const toggleAdministrador = (checked: boolean) => {
    setEsAdministrador(checked);
    if (checked) {
      form.setValue("permisos", todosLosPermisos);
    } else {
      form.setValue("permisos", []);
    }
  };

  const onSubmit = (values: FormValues) => {
    if (editando) {
      setRoles((prev) => prev.map((r) => (r.id === editando.id ? { ...r, ...values } : r)));
      toast({ title: "Rol actualizado", description: `${values.nombre} fue editado.` });
    } else {
      const nuevoId = Math.max(0, ...roles.map((r) => r.id)) + 1;
      const nuevo: Rol = {
        id: nuevoId,
        nombre: values.nombre,
        permisos: values.permisos,
      };
      setRoles((prev) => [nuevo, ...prev]);
      toast({ title: "Rol creado", description: `${values.nombre} fue agregado.` });
    }
    setOpen(false);
  };

  const etiquetaPermiso = (id: string) => {
    for (const categoria of categorias) {
      const permiso = categoria.permisos.find((p) => p.id === id);
      if (permiso) {
        return `${categoria.nombre} - ${permiso.label}`;
      }
    }
    return id;
  };

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onNuevo}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo rol
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar rol" : "Nuevo rol"}</DialogTitle>
              <DialogDescription>
                {editando
                  ? "Actualiza el nombre y los permisos del rol."
                  : "Define un nombre y selecciona permisos para el nuevo rol."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del rol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                    <Checkbox 
                      id="administrador" 
                      checked={esAdministrador}
                      onCheckedChange={toggleAdministrador}
                    />
                    <Label htmlFor="administrador" className="cursor-pointer font-medium">
                      Administrador (Todos los permisos)
                    </Label>
                  </div>

                  <div>
                    <Label>Categoría</Label>
                    <Select 
                      value={categoriaSeleccionada} 
                      onValueChange={setCategoriaSeleccionada}
                      disabled={esAdministrador}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.nombre} value={cat.nombre}>
                            {cat.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    control={form.control}
                    name="permisos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permisos</FormLabel>
                        {esAdministrador ? (
                          <div className="border rounded-lg p-4 bg-muted/30">
                            <p className="text-sm text-muted-foreground">
                              ✓ Todos los permisos están otorgados (Administrador)
                            </p>
                          </div>
                        ) : categoriaSeleccionada ? (
                          <div className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {categorias
                                .find((cat) => cat.nombre === categoriaSeleccionada)
                                ?.permisos.map((perm) => {
                                  const checked = field.value?.includes(perm.id);
                                  return (
                                    <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) => {
                                          const isChecked = Boolean(v);
                                          if (isChecked) {
                                            field.onChange([...(field.value ?? []), perm.id]);
                                          } else {
                                            field.onChange((field.value ?? []).filter((p: string) => p !== perm.id));
                                            setEsAdministrador(false);
                                          }
                                        }}
                                      />
                                      <span className="text-sm">{perm.label}</span>
                                    </label>
                                  );
                                })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Selecciona una categoría para ver sus permisos</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">{editando ? "Guardar cambios" : "Crear rol"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <section>
        <Table>
          <TableCaption>Listado de roles y permisos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((r) => {
              const esAdmin = tieneTodasLosPermisos(r.permisos);
              const categoriaActual = categoriasTabla[r.id] || "";
              const permisosCategoria = categoriaActual
                ? r.permisos.filter(p => {
                    const cat = categorias.find(c => c.nombre === categoriaActual);
                    return cat?.permisos.some(perm => perm.id === p);
                  })
                : [];
              
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {r.nombre}
                      {esAdmin && (
                        <Badge variant="default" className="ml-2">
                          Administrador
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {esAdmin ? (
                      <Badge variant="secondary">Todos los permisos</Badge>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Select 
                          value={categoriaActual} 
                          onValueChange={(val) => setCategoriasTabla(prev => ({ ...prev, [r.id]: val }))}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((cat) => {
                              const tienePermisosEnCategoria = cat.permisos.some(p => r.permisos.includes(p.id));
                              if (!tienePermisosEnCategoria) return null;
                              return (
                                <SelectItem key={cat.nombre} value={cat.nombre}>
                                  {cat.nombre}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {categoriaActual && (
                          <div className="flex flex-wrap gap-2">
                            {permisosCategoria.map((p) => {
                              const permiso = categorias
                                .find(c => c.nombre === categoriaActual)
                                ?.permisos.find(perm => perm.id === p);
                              return (
                                <Badge key={p} variant="secondary">
                                  {permiso?.label || p}
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => onEditar(r)}>
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
