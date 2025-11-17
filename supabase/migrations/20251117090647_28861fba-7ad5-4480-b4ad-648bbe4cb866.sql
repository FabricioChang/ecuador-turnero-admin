-- Agregar campos adicionales a la tabla profiles
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS nombre;

ALTER TABLE public.profiles
  ADD COLUMN nombres TEXT NOT NULL DEFAULT '',
  ADD COLUMN apellidos TEXT NOT NULL DEFAULT '',
  ADD COLUMN cedula TEXT UNIQUE,
  ADD COLUMN provincia_id UUID REFERENCES public.provincias(id),
  ADD COLUMN canton_id UUID REFERENCES public.cantones(id),
  ADD COLUMN direccion TEXT;

-- Actualizar índice para búsquedas por cédula
CREATE INDEX IF NOT EXISTS idx_profiles_cedula ON public.profiles(cedula);

-- Actualizar la función de creación automática de perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombres, apellidos, email, telefono, cedula)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombres', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'telefono', NULL),
    COALESCE(NEW.raw_user_meta_data->>'cedula', NULL)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();