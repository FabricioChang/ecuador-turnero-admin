import { useState, useMemo, Suspense, lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useProvinciasDB, type Provincia } from "@/hooks/useProvinciasDB";
import { useCantonesDB, type Canton } from "@/hooks/useCantonesDB";
import { useCreateSucursal } from "@/hooks/useSucursalesMutations";
import { supabase } from "@/integrations/supabase/client";

// Lazy load the map component
const LocationMap = lazy(() => import("@/components/LocationMap"));

// Region mapping based on province
const getRegionForProvincia = (provinciaNombre: string): string => {
  const costaProvincias = ["Esmeraldas", "Manabí", "Guayas", "Santa Elena", "El Oro", "Los Ríos"];
  const amazoniaProvincias = ["Sucumbíos", "Napo", "Orellana", "Pastaza", "Morona Santiago", "Zamora Chinchipe"];
  const galapagosProvincias = ["Galápagos"];
  
  if (costaProvincias.some(p => provinciaNombre.includes(p))) return "Costa";
  if (amazoniaProvincias.some(p => provinciaNombre.includes(p))) return "Amazonía";
  if (galapagosProvincias.some(p => provinciaNombre.includes(p))) return "Galápagos";
  return "Sierra";
};

const NuevaSucursal = () => {
  const navigate = useNavigate();
  const createSucursal = useCreateSucursal();
  
  const [formData, setFormData] = useState({
    nombre: "",
    provincia_id: "",
    canton_id: "",
    direccion: "",
    email: "",
    telefono_sms: "",
    capacidad_maxima: "",
  });
  
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch provinces and cantones from database
  const { data: provincias = [], isLoading: loadingProvincias } = useProvinciasDB();
  const { data: cantones = [], isLoading: loadingCantones } = useCantonesDB(formData.provincia_id);

  // Get selected provincia and canton names
  const selectedProvincia = useMemo(() => 
    provincias.find(p => p.id === formData.provincia_id),
    [provincias, formData.provincia_id]
  );
  
  const selectedCanton = useMemo(() => 
    cantones.find(c => c.id === formData.canton_id),
    [cantones, formData.canton_id]
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinciaChange = (provinciaId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      provincia_id: provinciaId,
      canton_id: "" // Reset canton when province changes
    }));
  };

  // Normalize text for comparison (remove accents, lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Find best matching provincia from geocoded name
  const findMatchingProvincia = (provinciaName: string): Provincia | null => {
    if (!provinciaName || provincias.length === 0) return null;
    
    const normalized = normalizeText(provinciaName);
    
    // Try exact match first
    let match = provincias.find(p => normalizeText(p.nombre) === normalized);
    if (match) return match;
    
    // Try partial match
    match = provincias.find(p => 
      normalizeText(p.nombre).includes(normalized) || 
      normalized.includes(normalizeText(p.nombre))
    );
    if (match) return match;
    
    // Handle special cases (e.g., "Provincia de Pichincha" -> "Pichincha")
    const cleanedName = normalized
      .replace(/provincia de /gi, '')
      .replace(/provincia del /gi, '');
    
    return provincias.find(p => normalizeText(p.nombre) === cleanedName) || null;
  };

  // Find best matching canton from geocoded name
  const findMatchingCanton = (cantonName: string, cantonesForProvincia: Canton[]): Canton | null => {
    if (!cantonName || cantonesForProvincia.length === 0) return null;
    
    const normalized = normalizeText(cantonName);
    
    // Try exact match first
    let match = cantonesForProvincia.find(c => normalizeText(c.nombre) === normalized);
    if (match) return match;
    
    // Try partial match
    match = cantonesForProvincia.find(c => 
      normalizeText(c.nombre).includes(normalized) || 
      normalized.includes(normalizeText(c.nombre))
    );
    
    return match || null;
  };

  const handleLocationSelect = async (location: { lat: number; lng: number; direccion: string; provincia: string; ciudad: string }) => {
    console.log("Location selected:", location);
    setMapPosition({ lat: location.lat, lng: location.lng });
    
    // Auto-fill address first
    if (location.direccion) {
      setFormData(prev => ({ ...prev, direccion: location.direccion }));
    }
    
    // Try to match provincia from geocoded data
    if (location.provincia) {
      const matchedProvincia = findMatchingProvincia(location.provincia);
      console.log("Matched provincia:", matchedProvincia);
      
      if (matchedProvincia) {
        // Update provincia
        setFormData(prev => ({ 
          ...prev, 
          provincia_id: matchedProvincia.id,
          direccion: location.direccion || prev.direccion,
          canton_id: "" // Reset canton, will be set after
        }));
        
        // Now try to match canton - need to fetch cantones for this provincia
        if (location.ciudad) {
          try {
            // Fetch cantones for the matched provincia
            const { data: cantonesForProvincia } = await supabase
              .from("cantones")
              .select("*")
              .eq("provincia_id", matchedProvincia.id)
              .order("nombre");
            
            if (cantonesForProvincia && cantonesForProvincia.length > 0) {
              const matchedCanton = findMatchingCanton(location.ciudad, cantonesForProvincia as Canton[]);
              console.log("Matched canton:", matchedCanton);
              
              if (matchedCanton) {
                setFormData(prev => ({ ...prev, canton_id: matchedCanton.id }));
              }
            }
          } catch (error) {
            console.error("Error fetching cantones:", error);
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la sucursal es requerido",
        variant: "destructive"
      });
      return;
    }

    if (!formData.provincia_id || !selectedProvincia) {
      toast({
        title: "Error",
        description: "La provincia es requerida",
        variant: "destructive"
      });
      return;
    }

    if (!formData.canton_id || !selectedCanton) {
      toast({
        title: "Error",
        description: "El cantón/ciudad es requerido",
        variant: "destructive"
      });
      return;
    }

    // Calculate region based on provincia
    const region = getRegionForProvincia(selectedProvincia.nombre);

    try {
      await createSucursal.mutateAsync({
        nombre: formData.nombre,
        region: region,
        provincia: selectedProvincia.nombre,
        ciudad: selectedCanton.nombre,
        direccion: formData.direccion || undefined,
      });

      navigate('/sucursales');
    } catch (error) {
      console.error('Error al crear sucursal:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sucursales')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary">Nueva Sucursal</h1>
          <p className="text-admin-text-secondary">Crear una nueva ubicación de atención</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="bg-admin-surface border-admin-border-light">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Sucursal *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Sucursal Centro Norte"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia *</Label>
                <Select
                  value={formData.provincia_id}
                  onValueChange={handleProvinciaChange}
                  disabled={loadingProvincias}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingProvincias ? "Cargando..." : "Seleccionar provincia"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón/Ciudad *</Label>
                <Select
                  value={formData.canton_id}
                  onValueChange={(value) => handleInputChange('canton_id', value)}
                  disabled={!formData.provincia_id || loadingCantones}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.provincia_id 
                        ? "Selecciona una provincia primero" 
                        : loadingCantones 
                          ? "Cargando..." 
                          : "Seleccionar cantón"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {cantones.map((canton) => (
                      <SelectItem key={canton.id} value={canton.id}>
                        {canton.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Ej: Av. 10 de Agosto N123 y Av. Colón"
              />
            </div>

            {/* Map Component */}
            <div className="space-y-2">
              <Label>Ubicación en el Mapa</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Haz clic en el mapa o usa tu ubicación para autocompletar provincia, cantón y dirección
              </p>
              <Suspense fallback={
                <div className="h-[300px] rounded-lg border border-admin-border-light flex items-center justify-center bg-muted">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }>
                <LocationMap 
                  onLocationSelect={handleLocationSelect}
                  initialPosition={mapPosition}
                />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/sucursales')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createSucursal.isPending}
            className="bg-admin-primary hover:bg-admin-primary/90"
          >
            {createSucursal.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Sucursal"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevaSucursal;
