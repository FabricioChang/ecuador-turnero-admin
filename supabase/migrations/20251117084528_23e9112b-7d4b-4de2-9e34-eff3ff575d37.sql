-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'operador', 'supervisor', 'usuario');
CREATE TYPE public.estado_turno AS ENUM ('pendiente', 'en_atencion', 'atendido', 'cancelado');
CREATE TYPE public.estado_kiosko AS ENUM ('activo', 'inactivo', 'mantenimiento');
CREATE TYPE public.tipo_publicidad AS ENUM ('imagen', 'video');

-- Profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User roles table (security critical - separate table)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Sucursales table
CREATE TABLE public.sucursales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  identificador TEXT NOT NULL UNIQUE,
  provincia_id UUID REFERENCES public.provincias(id) NOT NULL,
  canton_id UUID REFERENCES public.cantones(id) NOT NULL,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Categorias table
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color TEXT NOT NULL DEFAULT '#000000',
  tiempo_estimado INTEGER NOT NULL DEFAULT 15,
  sucursal_id UUID REFERENCES public.sucursales(id) ON DELETE CASCADE,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Kioskos table
CREATE TABLE public.kioskos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  identificador TEXT NOT NULL UNIQUE,
  sucursal_id UUID REFERENCES public.sucursales(id) ON DELETE CASCADE NOT NULL,
  ubicacion TEXT,
  estado estado_kiosko NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Turnos table
CREATE TABLE public.turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) NOT NULL,
  sucursal_id UUID REFERENCES public.sucursales(id) NOT NULL,
  kiosko_id UUID REFERENCES public.kioskos(id),
  cliente_nombre TEXT,
  cliente_identificacion TEXT,
  estado estado_turno NOT NULL DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  fecha_llamado TIMESTAMP WITH TIME ZONE,
  fecha_atencion TIMESTAMP WITH TIME ZONE,
  fecha_finalizacion TIMESTAMP WITH TIME ZONE,
  tiempo_espera INTEGER,
  tiempo_atencion INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Pantallas table
CREATE TABLE public.pantallas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificador TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  sucursal_id UUID REFERENCES public.sucursales(id) ON DELETE CASCADE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activa',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Publicidad table
CREATE TABLE public.publicidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo tipo_publicidad NOT NULL,
  url_archivo TEXT NOT NULL,
  duracion INTEGER NOT NULL DEFAULT 10,
  estado TEXT NOT NULL DEFAULT 'activa',
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Pantalla-Publicidad relationship (many-to-many)
CREATE TABLE public.pantalla_publicidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pantalla_id UUID REFERENCES public.pantallas(id) ON DELETE CASCADE NOT NULL,
  publicidad_id UUID REFERENCES public.publicidad(id) ON DELETE CASCADE NOT NULL,
  orden INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (pantalla_id, publicidad_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kioskos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantallas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantalla_publicidad ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for sucursales
CREATE POLICY "Everyone can view sucursales"
ON public.sucursales FOR SELECT
USING (true);

CREATE POLICY "Admins can manage sucursales"
ON public.sucursales FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categorias
CREATE POLICY "Everyone can view categorias"
ON public.categorias FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categorias"
ON public.categorias FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kioskos
CREATE POLICY "Everyone can view kioskos"
ON public.kioskos FOR SELECT
USING (true);

CREATE POLICY "Admins can manage kioskos"
ON public.kioskos FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for turnos
CREATE POLICY "Everyone can view turnos"
ON public.turnos FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create turnos"
ON public.turnos FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and operators can manage turnos"
ON public.turnos FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'operador') OR
  public.has_role(auth.uid(), 'supervisor')
);

-- RLS Policies for pantallas
CREATE POLICY "Everyone can view pantallas"
ON public.pantallas FOR SELECT
USING (true);

CREATE POLICY "Admins can manage pantallas"
ON public.pantallas FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for publicidad
CREATE POLICY "Everyone can view publicidad"
ON public.publicidad FOR SELECT
USING (true);

CREATE POLICY "Admins can manage publicidad"
ON public.publicidad FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pantalla_publicidad
CREATE POLICY "Everyone can view pantalla_publicidad"
ON public.pantalla_publicidad FOR SELECT
USING (true);

CREATE POLICY "Admins can manage pantalla_publicidad"
ON public.pantalla_publicidad FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_sucursales_provincia ON public.sucursales(provincia_id);
CREATE INDEX idx_sucursales_canton ON public.sucursales(canton_id);
CREATE INDEX idx_categorias_sucursal ON public.categorias(sucursal_id);
CREATE INDEX idx_kioskos_sucursal ON public.kioskos(sucursal_id);
CREATE INDEX idx_turnos_categoria ON public.turnos(categoria_id);
CREATE INDEX idx_turnos_sucursal ON public.turnos(sucursal_id);
CREATE INDEX idx_turnos_estado ON public.turnos(estado);
CREATE INDEX idx_pantallas_sucursal ON public.pantallas(sucursal_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sucursales_updated_at BEFORE UPDATE ON public.sucursales
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kioskos_updated_at BEFORE UPDATE ON public.kioskos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_turnos_updated_at BEFORE UPDATE ON public.turnos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pantallas_updated_at BEFORE UPDATE ON public.pantallas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publicidad_updated_at BEFORE UPDATE ON public.publicidad
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();