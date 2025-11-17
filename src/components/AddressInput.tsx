import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export const AddressInput = ({ value, onChange, placeholder, id }: AddressInputProps) => {
  const [loading, setLoading] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "La geolocalización no está soportada en este navegador",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Usar API de geocodificación inversa de OpenStreetMap (gratuita)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'es',
              },
            }
          );
          
          if (!response.ok) throw new Error('Error al obtener la dirección');
          
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          
          onChange(address);
          toast({
            title: "Ubicación obtenida",
            description: "Se ha obtenido tu ubicación actual",
          });
        } catch (error) {
          // Si falla la geocodificación, usar las coordenadas
          onChange(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
          toast({
            title: "Ubicación obtenida",
            description: "Se guardaron las coordenadas de tu ubicación",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        let message = "No se pudo obtener la ubicación";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Debes permitir el acceso a tu ubicación";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "La ubicación no está disponible";
            break;
          case error.TIMEOUT:
            message = "Tiempo de espera agotado";
            break;
        }
        
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Ingrese la dirección"}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Ingresa la dirección manualmente o usa el botón del mapa para obtener tu ubicación actual
      </p>
    </div>
  );
};
