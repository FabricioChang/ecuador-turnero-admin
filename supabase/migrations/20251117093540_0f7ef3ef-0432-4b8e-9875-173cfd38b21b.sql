-- Crear tabla de permisos granulares
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de relación entre roles y permisos
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permissions
CREATE POLICY "Everyone can view permissions"
  ON public.permissions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage permissions"
  ON public.permissions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para role_permissions
CREATE POLICY "Everyone can view role permissions"
  ON public.role_permissions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage role permissions"
  ON public.role_permissions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Función helper para verificar si un rol tiene un permiso específico
CREATE OR REPLACE FUNCTION public.role_has_permission(_role app_role, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE rp.role = _role
      AND p.name = _permission_name
  )
$$;

-- Función helper para verificar si un usuario tiene un permiso específico
CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id UUID, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND p.name = _permission_name
  )
$$;

-- Insertar permisos granulares del sistema
INSERT INTO public.permissions (name, description, category) VALUES
  -- Usuarios
  ('users.view', 'Ver lista de usuarios', 'usuarios'),
  ('users.create', 'Crear nuevos usuarios', 'usuarios'),
  ('users.edit', 'Editar información de usuarios', 'usuarios'),
  ('users.delete', 'Eliminar usuarios', 'usuarios'),
  
  -- Sucursales
  ('branches.view', 'Ver lista de sucursales', 'sucursales'),
  ('branches.create', 'Crear nuevas sucursales', 'sucursales'),
  ('branches.edit', 'Editar información de sucursales', 'sucursales'),
  ('branches.delete', 'Eliminar sucursales', 'sucursales'),
  ('branches.config', 'Configurar sucursales', 'sucursales'),
  
  -- Kioskos
  ('kiosks.view', 'Ver lista de kioskos', 'kioskos'),
  ('kiosks.create', 'Registrar nuevos kioskos', 'kioskos'),
  ('kiosks.edit', 'Editar información de kioskos', 'kioskos'),
  ('kiosks.delete', 'Eliminar kioskos', 'kioskos'),
  ('kiosks.monitor', 'Monitorear kioskos', 'kioskos'),
  ('kiosks.config', 'Configurar kioskos', 'kioskos'),
  
  -- Pantallas
  ('screens.view', 'Ver lista de pantallas', 'pantallas'),
  ('screens.create', 'Registrar nuevas pantallas', 'pantallas'),
  ('screens.edit', 'Editar información de pantallas', 'pantallas'),
  ('screens.delete', 'Eliminar pantallas', 'pantallas'),
  ('screens.config', 'Configurar pantallas', 'pantallas'),
  
  -- Categorías
  ('categories.view', 'Ver lista de categorías', 'categorias'),
  ('categories.create', 'Crear nuevas categorías', 'categorias'),
  ('categories.edit', 'Editar información de categorías', 'categorias'),
  ('categories.delete', 'Eliminar categorías', 'categorias'),
  ('categories.config', 'Configurar categorías', 'categorias'),
  
  -- Turnos
  ('turns.view', 'Ver lista de turnos', 'turnos'),
  ('turns.create', 'Crear nuevos turnos', 'turnos'),
  ('turns.call', 'Llamar turnos', 'turnos'),
  ('turns.attend', 'Atender turnos', 'turnos'),
  ('turns.cancel', 'Cancelar turnos', 'turnos'),
  ('turns.transfer', 'Transferir turnos', 'turnos'),
  
  -- Publicidad
  ('ads.view', 'Ver lista de publicidad', 'publicidad'),
  ('ads.create', 'Crear nuevos contenidos publicitarios', 'publicidad'),
  ('ads.edit', 'Editar publicidad', 'publicidad'),
  ('ads.delete', 'Eliminar publicidad', 'publicidad'),
  ('ads.assign', 'Asignar publicidad a pantallas', 'publicidad'),
  
  -- Reportes
  ('reports.view', 'Ver reportes', 'reportes'),
  ('reports.export', 'Exportar reportes', 'reportes'),
  ('reports.analytics', 'Ver análisis avanzados', 'reportes'),
  
  -- Roles y Permisos
  ('roles.view', 'Ver roles y permisos', 'roles'),
  ('roles.manage', 'Gestionar roles y permisos', 'roles'),
  
  -- Configuración
  ('config.view', 'Ver configuración del sistema', 'configuracion'),
  ('config.edit', 'Editar configuración del sistema', 'configuracion')
ON CONFLICT (name) DO NOTHING;

-- Asignar permisos al rol ADMIN (todos los permisos)
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::app_role, id FROM public.permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Asignar permisos al rol SUPERVISOR
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'supervisor'::app_role, id FROM public.permissions
WHERE category IN ('sucursales', 'kioskos', 'pantallas', 'categorias', 'turnos', 'reportes')
  OR name IN ('users.view', 'ads.view')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Asignar permisos al rol OPERADOR
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'operador'::app_role, id FROM public.permissions
WHERE category IN ('turnos', 'kioskos', 'pantallas')
  AND name NOT IN ('kiosks.delete', 'screens.delete')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Asignar permisos básicos al rol USUARIO
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'usuario'::app_role, id FROM public.permissions
WHERE name IN ('turns.view', 'turns.create', 'categories.view', 'kiosks.view')
ON CONFLICT (role, permission_id) DO NOTHING;