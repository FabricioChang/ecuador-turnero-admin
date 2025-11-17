-- Crear tabla de provincias
CREATE TABLE IF NOT EXISTS public.provincias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  codigo TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de cantones (ciudades)
CREATE TABLE IF NOT EXISTS public.cantones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  provincia_id UUID NOT NULL REFERENCES public.provincias(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(nombre, provincia_id)
);

-- Habilitar RLS en las tablas
ALTER TABLE public.provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cantones ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para provincias (lectura pública)
CREATE POLICY "Provincias son visibles para todos" 
ON public.provincias 
FOR SELECT 
USING (true);

-- Políticas RLS para cantones (lectura pública)
CREATE POLICY "Cantones son visibles para todos" 
ON public.cantones 
FOR SELECT 
USING (true);

-- Insertar las 24 provincias de Ecuador
INSERT INTO public.provincias (codigo, nombre) VALUES
('01', 'Azuay'),
('02', 'Bolívar'),
('03', 'Cañar'),
('04', 'Carchi'),
('05', 'Cotopaxi'),
('06', 'Chimborazo'),
('07', 'El Oro'),
('08', 'Esmeraldas'),
('09', 'Guayas'),
('10', 'Imbabura'),
('11', 'Loja'),
('12', 'Los Ríos'),
('13', 'Manabí'),
('14', 'Morona Santiago'),
('15', 'Napo'),
('16', 'Pastaza'),
('17', 'Pichincha'),
('18', 'Tungurahua'),
('19', 'Zamora Chinchipe'),
('20', 'Galápagos'),
('21', 'Sucumbíos'),
('22', 'Orellana'),
('23', 'Santo Domingo de los Tsáchilas'),
('24', 'Santa Elena')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar cantones de AZUAY
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Cuenca', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Girón', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Gualaceo', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Nabón', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Paute', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Pucará', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'San Fernando', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Santa Isabel', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Sigsig', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Oña', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Chordeleg', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'El Pan', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Sevilla de Oro', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Guachapala', id FROM public.provincias WHERE codigo = '01'
UNION ALL SELECT 'Camilo Ponce Enríquez', id FROM public.provincias WHERE codigo = '01'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de BOLÍVAR
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Guaranda', id FROM public.provincias WHERE codigo = '02'
UNION ALL SELECT 'Chillanes', id FROM public.provincias WHERE codigo = '02'
UNION ALL SELECT 'Chimbo', id FROM public.provincias WHERE codigo = '02'
UNION ALL SELECT 'Echeandía', id FROM public.provincias WHERE codigo = '02'
UNION ALL SELECT 'San Miguel', id FROM public.provincias WHERE codigo = '02'
UNION ALL SELECT 'Caluma', id FROM public.provincias WHERE codigo = '02'
UNION ALL SELECT 'Las Naves', id FROM public.provincias WHERE codigo = '02'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de CAÑAR
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Azogues', id FROM public.provincias WHERE codigo = '03'
UNION ALL SELECT 'Biblián', id FROM public.provincias WHERE codigo = '03'
UNION ALL SELECT 'Cañar', id FROM public.provincias WHERE codigo = '03'
UNION ALL SELECT 'La Troncal', id FROM public.provincias WHERE codigo = '03'
UNION ALL SELECT 'El Tambo', id FROM public.provincias WHERE codigo = '03'
UNION ALL SELECT 'Déleg', id FROM public.provincias WHERE codigo = '03'
UNION ALL SELECT 'Suscal', id FROM public.provincias WHERE codigo = '03'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de CARCHI
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Tulcán', id FROM public.provincias WHERE codigo = '04'
UNION ALL SELECT 'Bolívar', id FROM public.provincias WHERE codigo = '04'
UNION ALL SELECT 'Espejo', id FROM public.provincias WHERE codigo = '04'
UNION ALL SELECT 'Mira', id FROM public.provincias WHERE codigo = '04'
UNION ALL SELECT 'Montúfar', id FROM public.provincias WHERE codigo = '04'
UNION ALL SELECT 'San Pedro de Huaca', id FROM public.provincias WHERE codigo = '04'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de COTOPAXI
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Latacunga', id FROM public.provincias WHERE codigo = '05'
UNION ALL SELECT 'La Maná', id FROM public.provincias WHERE codigo = '05'
UNION ALL SELECT 'Pangua', id FROM public.provincias WHERE codigo = '05'
UNION ALL SELECT 'Pujilí', id FROM public.provincias WHERE codigo = '05'
UNION ALL SELECT 'Salcedo', id FROM public.provincias WHERE codigo = '05'
UNION ALL SELECT 'Saquisilí', id FROM public.provincias WHERE codigo = '05'
UNION ALL SELECT 'Sigchos', id FROM public.provincias WHERE codigo = '05'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de CHIMBORAZO
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Riobamba', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Alausí', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Colta', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Chambo', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Chunchi', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Guamote', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Guano', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Pallatanga', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Penipe', id FROM public.provincias WHERE codigo = '06'
UNION ALL SELECT 'Cumandá', id FROM public.provincias WHERE codigo = '06'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de EL ORO
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Machala', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Arenillas', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Atahualpa', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Balsas', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Chilla', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'El Guabo', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Huaquillas', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Marcabelí', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Pasaje', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Piñas', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Portovelo', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Santa Rosa', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Zaruma', id FROM public.provincias WHERE codigo = '07'
UNION ALL SELECT 'Las Lajas', id FROM public.provincias WHERE codigo = '07'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de ESMERALDAS
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Esmeraldas', id FROM public.provincias WHERE codigo = '08'
UNION ALL SELECT 'Eloy Alfaro', id FROM public.provincias WHERE codigo = '08'
UNION ALL SELECT 'Muisne', id FROM public.provincias WHERE codigo = '08'
UNION ALL SELECT 'Quinindé', id FROM public.provincias WHERE codigo = '08'
UNION ALL SELECT 'San Lorenzo', id FROM public.provincias WHERE codigo = '08'
UNION ALL SELECT 'Atacames', id FROM public.provincias WHERE codigo = '08'
UNION ALL SELECT 'Rioverde', id FROM public.provincias WHERE codigo = '08'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de GUAYAS
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Guayaquil', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Alfredo Baquerizo Moreno', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Balao', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Balzar', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Colimes', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Daule', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Durán', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'El Empalme', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'El Triunfo', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Milagro', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Naranjal', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Naranjito', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Palestina', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Pedro Carbo', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Samborondón', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Santa Lucía', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Salitre', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'San Jacinto de Yaguachi', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Playas', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Simón Bolívar', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Coronel Marcelino Maridueña', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Lomas de Sargentillo', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Nobol', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'General Antonio Elizalde', id FROM public.provincias WHERE codigo = '09'
UNION ALL SELECT 'Isidro Ayora', id FROM public.provincias WHERE codigo = '09'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de IMBABURA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Ibarra', id FROM public.provincias WHERE codigo = '10'
UNION ALL SELECT 'Antonio Ante', id FROM public.provincias WHERE codigo = '10'
UNION ALL SELECT 'Cotacachi', id FROM public.provincias WHERE codigo = '10'
UNION ALL SELECT 'Otavalo', id FROM public.provincias WHERE codigo = '10'
UNION ALL SELECT 'Pimampiro', id FROM public.provincias WHERE codigo = '10'
UNION ALL SELECT 'San Miguel de Urcuquí', id FROM public.provincias WHERE codigo = '10'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de LOJA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Loja', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Calvas', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Catamayo', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Celica', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Chaguarpamba', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Espíndola', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Gonzanamá', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Macará', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Paltas', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Puyango', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Saraguro', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Sozoranga', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Zapotillo', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Pindal', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Quilanga', id FROM public.provincias WHERE codigo = '11'
UNION ALL SELECT 'Olmedo', id FROM public.provincias WHERE codigo = '11'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de LOS RÍOS
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Babahoyo', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Baba', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Montalvo', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Puebloviejo', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Quevedo', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Urdaneta', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Ventanas', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Vínces', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Palenque', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Buena Fe', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Valencia', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Mocache', id FROM public.provincias WHERE codigo = '12'
UNION ALL SELECT 'Quinsaloma', id FROM public.provincias WHERE codigo = '12'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de MANABÍ
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Portoviejo', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Bolívar', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Chone', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'El Carmen', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Flavio Alfaro', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Jipijapa', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Junín', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Manta', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Montecristi', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Paján', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Pichincha', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Rocafuerte', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Santa Ana', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Sucre', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Tosagua', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT '24 de Mayo', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Pedernales', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Olmedo', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Puerto López', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Jama', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'Jaramijó', id FROM public.provincias WHERE codigo = '13'
UNION ALL SELECT 'San Vicente', id FROM public.provincias WHERE codigo = '13'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de MORONA SANTIAGO
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Morona', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Gualaquiza', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Limón Indanza', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Palora', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Santiago', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Sucúa', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Huamboya', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'San Juan Bosco', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Taisha', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Logroño', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Pablo Sexto', id FROM public.provincias WHERE codigo = '14'
UNION ALL SELECT 'Tiwintza', id FROM public.provincias WHERE codigo = '14'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de NAPO
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Tena', id FROM public.provincias WHERE codigo = '15'
UNION ALL SELECT 'Archidona', id FROM public.provincias WHERE codigo = '15'
UNION ALL SELECT 'El Chaco', id FROM public.provincias WHERE codigo = '15'
UNION ALL SELECT 'Quijos', id FROM public.provincias WHERE codigo = '15'
UNION ALL SELECT 'Carlos Julio Arosemena Tola', id FROM public.provincias WHERE codigo = '15'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de PASTAZA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Pastaza', id FROM public.provincias WHERE codigo = '16'
UNION ALL SELECT 'Mera', id FROM public.provincias WHERE codigo = '16'
UNION ALL SELECT 'Santa Clara', id FROM public.provincias WHERE codigo = '16'
UNION ALL SELECT 'Arajuno', id FROM public.provincias WHERE codigo = '16'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de PICHINCHA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Quito', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'Cayambe', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'Mejía', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'Pedro Moncayo', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'Rumiñahui', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'San Miguel de los Bancos', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'Pedro Vicente Maldonado', id FROM public.provincias WHERE codigo = '17'
UNION ALL SELECT 'Puerto Quito', id FROM public.provincias WHERE codigo = '17'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de TUNGURAHUA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Ambato', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Baños de Agua Santa', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Cevallos', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Mocha', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Patate', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Quero', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'San Pedro de Pelileo', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Santiago de Píllaro', id FROM public.provincias WHERE codigo = '18'
UNION ALL SELECT 'Tisaleo', id FROM public.provincias WHERE codigo = '18'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de ZAMORA CHINCHIPE
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Zamora', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Chinchipe', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Nangaritza', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Yacuambi', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Yantzaza', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'El Pangui', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Centinela del Cóndor', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Palanda', id FROM public.provincias WHERE codigo = '19'
UNION ALL SELECT 'Paquisha', id FROM public.provincias WHERE codigo = '19'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de GALÁPAGOS
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'San Cristóbal', id FROM public.provincias WHERE codigo = '20'
UNION ALL SELECT 'Isabela', id FROM public.provincias WHERE codigo = '20'
UNION ALL SELECT 'Santa Cruz', id FROM public.provincias WHERE codigo = '20'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de SUCUMBÍOS
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Lago Agrio', id FROM public.provincias WHERE codigo = '21'
UNION ALL SELECT 'Gonzalo Pizarro', id FROM public.provincias WHERE codigo = '21'
UNION ALL SELECT 'Putumayo', id FROM public.provincias WHERE codigo = '21'
UNION ALL SELECT 'Shushufindi', id FROM public.provincias WHERE codigo = '21'
UNION ALL SELECT 'Sucumbíos', id FROM public.provincias WHERE codigo = '21'
UNION ALL SELECT 'Cascales', id FROM public.provincias WHERE codigo = '21'
UNION ALL SELECT 'Cuyabeno', id FROM public.provincias WHERE codigo = '21'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de ORELLANA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Orellana', id FROM public.provincias WHERE codigo = '22'
UNION ALL SELECT 'Aguarico', id FROM public.provincias WHERE codigo = '22'
UNION ALL SELECT 'La Joya de los Sachas', id FROM public.provincias WHERE codigo = '22'
UNION ALL SELECT 'Loreto', id FROM public.provincias WHERE codigo = '22'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de SANTO DOMINGO DE LOS TSÁCHILAS
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Santo Domingo', id FROM public.provincias WHERE codigo = '23'
UNION ALL SELECT 'La Concordia', id FROM public.provincias WHERE codigo = '23'
ON CONFLICT (nombre, provincia_id) DO NOTHING;

-- Insertar cantones de SANTA ELENA
INSERT INTO public.cantones (nombre, provincia_id) 
SELECT 'Santa Elena', id FROM public.provincias WHERE codigo = '24'
UNION ALL SELECT 'La Libertad', id FROM public.provincias WHERE codigo = '24'
UNION ALL SELECT 'Salinas', id FROM public.provincias WHERE codigo = '24'
ON CONFLICT (nombre, provincia_id) DO NOTHING;