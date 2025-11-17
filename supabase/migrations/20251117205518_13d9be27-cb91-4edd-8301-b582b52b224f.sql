-- Función segura para crear sucursales
CREATE OR REPLACE FUNCTION public.create_sucursal(
  _nombre TEXT,
  _identificador TEXT,
  _provincia_id UUID,
  _canton_id UUID,
  _direccion TEXT DEFAULT NULL,
  _email TEXT DEFAULT NULL,
  _telefono_sms TEXT DEFAULT NULL,
  _capacidad_maxima INTEGER DEFAULT NULL,
  _estado TEXT DEFAULT 'activo'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Verificar que el usuario esté autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  INSERT INTO public.sucursales (
    nombre, identificador, provincia_id, canton_id, 
    direccion, email, telefono_sms, capacidad_maxima, estado
  ) VALUES (
    _nombre, _identificador, _provincia_id, _canton_id,
    _direccion, _email, _telefono_sms, _capacidad_maxima, _estado
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Función segura para actualizar sucursales
CREATE OR REPLACE FUNCTION public.update_sucursal(
  _id UUID,
  _nombre TEXT,
  _provincia_id UUID,
  _canton_id UUID,
  _direccion TEXT DEFAULT NULL,
  _email TEXT DEFAULT NULL,
  _telefono_sms TEXT DEFAULT NULL,
  _capacidad_maxima INTEGER DEFAULT NULL,
  _estado TEXT DEFAULT 'activo'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  UPDATE public.sucursales
  SET nombre = _nombre,
      provincia_id = _provincia_id,
      canton_id = _canton_id,
      direccion = _direccion,
      email = _email,
      telefono_sms = _telefono_sms,
      capacidad_maxima = _capacidad_maxima,
      estado = _estado,
      updated_at = NOW()
  WHERE id = _id;

  RETURN FOUND;
END;
$$;

-- Función segura para crear categorías
CREATE OR REPLACE FUNCTION public.create_categoria(
  _nombre TEXT,
  _color TEXT DEFAULT '#000000',
  _tiempo_estimado INTEGER DEFAULT 15,
  _sucursal_id UUID DEFAULT NULL,
  _descripcion TEXT DEFAULT NULL,
  _estado TEXT DEFAULT 'activo'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  INSERT INTO public.categorias (
    nombre, color, tiempo_estimado, sucursal_id, descripcion, estado
  ) VALUES (
    _nombre, _color, _tiempo_estimado, _sucursal_id, _descripcion, _estado
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Función segura para actualizar categorías
CREATE OR REPLACE FUNCTION public.update_categoria(
  _id UUID,
  _nombre TEXT,
  _color TEXT,
  _tiempo_estimado INTEGER,
  _sucursal_id UUID DEFAULT NULL,
  _descripcion TEXT DEFAULT NULL,
  _estado TEXT DEFAULT 'activo'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  UPDATE public.categorias
  SET nombre = _nombre,
      color = _color,
      tiempo_estimado = _tiempo_estimado,
      sucursal_id = _sucursal_id,
      descripcion = _descripcion,
      estado = _estado,
      updated_at = NOW()
  WHERE id = _id;

  RETURN FOUND;
END;
$$;

-- Función segura para crear kioskos
CREATE OR REPLACE FUNCTION public.create_kiosko(
  _nombre TEXT,
  _identificador TEXT,
  _sucursal_id UUID,
  _ubicacion TEXT DEFAULT NULL,
  _estado estado_kiosko DEFAULT 'activo'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  INSERT INTO public.kioskos (
    nombre, identificador, sucursal_id, ubicacion, estado
  ) VALUES (
    _nombre, _identificador, _sucursal_id, _ubicacion, _estado
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Función segura para actualizar kioskos
CREATE OR REPLACE FUNCTION public.update_kiosko(
  _id UUID,
  _nombre TEXT,
  _sucursal_id UUID,
  _ubicacion TEXT DEFAULT NULL,
  _estado estado_kiosko DEFAULT 'activo'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  UPDATE public.kioskos
  SET nombre = _nombre,
      sucursal_id = _sucursal_id,
      ubicacion = _ubicacion,
      estado = _estado,
      updated_at = NOW()
  WHERE id = _id;

  RETURN FOUND;
END;
$$;

-- Función segura para crear pantallas
CREATE OR REPLACE FUNCTION public.create_pantalla(
  _nombre TEXT,
  _identificador TEXT,
  _sucursal_id UUID,
  _estado TEXT DEFAULT 'activa'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  INSERT INTO public.pantallas (
    nombre, identificador, sucursal_id, estado
  ) VALUES (
    _nombre, _identificador, _sucursal_id, _estado
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Función segura para actualizar pantallas
CREATE OR REPLACE FUNCTION public.update_pantalla(
  _id UUID,
  _nombre TEXT,
  _sucursal_id UUID,
  _estado TEXT DEFAULT 'activa'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  UPDATE public.pantallas
  SET nombre = _nombre,
      sucursal_id = _sucursal_id,
      estado = _estado,
      updated_at = NOW()
  WHERE id = _id;

  RETURN FOUND;
END;
$$;

-- Función segura para crear publicidad
CREATE OR REPLACE FUNCTION public.create_publicidad(
  _nombre TEXT,
  _tipo tipo_publicidad,
  _url_archivo TEXT,
  _duracion INTEGER DEFAULT 10,
  _estado TEXT DEFAULT 'activa'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  INSERT INTO public.publicidad (
    nombre, tipo, url_archivo, duracion, estado
  ) VALUES (
    _nombre, _tipo, _url_archivo, _duracion, _estado
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Función segura para actualizar publicidad
CREATE OR REPLACE FUNCTION public.update_publicidad(
  _id UUID,
  _nombre TEXT,
  _tipo tipo_publicidad,
  _url_archivo TEXT,
  _duracion INTEGER DEFAULT 10,
  _estado TEXT DEFAULT 'activa'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  UPDATE public.publicidad
  SET nombre = _nombre,
      tipo = _tipo,
      url_archivo = _url_archivo,
      duracion = _duracion,
      estado = _estado,
      updated_at = NOW()
  WHERE id = _id;

  RETURN FOUND;
END;
$$;

-- Función segura para asignar roles a usuarios
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id UUID,
  _role app_role
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Solo admins pueden asignar roles
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Solo administradores pueden asignar roles';
  END IF;

  -- Eliminar roles existentes del usuario
  DELETE FROM public.user_roles WHERE user_id = _user_id;

  -- Insertar el nuevo rol
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;