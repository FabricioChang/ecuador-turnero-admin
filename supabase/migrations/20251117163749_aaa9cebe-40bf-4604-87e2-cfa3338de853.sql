-- Eliminar columnas telefono y email de la tabla sucursales
ALTER TABLE public.sucursales 
DROP COLUMN IF EXISTS telefono,
DROP COLUMN IF EXISTS email;