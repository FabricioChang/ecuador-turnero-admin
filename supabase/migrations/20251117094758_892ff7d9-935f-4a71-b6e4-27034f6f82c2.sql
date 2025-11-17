-- Crear tabla de roles personalizados
CREATE TABLE IF NOT EXISTS public.custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  es_sistema BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Everyone can view custom roles"
  ON public.custom_roles
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage custom roles"
  ON public.custom_roles
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Crear tabla de permisos para roles personalizados
CREATE TABLE IF NOT EXISTS public.custom_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_role_id UUID NOT NULL REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(custom_role_id, permission_id)
);

-- Habilitar RLS
ALTER TABLE public.custom_role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Everyone can view custom role permissions"
  ON public.custom_role_permissions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage custom role permissions"
  ON public.custom_role_permissions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insertar los 4 roles del sistema como referencia
INSERT INTO public.custom_roles (nombre, descripcion, es_sistema) VALUES
  ('admin', 'Acceso completo a todas las funcionalidades del sistema', true),
  ('supervisor', 'Gestión de sucursales, kioskos, pantallas y reportes', true),
  ('operador', 'Operación de turnos y monitoreo de kioskos', true),
  ('usuario', 'Acceso básico para solicitar turnos', true)
ON CONFLICT (nombre) DO NOTHING;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_custom_roles_updated_at
BEFORE UPDATE ON public.custom_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();