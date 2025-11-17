-- Función para generar identificadores de pantallas
CREATE OR REPLACE FUNCTION public.generate_pantalla_identifier()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  -- Obtener el siguiente número basado en el máximo actual
  SELECT COALESCE(MAX(CAST(SUBSTRING(identificador FROM 5) AS INTEGER)), -1) + 1
  INTO next_num
  FROM pantallas
  WHERE identificador ~ '^PAN-[0-9]{4}$';
  
  -- Asegurar que no exceda 9999
  IF next_num > 9999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de pantallas (PAN-9999)';
  END IF;
  
  -- Formatear con ceros a la izquierda
  new_identifier := 'PAN-' || LPAD(next_num::TEXT, 4, '0');
  
  RETURN new_identifier;
END;
$$;

-- Trigger para asignar identificador automáticamente
CREATE OR REPLACE FUNCTION public.set_pantalla_identifier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_pantalla_identifier();
  END IF;
  RETURN NEW;
END;
$$;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_set_pantalla_identifier ON pantallas;
CREATE TRIGGER trigger_set_pantalla_identifier
  BEFORE INSERT ON pantallas
  FOR EACH ROW
  EXECUTE FUNCTION set_pantalla_identifier();

-- Actualizar pantallas existentes sin identificador o con identificador vacío usando un CTE
WITH numbered_pantallas AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM pantallas
  WHERE identificador IS NULL OR identificador = ''
)
UPDATE pantallas
SET identificador = 'PAN-' || LPAD(numbered_pantallas.row_num::TEXT, 4, '0')
FROM numbered_pantallas
WHERE pantallas.id = numbered_pantallas.id;