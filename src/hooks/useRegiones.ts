// Hook para obtener las regiones del Ecuador
// Las regiones son fijas y no vienen de la BD

export interface Region {
  id: string;
  nombre: string;
  provincias: string[];
}

export const useRegiones = () => {
  const regiones: Region[] = [
    {
      id: "costa",
      nombre: "Costa",
      provincias: ["Esmeraldas", "Manabí", "Los Ríos", "Guayas", "Santa Elena", "El Oro", "Santo Domingo de los Tsáchilas"]
    },
    {
      id: "sierra",
      nombre: "Sierra",
      provincias: ["Carchi", "Imbabura", "Pichincha", "Cotopaxi", "Tungurahua", "Bolívar", "Chimborazo", "Cañar", "Azuay", "Loja"]
    },
    {
      id: "amazonia",
      nombre: "Amazonía",
      provincias: ["Sucumbíos", "Napo", "Orellana", "Pastaza", "Morona Santiago", "Zamora Chinchipe"]
    },
    {
      id: "galapagos",
      nombre: "Galápagos",
      provincias: ["Galápagos"]
    }
  ];

  return { regiones };
};
