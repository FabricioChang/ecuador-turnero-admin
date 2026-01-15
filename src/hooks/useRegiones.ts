// Regiones are now stored as strings in the sucursal table
// This hook provides static region data for Ecuador

export const useRegiones = () => {
  const regiones = [
    {
      id: "costa",
      nombre: "Costa",
      provincias: ["Guayas", "Manabí", "El Oro", "Esmeraldas", "Los Ríos", "Santa Elena", "Santo Domingo de los Tsáchilas"]
    },
    {
      id: "sierra",
      nombre: "Sierra",
      provincias: ["Pichincha", "Azuay", "Tungurahua", "Chimborazo", "Imbabura", "Loja", "Cotopaxi", "Bolívar", "Cañar", "Carchi"]
    },
    {
      id: "amazonia",
      nombre: "Amazonía",
      provincias: ["Napo", "Orellana", "Pastaza", "Morona Santiago", "Zamora Chinchipe", "Sucumbíos"]
    },
    {
      id: "galapagos",
      nombre: "Galápagos",
      provincias: ["Galápagos"]
    }
  ];

  return { regiones };
};

export default useRegiones;
