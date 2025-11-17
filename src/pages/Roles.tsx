import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Save, CheckCircle2, Plus, Pencil, Trash2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRolePermissions, useUpdateRolePermissions } from "@/hooks/useRolePermissions";
import { useCustomRoles, useCreateCustomRole, useUpdateCustomRole, useDeleteCustomRole, useCustomRolePermissions, useUpdateCustomRolePermissions } from "@/hooks/useCustomRoles";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roleLabels: Record<AppRole, string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  operador: "Operador",
  usuario: "Usuario",
};

const roleDescriptions: Record<AppRole, string> = {
  admin: "Acceso completo a todas las funcionalidades del sistema",
  supervisor: "Gestión de sucursales, kioskos, pantallas y reportes",
  operador: "Operación de turnos y monitoreo de kioskos",
  usuario: "Acceso básico para solicitar turnos",
};

const Roles = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedRoleType, setSelectedRoleType] = useState<"system" | "custom">("system");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDescription, setEditRoleDescription] = useState("");

  const { data: permissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: customRoles = [], isLoading: loadingCustomRoles } = useCustomRoles();
  
  // Get system role permissions or custom role permissions based on selection
  const systemRolePermissions = useRolePermissions(selectedRoleType === "system" ? selectedRoleId as AppRole : undefined);
  const customRolePermissions = useCustomRolePermissions(selectedRoleType === "custom" ? selectedRoleId : undefined);
  
  const rolePermissions = selectedRoleType === "system" 
    ? (systemRolePermissions.data || [])
    : (customRolePermissions.data || []);
  
  const updateSystemRolePermissions = useUpdateRolePermissions();
  const updateCustomRolePermissions = useUpdateCustomRolePermissions();
  const createCustomRole = useCreateCustomRole();
  const updateCustomRole = useUpdateCustomRole();
  const deleteCustomRole = useDeleteCustomRole();

  const permissionsByCategory = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};
    permissions.forEach((permission) => {
      if (!grouped[permission.category]) grouped[permission.category] = [];
      grouped[permission.category].push(permission);
    });
    return grouped;
  }, [permissions]);

  const categories = Object.keys(permissionsByCategory).sort();

  useEffect(() => {
    const permissionIds = new Set(rolePermissions.map((rp: any) => rp.permission_id));
    setSelectedPermissions(permissionIds);
    setHasChanges(false);
  }, [rolePermissions]);

  // Set default role on load
  useEffect(() => {
    if (customRoles.length > 0 && !selectedRoleId) {
      const adminRole = customRoles.find(r => r.nombre === "admin");
      if (adminRole) {
        setSelectedRoleId(adminRole.nombre);
        setSelectedRoleType("system");
      }
    }
  }, [customRoles, selectedRoleId]);

  const categoryPermissions = selectedCategory ? permissionsByCategory[selectedCategory] || [] : [];
  const allPermissionsSelected = permissions.length > 0 && selectedPermissions.size === permissions.length;

  const handleSelectRole = (roleId: string, isSystem: boolean) => {
    setSelectedRoleId(roleId);
    setSelectedRoleType(isSystem ? "system" : "custom");
    setSelectedCategory("");
    setHasChanges(false);
  };

  const handleTogglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) newSelected.delete(permissionId);
    else newSelected.add(permissionId);
    setSelectedPermissions(newSelected);
    setHasChanges(true);
  };

  const handleToggleAll = (checked: boolean) => {
    setSelectedPermissions(checked ? new Set(permissions.map((p) => p.id)) : new Set());
    setHasChanges(true);
  };

  const handleSavePermissions = () => {
    const permissionIds = Array.from(selectedPermissions);
    
    if (selectedRoleType === "system") {
      updateSystemRolePermissions.mutate({ 
        role: selectedRoleId as AppRole, 
        permissionIds 
      });
    } else {
      updateCustomRolePermissions.mutate({ 
        roleId: selectedRoleId, 
        permissionIds 
      });
    }
    setHasChanges(false);
  };

  const handleCreateRole = () => {
    createCustomRole.mutate({
      nombre: newRoleName,
      descripcion: newRoleDescription,
      permissionIds: Array.from(selectedPermissions),
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewRoleName("");
        setNewRoleDescription("");
        setSelectedPermissions(new Set());
      }
    });
  };

  const handleUpdateRole = () => {
    updateCustomRole.mutate({
      roleId: editRoleId,
      nombre: editRoleName,
      descripcion: editRoleDescription,
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditRoleId("");
        setEditRoleName("");
        setEditRoleDescription("");
      }
    });
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("¿Estás seguro de eliminar este rol?")) {
      deleteCustomRole.mutate(roleId);
    }
  };

  const openEditDialog = (role: any) => {
    setEditRoleId(role.id);
    setEditRoleName(role.nombre);
    setEditRoleDescription(role.descripcion || "");
    setIsEditDialogOpen(true);
  };

  const getCategoryPermissionCount = (category: string) => {
    const categoryPerms = permissionsByCategory[category] || [];
    const selectedCount = categoryPerms.filter((p) => selectedPermissions.has(p.id)).length;
    return `${selectedCount}/${categoryPerms.length}`;
  };

  if (loadingPermissions || loadingCustomRoles) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-admin-text-muted">Cargando...</p></div>;
  }

  const selectedRole = customRoles.find(r => r.nombre === selectedRoleId || r.id === selectedRoleId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary flex items-center gap-2">
            <Shield className="h-6 w-6" />Gestión de Roles y Permisos
          </h1>
          <p className="text-admin-text-secondary mt-1">Administra los permisos y accesos de cada rol</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button onClick={handleSavePermissions} disabled={updateSystemRolePermissions.isPending || updateCustomRolePermissions.isPending}>
              <Save className="h-4 w-4 mr-2" />Guardar Cambios
            </Button>
          )}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />Nuevo Rol
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Rol</DialogTitle>
                <DialogDescription>Crea un rol personalizado con permisos específicos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nombre del Rol</Label>
                  <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="ej: Gerente de Ventas" />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} placeholder="Describe las responsabilidades de este rol" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateRole} disabled={!newRoleName || createCustomRole.isPending}>Crear Rol</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Selector de Rol */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Rol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customRoles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all ${
                  selectedRoleId === (role.es_sistema ? role.nombre : role.id)
                    ? "border-primary bg-primary/5"
                    : "border-admin-border-light hover:border-admin-border-dark"
                }`}
                onClick={() => handleSelectRole(role.es_sistema ? role.nombre : role.id, role.es_sistema)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{role.es_sistema ? roleLabels[role.nombre as AppRole] || role.nombre : role.nombre}</h3>
                      {role.es_sistema && <Badge variant="secondary" className="text-xs">Sistema</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedRoleId === (role.es_sistema ? role.nombre : role.id) && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                      {!role.es_sistema && (
                        <>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); openEditDialog(role); }}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-admin-text-muted">
                    {role.es_sistema ? roleDescriptions[role.nombre as AppRole] : role.descripcion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checkbox para otorgar todos los permisos */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Checkbox id="all-permissions" checked={allPermissionsSelected} onCheckedChange={handleToggleAll} />
            <Label htmlFor="all-permissions" className="text-base font-semibold cursor-pointer">
              Otorgar todos los permisos
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Permisos por Categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-admin-surface border-admin-border-light lg:col-span-1 h-fit">
          <CardHeader><CardTitle>Categorías</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <Button key={category} variant={selectedCategory === category ? "default" : "outline"} className="w-full justify-between" onClick={() => setSelectedCategory(category)}>
                <span className="capitalize">{category}</span>
                <Badge variant="secondary">{getCategoryPermissionCount(category)}</Badge>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border-light lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedCategory ? `Permisos de ${selectedCategory}` : "Selecciona una categoría"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <Table>
                <TableHeader><TableRow><TableHead className="w-12"></TableHead><TableHead>Permiso</TableHead><TableHead>Descripción</TableHead></TableRow></TableHeader>
                <TableBody>
                  {categoryPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell><Checkbox checked={selectedPermissions.has(permission.id)} onCheckedChange={() => handleTogglePermission(permission.id)} /></TableCell>
                      <TableCell className="font-mono text-sm">{permission.name}</TableCell>
                      <TableCell className="text-admin-text-secondary">{permission.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <div className="text-center py-12"><p className="text-admin-text-muted">Selecciona una categoría</p></div>}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
            <DialogDescription>Modifica el nombre y descripción del rol</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre del Rol</Label>
              <Input value={editRoleName} onChange={(e) => setEditRoleName(e.target.value)} />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={editRoleDescription} onChange={(e) => setEditRoleDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateRole} disabled={!editRoleName || updateCustomRole.isPending}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
