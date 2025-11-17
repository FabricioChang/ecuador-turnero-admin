import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, CheckCircle2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRolePermissions, useUpdateRolePermissions } from "@/hooks/useRolePermissions";
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
  const [selectedRole, setSelectedRole] = useState<AppRole>("admin");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  const { data: permissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: rolePermissions = [], isLoading: loadingRolePermissions } = useRolePermissions(selectedRole);
  const updateRolePermissions = useUpdateRolePermissions();

  const permissionsByCategory = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};
    permissions.forEach((permission) => {
      if (!grouped[permission.category]) grouped[permission.category] = [];
      grouped[permission.category].push(permission);
    });
    return grouped;
  }, [permissions]);

  const categories = Object.keys(permissionsByCategory).sort();

  useMemo(() => {
    const permissionIds = new Set(rolePermissions.map((rp) => rp.permission_id));
    setSelectedPermissions(permissionIds);
    setHasChanges(false);
  }, [rolePermissions]);

  const categoryPermissions = selectedCategory ? permissionsByCategory[selectedCategory] || [] : [];
  const allPermissionsSelected = permissions.length > 0 && selectedPermissions.size === permissions.length;

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
    updateRolePermissions.mutate({ role: selectedRole, permissionIds: Array.from(selectedPermissions) });
    setHasChanges(false);
  };

  const getCategoryPermissionCount = (category: string) => {
    const categoryPerms = permissionsByCategory[category] || [];
    const selectedCount = categoryPerms.filter((p) => selectedPermissions.has(p.id)).length;
    return `${selectedCount}/${categoryPerms.length}`;
  };

  if (loadingPermissions || loadingRolePermissions) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-admin-text-muted">Cargando...</p></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary flex items-center gap-2">
            <Shield className="h-6 w-6" />Gestión de Roles y Permisos
          </h1>
          <p className="text-admin-text-secondary mt-1">Administra los permisos y accesos de cada rol</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSavePermissions} disabled={updateRolePermissions.isPending}>
            <Save className="h-4 w-4 mr-2" />Guardar Cambios
          </Button>
        )}
      </div>

      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader><CardTitle className="text-lg">Seleccionar Rol</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["admin", "supervisor", "operador", "usuario"] as AppRole[]).map((role) => (
              <Card key={role} className={`cursor-pointer transition-all ${selectedRole === role ? "border-primary bg-primary/5" : "border-admin-border-light hover:border-admin-border-dark"}`} onClick={() => { setSelectedRole(role); setSelectedCategory(""); setHasChanges(false); }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{roleLabels[role]}</h3>
                    {selectedRole === role && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-sm text-admin-text-muted">{roleDescriptions[role]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface border-admin-border-light">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Checkbox id="all-permissions" checked={allPermissionsSelected} onCheckedChange={handleToggleAll} />
            <Label htmlFor="all-permissions" className="text-base font-semibold cursor-pointer">Otorgar todos los permisos</Label>
          </div>
        </CardContent>
      </Card>

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
          <CardHeader><CardTitle>{selectedCategory ? `Permisos de ${selectedCategory}` : "Selecciona una categoría"}</CardTitle></CardHeader>
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
    </div>
  );
};

export default Roles;
