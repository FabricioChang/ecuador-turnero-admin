-- Agregar campos de notificaciones y capacidad a la tabla sucursales
ALTER TABLE public.sucursales 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS telefono_sms text,
ADD COLUMN IF NOT EXISTS capacidad_maxima integer;