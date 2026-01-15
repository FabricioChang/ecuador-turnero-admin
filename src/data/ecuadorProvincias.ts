// Complete list of Ecuador provinces and their cities (cantones)
export interface ProvinciaData {
  id: string;
  nombre: string;
  region: string;
  ciudades: string[];
}

export const PROVINCIAS_ECUADOR: ProvinciaData[] = [
  // COSTA
  {
    id: "esmeraldas",
    nombre: "Esmeraldas",
    region: "Costa",
    ciudades: ["Esmeraldas", "Atacames", "Eloy Alfaro", "Muisne", "Quinindé", "Río Verde", "San Lorenzo"]
  },
  {
    id: "manabi",
    nombre: "Manabí",
    region: "Costa",
    ciudades: ["Portoviejo", "Manta", "Chone", "El Carmen", "Jipijapa", "Montecristi", "Pedernales", "Rocafuerte", "Santa Ana", "Sucre", "Tosagua", "24 de Mayo", "Bolívar", "Flavio Alfaro", "Jaramijó", "Junín", "Olmedo", "Paján", "Pichincha", "Puerto López", "San Vicente"]
  },
  {
    id: "losrios",
    nombre: "Los Ríos",
    region: "Costa",
    ciudades: ["Babahoyo", "Quevedo", "Ventanas", "Vinces", "Baba", "Buena Fe", "Mocache", "Montalvo", "Palenque", "Pueblo Viejo", "Urdaneta", "Valencia"]
  },
  {
    id: "guayas",
    nombre: "Guayas",
    region: "Costa",
    ciudades: ["Guayaquil", "Daule", "Durán", "El Empalme", "El Triunfo", "Milagro", "Naranjal", "Naranjito", "Palestina", "Pedro Carbo", "Samborondón", "Santa Lucía", "Salitre", "San Jacinto de Yaguachi", "Simón Bolívar", "Alfredo Baquerizo Moreno", "Balao", "Balzar", "Colimes", "Coronel Marcelino Maridueña", "General Antonio Elizalde", "Isidro Ayora", "Lomas de Sargentillo", "Nobol", "Playas"]
  },
  {
    id: "santaelena",
    nombre: "Santa Elena",
    region: "Costa",
    ciudades: ["Santa Elena", "La Libertad", "Salinas"]
  },
  {
    id: "eloro",
    nombre: "El Oro",
    region: "Costa",
    ciudades: ["Machala", "Arenillas", "Atahualpa", "Balsas", "Chilla", "El Guabo", "Huaquillas", "Las Lajas", "Marcabelí", "Pasaje", "Piñas", "Portovelo", "Santa Rosa", "Zaruma"]
  },
  // SIERRA
  {
    id: "carchi",
    nombre: "Carchi",
    region: "Sierra",
    ciudades: ["Tulcán", "Bolívar", "Espejo", "Mira", "Montúfar", "San Pedro de Huaca"]
  },
  {
    id: "imbabura",
    nombre: "Imbabura",
    region: "Sierra",
    ciudades: ["Ibarra", "Antonio Ante", "Cotacachi", "Otavalo", "Pimampiro", "San Miguel de Urcuquí"]
  },
  {
    id: "pichincha",
    nombre: "Pichincha",
    region: "Sierra",
    ciudades: ["Quito", "Cayambe", "Mejía", "Pedro Moncayo", "Pedro Vicente Maldonado", "Puerto Quito", "Rumiñahui", "San Miguel de los Bancos"]
  },
  {
    id: "santodomingo",
    nombre: "Santo Domingo de los Tsáchilas",
    region: "Sierra",
    ciudades: ["Santo Domingo", "La Concordia"]
  },
  {
    id: "cotopaxi",
    nombre: "Cotopaxi",
    region: "Sierra",
    ciudades: ["Latacunga", "La Maná", "Pangua", "Pujilí", "Salcedo", "Saquisilí", "Sigchos"]
  },
  {
    id: "tungurahua",
    nombre: "Tungurahua",
    region: "Sierra",
    ciudades: ["Ambato", "Baños de Agua Santa", "Cevallos", "Mocha", "Patate", "Quero", "San Pedro de Pelileo", "Santiago de Píllaro", "Tisaleo"]
  },
  {
    id: "bolivar",
    nombre: "Bolívar",
    region: "Sierra",
    ciudades: ["Guaranda", "Caluma", "Chillanes", "Chimbo", "Echeandía", "Las Naves", "San Miguel"]
  },
  {
    id: "chimborazo",
    nombre: "Chimborazo",
    region: "Sierra",
    ciudades: ["Riobamba", "Alausí", "Chambo", "Chunchi", "Colta", "Cumandá", "Guamote", "Guano", "Pallatanga", "Penipe"]
  },
  {
    id: "canar",
    nombre: "Cañar",
    region: "Sierra",
    ciudades: ["Azogues", "Biblián", "Cañar", "Déleg", "El Tambo", "La Troncal", "Suscal"]
  },
  {
    id: "azuay",
    nombre: "Azuay",
    region: "Sierra",
    ciudades: ["Cuenca", "Chordeleg", "El Pan", "Girón", "Guachapala", "Gualaceo", "Nabón", "Oña", "Paute", "Pucará", "San Fernando", "Santa Isabel", "Sevilla de Oro", "Sígsig", "Camilo Ponce Enríquez"]
  },
  {
    id: "loja",
    nombre: "Loja",
    region: "Sierra",
    ciudades: ["Loja", "Calvas", "Catamayo", "Celica", "Chaguarpamba", "Espíndola", "Gonzanamá", "Macará", "Olmedo", "Paltas", "Pindal", "Puyango", "Quilanga", "Saraguro", "Sozoranga", "Zapotillo"]
  },
  // AMAZONÍA
  {
    id: "sucumbios",
    nombre: "Sucumbíos",
    region: "Amazonía",
    ciudades: ["Nueva Loja", "Cascales", "Cuyabeno", "Gonzalo Pizarro", "Lago Agrio", "Putumayo", "Shushufindi"]
  },
  {
    id: "napo",
    nombre: "Napo",
    region: "Amazonía",
    ciudades: ["Tena", "Archidona", "Carlos Julio Arosemena Tola", "El Chaco", "Quijos"]
  },
  {
    id: "orellana",
    nombre: "Orellana",
    region: "Amazonía",
    ciudades: ["Francisco de Orellana", "Aguarico", "La Joya de los Sachas", "Loreto"]
  },
  {
    id: "pastaza",
    nombre: "Pastaza",
    region: "Amazonía",
    ciudades: ["Puyo", "Arajuno", "Mera", "Santa Clara"]
  },
  {
    id: "moronasantiago",
    nombre: "Morona Santiago",
    region: "Amazonía",
    ciudades: ["Macas", "Gualaquiza", "Huamboya", "Limón Indanza", "Logroño", "Morona", "Pablo Sexto", "Palora", "San Juan Bosco", "Santiago", "Sucúa", "Taisha", "Tiwintza"]
  },
  {
    id: "zamorachinchipe",
    nombre: "Zamora Chinchipe",
    region: "Amazonía",
    ciudades: ["Zamora", "Centinela del Cóndor", "Chinchipe", "El Pangui", "Nangaritza", "Palanda", "Paquisha", "Yacuambi", "Yantzaza"]
  },
  // GALÁPAGOS
  {
    id: "galapagos",
    nombre: "Galápagos",
    region: "Galápagos",
    ciudades: ["Puerto Baquerizo Moreno", "Puerto Ayora", "Puerto Villamil"]
  }
];

// Helper to find provincia by name (case insensitive, partial match)
export const findProvinciaByName = (name: string): ProvinciaData | undefined => {
  if (!name) return undefined;
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return PROVINCIAS_ECUADOR.find(p => {
    const pNormalized = p.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return pNormalized.includes(normalized) || normalized.includes(pNormalized);
  });
};

// Helper to find ciudad in any provincia
export const findCiudadInProvincia = (ciudadName: string, provinciaId: string): string | undefined => {
  const provincia = PROVINCIAS_ECUADOR.find(p => p.id === provinciaId);
  if (!provincia) return undefined;
  
  const normalized = ciudadName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return provincia.ciudades.find(c => {
    const cNormalized = c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return cNormalized.includes(normalized) || normalized.includes(cNormalized);
  });
};

export default PROVINCIAS_ECUADOR;
