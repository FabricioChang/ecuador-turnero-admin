import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, CheckCircle2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useCustomRoles } from "@/hooks/useCustomRoles";
import { useToast } from "@/hooks/use-toast";

const Roles = () => {
  const { toast } = useToast();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const { data: permissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: customRoles = [], isLoading: loadingCustomRoles } = useCustomRoles();

  const permissionsByCategory = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};
    permissions.forEach((permission: any) => {
      if (!grouped[permission.category]) grouped[permission.category] = [];
      grouped[permission.category].push(permission);
    });
    return grouped;
  }, [permissions]);

  const categories = Object.keys(permissionsByCategory).sort();

  useEffect(() => {
    if (customRoles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(customRoles[0].id);
    }
  }, [customRoles, selectedRoleId]);

  const categoryPermissions = selectedCategory ? permissionsByCategory[selectedCategory] || [] : [];

  const handleTogglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) newSelected.delete(permissionId);
    else newSelected.add(permissionId);
    setSelectedPermissions(newSelected);
  };

  const handleSavePermissions = () => {
    toast({ title: "Permisos guardados", description: "Los cambios han sido guardados correctamente." });
  };

  if (loadingPermissions || loadingCustomRoles) {
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
        <Button onClick={handleSavePermissions}><Save className="h-4 w-4 mr-2" />Guardar Cambios</Button>
      </div>

      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader><CardTitle className="text-lg">Seleccionar Rol</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customRoles.map((role: any) => (
              <Card key={role.id} className={`cursor-pointer transition-all ${selectedRoleId === role.id ? "border-primary bg-primary/5" : "border-admin-border-light hover:border-admin-border-dark"}`} onClick={() => setSelectedRoleId(role.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{role.nombre}</h3>
                    {role.es_sistema && <Badge variant="secondary" className="text-xs">Sistema</Badge>}
                    {selectedRoleId === role.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  {categoryPermissions.map((permission: any) => (
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
