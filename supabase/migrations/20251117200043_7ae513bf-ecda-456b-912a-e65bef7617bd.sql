-- Create function to generate sucursal identifier
CREATE OR REPLACE FUNCTION public.generate_sucursal_identifier()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_num INTEGER;
  new_identifier TEXT;
BEGIN
  -- Get next number based on current maximum
  SELECT COALESCE(MAX(CAST(SUBSTRING(identificador FROM 5) AS INTEGER)), -1) + 1
  INTO next_num
  FROM sucursales
  WHERE identificador ~ '^SUC-[0-9]{3}$';
  
  -- Ensure it doesn't exceed 999
  IF next_num > 999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite de sucursales (SUC-999)';
  END IF;
  
  -- Format with leading zeros
  new_identifier := 'SUC-' || LPAD(next_num::TEXT, 3, '0');
  
  RETURN new_identifier;
END;
$$;

-- Create trigger to set sucursal identifier
CREATE OR REPLACE FUNCTION public.set_sucursal_identifier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.identificador IS NULL OR NEW.identificador = '' THEN
    NEW.identificador := generate_sucursal_identifier();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS set_sucursal_identifier_trigger ON sucursales;
CREATE TRIGGER set_sucursal_identifier_trigger
BEFORE INSERT ON sucursales
FOR EACH ROW
EXECUTE FUNCTION set_sucursal_identifier();