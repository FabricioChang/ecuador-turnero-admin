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
import { useUsuarios } from "@/hooks/useUsuarios";
import { useAsignarRol } from "@/hooks/useUsuarioRoles";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type AppRole = Database["public"]["Enums"]["app_role"];

// Esquema de validación
const schema = z.object({
  nombres: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z
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
  provincia_id: z.string().min(1, "La provincia es obligatoria"),
  canton_id: z.string().min(1, "La ciudad es obligatoria"),
  direccion: z.string().optional(),
  role: z.enum(["admin", "supervisor", "operador", "usuario"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Usuarios() {
  const { data: usuariosDB = [], isLoading: loadingUsuarios } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState("");
  const [provinciaFilter, setProvinciaFilter] = useState("");
  const [cantonFilter, setCantonFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);
  const { toast } = useToast();

  // Cargar datos desde la base de datos
  const { data: provincias = [], isLoading: loadingProvincias } = useProvincias();
  const { data: cantones = [], isLoading: loadingCantones } = useCantones();
  const asignarRol = useAsignarRol();

  // Filtrar cantones por provincia seleccionada para filtros
  const cantonesFiltrados = useMemo(() => {
    if (!provinciaFilter) return cantones;
    return cantones.filter((c: any) => c.provincia_id === provinciaFilter);
  }, [provinciaFilter, cantones]);

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

  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  // Filtrar cantones por provincia seleccionada para el formulario
  const cantonesFormulario = useMemo(() => {
    if (!provinciaSeleccionada) return [];
    return cantones.filter((c: any) => c.provincia_id === provinciaSeleccionada);
  }, [provinciaSeleccionada, cantones]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      cedula: "",
      provincia_id: "",
      canton_id: "",
      direccion: "",
      role: undefined,
    },
    mode: "onBlur",
  });

  const onNueva = () => {
    setEditando(null);
    setProvinciaSeleccionada("");
    form.reset({ 
      nombres: "", 
      apellidos: "",
      email: "", 
      telefono: "",
      cedula: "",
      provincia_id: "",
      canton_id: "",
      direccion: "",
      role: undefined,
    });
    setOpen(true);
  };

  const onEditar = (u: any) => {
    setEditando(u);
    setProvinciaSeleccionada(u.provincia_id || "");
    const userRole = u.user_roles?.[0]?.role || undefined;
    form.reset({
      nombres: u.nombres,
      apellidos: u.apellidos,
      email: u.email,
      telefono: u.telefono || "",
      cedula: u.cedula || "",
      provincia_id: u.provincia_id || "",
      canton_id: u.canton_id || "",
      direccion: u.direccion || "",
      role: userRole as any,
    });
    setOpen(true);
  };

  const correosExistentes = useMemo(
    () => new Set(usuariosDB.map((u: any) => u.email.toLowerCase())),
    [usuariosDB]
  );

  // Filtrar usuarios
  const usuariosFiltrados = usuariosDB.filter((usuario: any) => {
    // Búsqueda por identificador, nombre o cédula
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      const matchesSearch = 
        usuario.identificador.toLowerCase().includes(searchLower) ||
        nombreCompleto.includes(searchLower) ||
        (usuario.cedula && usuario.cedula.includes(searchTerm));
      
      if (!matchesSearch) return false;
    }
    
    // Filtro por provincia
    if (provinciaFilter && provinciaFilter !== "all" && usuario.provincia_id !== provinciaFilter) {
      return false;
    }
    
    // Filtro por cantón
    if (cantonFilter && cantonFilter !== "all" && usuario.canton_id !== cantonFilter) {
      return false;
    }
    
    return true;
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Validación de duplicado (case-insensitive)
      const esMismoCorreo = (email: string) =>
        editando && editando.email.toLowerCase() === email.toLowerCase();

      if (correosExistentes.has(values.email.toLowerCase()) && !esMismoCorreo(values.email)) {
        form.setError("email", {
          type: "manual",
          message: "El correo ya existe",
        });
        return;
      }

      if (editando) {
        // Actualizar usuario existente
        const { error } = await supabase
          .from("profiles")
          .update({
            nombres: values.nombres,
            apellidos: values.apellidos,
            email: values.email,
            telefono: values.telefono || null,
            cedula: values.cedula || null,
            provincia_id: values.provincia_id || null,
            canton_id: values.canton_id || null,
            direccion: values.direccion || null,
          })
          .eq("id", editando.id);

        if (error) throw error;

        // Asignar rol si se especificó
        if (values.role) {
          await asignarRol.mutateAsync({
            userId: editando.id,
            role: values.role as AppRole,
          });
        }

        toast({ 
          title: "Usuario actualizado", 
          description: `${values.nombres} ${values.apellidos} fue editado.` 
        });
      } else {
        // Crear nuevo usuario
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: Math.random().toString(36).slice(-8), // Contraseña temporal
          options: {
            data: {
              nombres: values.nombres,
              apellidos: values.apellidos,
              telefono: values.telefono,
              cedula: values.cedula,
            },
          },
        });

        if (authError) throw authError;

        // Actualizar el perfil con los datos adicionales
        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              provincia_id: values.provincia_id || null,
              canton_id: values.canton_id || null,
              direccion: values.direccion || null,
            })
            .eq("id", authData.user.id);

          if (profileError) throw profileError;

          // Assign role if specified
          if (values.role) {
            await asignarRol.mutateAsync({
              userId: authData.user.id,
              role: values.role as AppRole,
            });
          }
        }

        toast({ 
          title: "Usuario creado", 
          description: `${values.nombres} ${values.apellidos} fue agregado.` 
        });
      }

      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const limpiarFiltros = () => {
    setSearchTerm("");
    setProvinciaFilter("");
    setCantonFilter("");
  };

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onNueva}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar usuario" : "Crear nuevo usuario"}</DialogTitle>
              <DialogDescription>
                {editando
                  ? "Modifica los datos del usuario"
                  : "Completa el formulario para registrar un usuario"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombres" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellidos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellidos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="usuario@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="0999999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="provincia_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setProvinciaSeleccionada(value);
                              form.setValue("canton_id", "");
                            }} 
                            value={field.value}
                            disabled={loadingProvincias}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona provincia" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {provincias.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>
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
                    name="canton_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantón</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!provinciaSeleccionada || loadingCantones}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona cantón" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {cantonesFormulario.map((c: any) => (
                                <SelectItem key={c.id} value={c.id}>
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

                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle, número, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="operador">Operador</SelectItem>
                            <SelectItem value="usuario">Usuario</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

            <Select value={provinciaFilter} onValueChange={setProvinciaFilter} disabled={loadingProvincias}>
              <SelectTrigger>
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provincias.map((provincia: any) => (
                  <SelectItem key={provincia.id} value={provincia.id}>{provincia.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cantonFilter} onValueChange={setCantonFilter} disabled={loadingCantones}>
              <SelectTrigger>
                <SelectValue placeholder="Cantón" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todos los cantones</SelectItem>
                {cantonesFiltrados.map((canton: any) => (
                  <SelectItem key={canton.id} value={canton.id}>{canton.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent className="pt-6">
          {loadingUsuarios ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando usuarios...
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay usuarios que coincidan con los filtros
            </div>
          ) : (
            <Table>
              <TableCaption>
                Lista de usuarios administrativos ({usuariosFiltrados.length})
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Provincia</TableHead>
                  <TableHead>Cantón</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((usuario: any) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.identificador}</TableCell>
                    <TableCell>{usuario.nombres} {usuario.apellidos}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.telefono || "—"}</TableCell>
                    <TableCell>{usuario.cedula || "—"}</TableCell>
                    <TableCell>{usuario.provincia?.nombre || "—"}</TableCell>
                    <TableCell>{usuario.canton?.nombre || "—"}</TableCell>
                    <TableCell>
                      {usuario.user_roles?.[0]?.role ? (
                        <span className="capitalize">{usuario.user_roles[0].role}</span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditar(usuario)}
                        aria-label="Editar usuario"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
