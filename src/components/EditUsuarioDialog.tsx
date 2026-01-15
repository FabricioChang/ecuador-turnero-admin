import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle } from "lucide-react";
import { useUpdateUsuario } from "@/hooks/useUsuariosMutations";
import { useRolesByCuenta, getUserMaxRoleLevel, canAssignRole, ROLE_HIERARCHY } from "@/hooks/useRolesByCuenta";
import { useCuenta } from "@/contexts/CuentaContext";
import type { MiembroConUsuario } from "@/hooks/useUsuarios";

interface EditUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  miembro: MiembroConUsuario | null;
}

export function EditUsuarioDialog({ open, onOpenChange, miembro }: EditUsuarioDialogProps) {
  const { usuario: currentUser, miembro: currentMiembro } = useCuenta();
  const updateUsuario = useUpdateUsuario();
  const { data: roles = [] } = useRolesByCuenta();

  // Get current user's roles to determine their level
  const [currentUserRoles, setCurrentUserRoles] = useState<{ rol?: { nombre: string } }[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    password: "",
    estado: "activo",
    superAdmin: false,
    selectedRoles: [] as string[],
  });

  // Load current user roles on component mount
  useEffect(() => {
    if (currentMiembro) {
      // Fetch current user's roles from the miembro's roles property
      // This would need to be fetched from the database if not already available
      setCurrentUserRoles([]);
    }
  }, [currentMiembro]);

  // Calculate permission levels
  const currentUserLevel = getUserMaxRoleLevel(currentUserRoles, currentUser?.super_admin || false);
  const isSuperAdmin = currentUser?.super_admin || false;
  const canEditSuperAdmin = isSuperAdmin; // Only super admins can grant super admin
  
  // Check if editing self
  const isEditingSelf = currentMiembro?.id === miembro?.id;

  // Populate form when miembro changes
  useEffect(() => {
    if (miembro) {
      setFormData({
        email: miembro.usuario?.email || "",
        nombre: miembro.usuario?.nombre || "",
        password: "",
        estado: miembro.estado,
        superAdmin: miembro.usuario?.super_admin || false,
        selectedRoles: miembro.roles?.map(r => r.rol?.id).filter(Boolean) as string[] || [],
      });
    }
  }, [miembro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!miembro?.usuario?.id || !miembro?.id) return;

    try {
      await updateUsuario.mutateAsync({
        usuarioId: miembro.usuario.id,
        miembroId: miembro.id,
        email: formData.email,
        nombre: formData.nombre,
        password: formData.password || undefined,
        estado: formData.estado,
        superAdmin: canEditSuperAdmin ? formData.superAdmin : undefined,
        rolIds: formData.selectedRoles,
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const toggleRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId]
    }));
  };

  // Filter roles based on what the current user can assign
  const assignableRoles = roles.filter(role => {
    if (isSuperAdmin) return true; // Super admins can assign any role
    return canAssignRole(currentUserLevel, role.nombre);
  });

  const nonAssignableRoles = roles.filter(role => {
    if (isSuperAdmin) return false;
    return !canAssignRole(currentUserLevel, role.nombre);
  });

  if (!miembro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario y sus permisos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>

              {/* Nueva contraseña (opcional) */}
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nueva Contraseña (dejar vacío para no cambiar)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger id="edit-estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Super Admin - Solo visible para super admins */}
              {canEditSuperAdmin && (
                <div className="flex items-center justify-between rounded-lg border p-4 bg-amber-500/10 border-amber-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      Super Administrador
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Otorga acceso completo a todas las funcionalidades del sistema.
                    </p>
                  </div>
                  <Switch
                    checked={formData.superAdmin}
                    onCheckedChange={(checked) => setFormData({ ...formData, superAdmin: checked })}
                    disabled={isEditingSelf}
                  />
                </div>
              )}

              {isEditingSelf && canEditSuperAdmin && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-100 dark:bg-amber-900/20 p-2 rounded">
                  <AlertTriangle className="h-4 w-4" />
                  No puedes modificar tu propio estado de super administrador.
                </div>
              )}

              {/* Roles */}
              <div className="space-y-3">
                <Label>Roles</Label>
                
                {/* Roles que puede asignar */}
                {assignableRoles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Roles disponibles para asignar:</p>
                    <div className="space-y-2">
                      {assignableRoles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={formData.selectedRoles.includes(role.id)}
                            onCheckedChange={() => toggleRole(role.id)}
                          />
                          <label
                            htmlFor={`role-${role.id}`}
                            className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {role.nombre}
                          </label>
                          {role.es_sistema && (
                            <Badge variant="outline" className="text-xs">
                              Sistema
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Roles que no puede asignar */}
                {nonAssignableRoles.length > 0 && (
                  <div className="space-y-2 opacity-50">
                    <p className="text-xs text-muted-foreground">
                      Roles de nivel superior (no puedes asignarlos):
                    </p>
                    <div className="space-y-2">
                      {nonAssignableRoles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-3 rounded-lg border p-3 bg-muted/30"
                        >
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={formData.selectedRoles.includes(role.id)}
                            disabled
                          />
                          <label
                            className="flex-1 text-sm font-medium leading-none opacity-70"
                          >
                            {role.nombre}
                          </label>
                          {role.es_sistema && (
                            <Badge variant="outline" className="text-xs">
                              Sistema
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {roles.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay roles configurados en esta cuenta.
                  </p>
                )}
              </div>

              {/* Info del nivel del usuario actual */}
              {!isSuperAdmin && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <p>
                    <strong>Tu nivel de permisos:</strong>{" "}
                    {currentUserLevel === ROLE_HIERARCHY.admin
                      ? "Administrador"
                      : currentUserLevel === ROLE_HIERARCHY.supervisor
                      ? "Supervisor"
                      : currentUserLevel === ROLE_HIERARCHY.operador
                      ? "Operador"
                      : "Usuario"}
                  </p>
                  <p className="mt-1">
                    Solo puedes asignar roles de nivel inferior al tuyo.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateUsuario.isPending}>
              {updateUsuario.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}