import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Trash2, Pencil, Shield } from "lucide-react";
import { useUsuarios, type MiembroConUsuario } from "@/hooks/useUsuarios";
import { useCreateUsuario, useDeleteUsuarioMiembro } from "@/hooks/useUsuariosMutations";
import { useRolesByCuenta, getUserMaxRoleLevel, canAssignRole } from "@/hooks/useRolesByCuenta";
import { useCuenta } from "@/contexts/CuentaContext";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditUsuarioDialog } from "@/components/EditUsuarioDialog";

export default function Usuarios() {
  const { data: miembrosDB = [], isLoading } = useUsuarios();
  const { data: roles = [] } = useRolesByCuenta();
  const { usuario: currentUser, miembro: currentMiembro } = useCuenta();
  const createUsuario = useCreateUsuario();
  const deleteUsuario = useDeleteUsuarioMiembro();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState<MiembroConUsuario | null>(null);
  const { toast } = useToast();

  // Calculate current user's permission level
  const currentUserLevel = getUserMaxRoleLevel(
    currentMiembro ? [] : [], // Would need to fetch current user's roles
    currentUser?.super_admin || false
  );
  const isSuperAdmin = currentUser?.super_admin || false;

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    password: "",
    rolId: "",
  });

  useEffect(() => {
    document.title = "Usuarios administrativos | Panel";
  }, []);

  const miembrosFiltrados = miembrosDB.filter((miembro: MiembroConUsuario) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const email = miembro.usuario?.email?.toLowerCase() || "";
    const nombre = miembro.usuario?.nombre?.toLowerCase() || "";
    return email.includes(searchLower) || nombre.includes(searchLower);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.nombre || !formData.password) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUsuario.mutateAsync(formData);
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido agregado exitosamente",
      });
      setIsDialogOpen(false);
      setFormData({ email: "", nombre: "", password: "", rolId: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedMiembro) return;

    try {
      await deleteUsuario.mutateAsync(selectedMiembro.id);
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido removido de la cuenta",
      });
      setDeleteDialogOpen(false);
      setSelectedMiembro(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      activo: "default",
      inactivo: "secondary",
      pendiente: "outline",
    };
    return <Badge variant={variants[estado] || "outline"}>{estado}</Badge>;
  };

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo usuario
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Super Admin</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : miembrosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                miembrosFiltrados.map((miembro: MiembroConUsuario) => (
                  <TableRow key={miembro.id}>
                    <TableCell>{miembro.usuario?.email || "—"}</TableCell>
                    <TableCell>{miembro.usuario?.nombre || "—"}</TableCell>
                    <TableCell>{getEstadoBadge(miembro.estado)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {miembro.roles && miembro.roles.length > 0 ? (
                          miembro.roles.map((r, idx) => (
                            <Badge key={idx} variant="outline">
                              {r.rol?.nombre || "—"}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {miembro.usuario?.super_admin ? (
                        <Badge variant="default">Sí</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {miembro.creado_en
                        ? new Date(miembro.creado_en).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedMiembro(miembro);
                            setEditDialogOpen(true);
                          }}
                          title="Editar usuario"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedMiembro(miembro);
                            setDeleteDialogOpen(true);
                          }}
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear nuevo usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Agrega un nuevo usuario administrativo a la cuenta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              {/* Selector de rol inicial */}
              {roles.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="rolId">Rol Inicial (opcional)</Label>
                  <Select
                    value={formData.rolId}
                    onValueChange={(value) => setFormData({ ...formData, rolId: value })}
                  >
                    <SelectTrigger id="rolId">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles
                        .filter(role => isSuperAdmin || canAssignRole(currentUserLevel, role.nombre))
                        .map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createUsuario.isPending}>
                {createUsuario.isPending ? "Creando..." : "Crear usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción removerá al usuario "{selectedMiembro?.usuario?.nombre || selectedMiembro?.usuario?.email}" 
              de la cuenta. El usuario no será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para editar usuario */}
      <EditUsuarioDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        miembro={selectedMiembro}
      />
    </main>
  );
}
