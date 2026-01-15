import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, CheckCircle2, Users, Building2, Monitor, Ticket, BarChart3, Settings } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useCustomRoles, useCustomRolePermissions, useUpdateCustomRolePermissions } from "@/hooks/useCustomRoles";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const categoryIcons: Record<string, React.ReactNode> = {
  usuarios: <Users className="h-4 w-4" />,
  sucursales: <Building2 className="h-4 w-4" />,
  kioskos: <Monitor className="h-4 w-4" />,
  pantallas: <Monitor className="h-4 w-4" />,
  turnos: <Ticket className="h-4 w-4" />,
  reportes: <BarChart3 className="h-4 w-4" />,
  configuracion: <Settings className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  usuarios: "Usuarios",
  sucursales: "Sucursales",
  kioskos: "Kioskos",
  pantallas: "Pantallas",
  turnos: "Turnos",
  reportes: "Reportes",
  configuracion: "Configuración",
};

const Roles = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [localPermissions, setLocalPermissions] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  const { data: permissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: customRoles = [], isLoading: loadingCustomRoles } = useCustomRoles();
  const { data: rolePermissions = [], isLoading: loadingRolePermissions } = useCustomRolePermissions(selectedRoleId);
  const updatePermissions = useUpdateCustomRolePermissions();

  const permissionsByCategory = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};
    permissions.forEach((permission) => {
      const cat = permission.category || "general";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(permission);
    });
    return grouped;
  }, [permissions]);

  const categories = Object.keys(permissionsByCategory).sort();

  // Set initial role and category
  useEffect(() => {
    if (customRoles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(customRoles[0].id);
    }
  }, [customRoles, selectedRoleId]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Sync local permissions when role changes
  useEffect(() => {
    if (rolePermissions) {
      setLocalPermissions(new Set(rolePermissions));
      setHasChanges(false);
    }
  }, [rolePermissions]);

  const selectedRole = customRoles.find(r => r.id === selectedRoleId);
  const categoryPermissions = selectedCategory ? permissionsByCategory[selectedCategory] || [] : [];

  const handleTogglePermission = (permissionId: string) => {
    const newSelected = new Set(localPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setLocalPermissions(newSelected);
    setHasChanges(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;
    await updatePermissions.mutateAsync({
      roleId: selectedRoleId,
      permissionIds: Array.from(localPermissions)
    });
    setHasChanges(false);
  };

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  // Count permissions per category for the selected role
  const getPermissionCount = (category: string) => {
    const catPerms = permissionsByCategory[category] || [];
    const activeCount = catPerms.filter(p => localPermissions.has(p.id)).length;
    return { active: activeCount, total: catPerms.length };
  };

  if (loadingPermissions || loadingCustomRoles) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Gestión de Roles y Permisos
          </h1>
          <p className="text-admin-text-secondary mt-1">
            Administra los permisos y accesos de cada rol
          </p>
        </div>
        <Button 
          onClick={handleSavePermissions} 
          disabled={!hasChanges || updatePermissions.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updatePermissions.isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      {/* Role Selection */}
      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Rol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {customRoles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all ${
                  selectedRoleId === role.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-admin-border-light hover:border-admin-border-dark"
                }`}
                onClick={() => handleSelectRole(role.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{role.nombre}</h3>
                    {selectedRoleId === role.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {role.es_sistema && (
                      <Badge variant="secondary" className="text-xs">Sistema</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {role.identificador}
                    </Badge>
                  </div>
                  {role.descripcion && (
                    <p className="text-xs text-admin-text-muted mt-2 line-clamp-2">
                      {role.descripcion}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="bg-admin-surface border-admin-border-light lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Categorías</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            {categories.map((category) => {
              const { active, total } = getPermissionCount(category);
              const isSelected = selectedCategory === category;
              
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "ghost"}
                  className={`w-full justify-between h-auto py-3 ${
                    isSelected ? "" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="flex items-center gap-2">
                    {categoryIcons[category] || <Settings className="h-4 w-4" />}
                    <span className="capitalize">
                      {categoryLabels[category] || category}
                    </span>
                  </span>
                  <Badge 
                    variant={active === total ? "default" : active > 0 ? "secondary" : "outline"}
                    className="ml-2"
                  >
                    {active}/{total}
                  </Badge>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Permissions Panel */}
        <Card className="bg-admin-surface border-admin-border-light lg:col-span-3">
          <CardHeader className="border-b border-admin-border-light">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {categoryIcons[selectedCategory] || <Settings className="h-5 w-5" />}
                  {categoryLabels[selectedCategory] || selectedCategory}
                </CardTitle>
                {selectedRole && (
                  <p className="text-sm text-admin-text-muted mt-1">
                    Permisos para el rol: <span className="font-medium capitalize">{selectedRole.nombre}</span>
                  </p>
                )}
              </div>
              {selectedCategory && (
                <Badge variant="outline">
                  {getPermissionCount(selectedCategory).active} de {getPermissionCount(selectedCategory).total} activos
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingRolePermissions ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : selectedCategory && categoryPermissions.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-admin-border-light">
                  {categoryPermissions.map((permission) => {
                    const isEnabled = localPermissions.has(permission.id);
                    
                    return (
                      <div
                        key={permission.id}
                        className={`flex items-center justify-between p-4 transition-colors ${
                          isEnabled ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <Label
                            htmlFor={`perm-${permission.id}`}
                            className="font-medium text-sm cursor-pointer"
                          >
                            {permission.description}
                          </Label>
                          <p className="text-xs text-admin-text-muted mt-0.5 font-mono">
                            {permission.name}
                          </p>
                        </div>
                        <Switch
                          id={`perm-${permission.id}`}
                          checked={isEnabled}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-admin-text-muted mx-auto mb-3" />
                <p className="text-admin-text-muted">
                  {selectedCategory 
                    ? "No hay permisos en esta categoría" 
                    : "Selecciona una categoría para ver los permisos"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Roles;
