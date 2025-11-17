-- Función para generar identificador de kiosko (K-0000 a K-9999)
CREATE OR REPLACE FUNCTION generate_kiosko_identifier()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  -- Obtener el siguiente número basado en el máximo actual
  SELECT COALESCE(MAX(CAST(SUBSTRING(identificador FROM 3) AS INTEGER)), -1) + 1
  INTO next_num
  FROM kioskos
  WHERE identificador ~ '^K-[0-9]{4}$';
  
  -- Asegurar que no exceda 9999
  IF next_num > 9999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de kioskos (K-9999)';
  END IF;
  
  -- Formatear con ceros a la izquierda
  new_identifier := 'K-' || LPAD(next_num::TEXT, 4, '0');
  
  RETURN new_identifier;
END;
$$;

-- Función para generar identificador de usuario (0000 a 9999)
CREATE OR REPLACE FUNCTION generate_user_identifier()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  -- Obtener el siguiente número basado en el máximo actual
  SELECT COALESCE(MAX(CAST(identificador AS INTEGER)), -1) + 1
  INTO next_num
  FROM profiles
  WHERE identificador ~ '^[0-9]{4}$';
  
  -- Asegurar que no exceda 9999
  IF next_num > 9999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de usuarios (9999)';
  END IF;
  
  -- Formatear con ceros a la izquierda
  new_identifier := LPAD(next_num::TEXT, 4, '0');
  
  RETURN new_identifier;
END;
$$;

-- Agregar columna identificador a profiles si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'identificador'
  ) THEN
    ALTER TABLE profiles ADD COLUMN identificador TEXT UNIQUE;
  END IF;
END $$;

-- Actualizar identificadores existentes de kioskos con formato correcto
WITH numbered_kioskos AS (
  SELECT id, 'K-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 4, '0') as new_identifier
  FROM kioskos
  WHERE identificador NOT LIKE 'K-____' OR identificador !~ '^K-[0-9]{4}$'
)
UPDATE kioskos k
SET identificador = nk.new_identifier
FROM numbered_kioskos nk
WHERE k.id = nk.id;

-- Actualizar identificadores existentes de usuarios con formato correcto
WITH numbered_users AS (
  SELECT id, LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 4, '0') as new_identifier
  FROM profiles
  WHERE identificador IS NULL OR identificador !~ '^[0-9]{4}$'
)
UPDATE profiles p
SET identificador = nu.new_identifier
FROM numbered_users nu
WHERE p.id = nu.id;

-- Trigger para auto-generar identificador de kiosko
DROP TRIGGER IF EXISTS set_kiosko_identifier ON kioskos;

CREATE OR REPLACE FUNCTION set_kiosko_identifier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_kiosko_identifier();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_kiosko_identifier
BEFORE INSERT ON kioskos
FOR EACH ROW
EXECUTE FUNCTION set_kiosko_identifier();

-- Trigger para auto-generar identificador de usuario
DROP TRIGGER IF EXISTS set_user_identifier ON profiles;

CREATE OR REPLACE FUNCTION set_user_identifier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_user_identifier();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_user_identifier
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_user_identifier();

-- Hacer que el identificador sea NOT NULL (después de actualizar los valores)
ALTER TABLE kioskos ALTER COLUMN identificador SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN identificador SET NOT NULL;