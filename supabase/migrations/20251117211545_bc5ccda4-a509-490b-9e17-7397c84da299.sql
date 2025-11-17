
-- Agregar columna identificador a categorias
ALTER TABLE public.categorias
ADD COLUMN IF NOT EXISTS identificador text UNIQUE;

-- Función para generar identificador de categoría
CREATE OR REPLACE FUNCTION public.generate_categoria_identifier()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(identificador FROM 5) AS INTEGER)), -1) + 1
  INTO next_num
  FROM categorias
  WHERE identificador ~ '^CAT-[0-9]{3}$';
  
  IF next_num > 999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de categorías (CAT-999)';
  END IF;
  
  new_identifier := 'CAT-' || LPAD(next_num::TEXT, 3, '0');
  RETURN new_identifier;
END;
$$;

-- Trigger para asignar identificador automático a categorías
CREATE OR REPLACE FUNCTION public.set_categoria_identifier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_categoria_identifier();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_categoria_identifier_trigger ON public.categorias;
CREATE TRIGGER set_categoria_identifier_trigger
  BEFORE INSERT ON public.categorias
  FOR EACH ROW
  EXECUTE FUNCTION public.set_categoria_identifier();

-- Actualizar categorías existentes sin identificador usando CTE
WITH numbered_cats AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM categorias
  WHERE identificador IS NULL
)
UPDATE categorias
SET identificador = 'CAT-' || LPAD(numbered_cats.rn::TEXT, 3, '0')
FROM numbered_cats
WHERE categorias.id = numbered_cats.id;

-- Agregar columna identificador a publicidad
ALTER TABLE public.publicidad
ADD COLUMN IF NOT EXISTS identificador text UNIQUE;

-- Función para generar identificador de publicidad
CREATE OR REPLACE FUNCTION public.generate_publicidad_identifier()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(identificador FROM 5) AS INTEGER)), -1) + 1
  INTO next_num
  FROM publicidad
  WHERE identificador ~ '^PUB-[0-9]{3}$';
  
  IF next_num > 999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de publicidad (PUB-999)';
  END IF;
  
  new_identifier := 'PUB-' || LPAD(next_num::TEXT, 3, '0');
  RETURN new_identifier;
END;
$$;

-- Trigger para asignar identificador automático a publicidad
CREATE OR REPLACE FUNCTION public.set_publicidad_identifier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_publicidad_identifier();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_publicidad_identifier_trigger ON public.publicidad;
CREATE TRIGGER set_publicidad_identifier_trigger
  BEFORE INSERT ON public.publicidad
  FOR EACH ROW
  EXECUTE FUNCTION public.set_publicidad_identifier();

-- Actualizar publicidad existente sin identificador usando CTE
WITH numbered_pubs AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM publicidad
  WHERE identificador IS NULL
)
UPDATE publicidad
SET identificador = 'PUB-' || LPAD(numbered_pubs.rn::TEXT, 3, '0')
FROM numbered_pubs
WHERE publicidad.id = numbered_pubs.id;

-- Agregar columna identificador a custom_roles
ALTER TABLE public.custom_roles
ADD COLUMN IF NOT EXISTS identificador text UNIQUE;

-- Función para generar identificador de custom_roles
CREATE OR REPLACE FUNCTION public.generate_custom_role_identifier()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(identificador FROM 5) AS INTEGER)), -1) + 1
  INTO next_num
  FROM custom_roles
  WHERE identificador ~ '^ROL-[0-9]{3}$';
  
  IF next_num > 999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de roles personalizados (ROL-999)';
  END IF;
  
  new_identifier := 'ROL-' || LPAD(next_num::TEXT, 3, '0');
  RETURN new_identifier;
END;
$$;

-- Trigger para asignar identificador automático a custom_roles
CREATE OR REPLACE FUNCTION public.set_custom_role_identifier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_custom_role_identifier();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_custom_role_identifier_trigger ON public.custom_roles;
CREATE TRIGGER set_custom_role_identifier_trigger
  BEFORE INSERT ON public.custom_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_custom_role_identifier();

-- Actualizar custom_roles existentes sin identificador usando CTE
WITH numbered_roles AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM custom_roles
  WHERE identificador IS NULL
)
UPDATE custom_roles
SET identificador = 'ROL-' || LPAD(numbered_roles.rn::TEXT, 3, '0')
FROM numbered_roles
WHERE custom_roles.id = numbered_roles.id;
