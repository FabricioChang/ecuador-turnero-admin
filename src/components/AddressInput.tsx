import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Provincia } from "@/hooks/useProvincias";
import { Canton } from "@/hooks/useCantones";
import { Region } from "@/hooks/useRegiones";

// Fix para los iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  provincias?: Provincia[];
  cantones?: Canton[];
  regiones?: Region[];
  onProvinciaChange?: (provinciaId: string) => void;
  onCantonChange?: (cantonId: string) => void;
  onRegionChange?: (regionNombre: string) => void;
}

export const AddressInput = ({ 
  value, 
  onChange, 
  placeholder, 
  id,
  provincias = [],
  cantones = [],
  regiones = [],
  onProvinciaChange,
  onCantonChange,
  onRegionChange
}: AddressInputProps) => {
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number]>([-0.1807, -78.4678]); // Quito por defecto
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Función para obtener coordenadas desde una dirección (geocodificación)
  const geocodeAddress = async (address: string) => {
    if (!address || address.length < 3) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=ec`,
        {
          headers: {
            'Accept-Language': 'es',
          },
        }
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapPosition(newPosition);
        
        // Actualizar el mapa si está visible
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView(newPosition, 15);
          markerRef.current.setLatLng(newPosition);
        }
      }
    } catch (error) {
      console.error('Error al geocodificar:', error);
    }
  };

  // Función para obtener dirección desde coordenadas (geocodificación inversa)
  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es',
          },
        }
      );
      
      if (!response.ok) throw new Error('Error al obtener la dirección');
      
      const data = await response.json();
      
      // Extraer provincia y cantón del resultado
      const addressData = data.address || {};
      const provinciaName = addressData.state || addressData.province;
      const cantonName = addressData.city || addressData.town || addressData.municipality;
      
      // Buscar provincia en la lista
      if (provinciaName && provincias.length > 0) {
        const provincia = provincias.find(p => 
          p.nombre.toLowerCase().includes(provinciaName.toLowerCase()) ||
          provinciaName.toLowerCase().includes(p.nombre.toLowerCase())
        );
        
        if (provincia && onProvinciaChange) {
          onProvinciaChange(provincia.id);
          
          // Buscar región basada en la provincia
          if (regiones.length > 0 && onRegionChange) {
            const region = regiones.find(r => 
              r.provincias.some(p => p.toLowerCase() === provincia.nombre.toLowerCase())
            );
            if (region) {
              onRegionChange(region.nombre);
            }
          }
          
          // Buscar cantón en la lista
          if (cantonName && cantones.length > 0) {
            const canton = cantones.find(c => 
              c.provincia_id === provincia.id && (
                c.nombre.toLowerCase().includes(cantonName.toLowerCase()) ||
                cantonName.toLowerCase().includes(c.nombre.toLowerCase())
              )
            );
            if (canton && onCantonChange) {
              onCantonChange(canton.id);
            }
          }
        }
      }
      
      // Formatear dirección sin provincia y cantón
      let formattedAddress = data.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      
      // Filtrar partes de la dirección para omitir provincia y cantón
      if (addressData) {
        const parts = [];
        if (addressData.road) parts.push(addressData.road);
        if (addressData.house_number) parts.push(addressData.house_number);
        if (addressData.neighbourhood) parts.push(addressData.neighbourhood);
        if (addressData.suburb) parts.push(addressData.suburb);
        
        if (parts.length > 0) {
          formattedAddress = parts.join(', ');
        }
      }
      
      onChange(formattedAddress);
    } catch (error) {
      onChange(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el input de dirección
  const handleAddressChange = (newAddress: string) => {
    onChange(newAddress);
    
    // Debounce para la geocodificación
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      geocodeAddress(newAddress);
    }, 1000);
  };

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
        const newPosition: [number, number] = [latitude, longitude];
        setMapPosition(newPosition);
        await reverseGeocode(latitude, longitude);
        
        // Actualizar el mapa si está visible
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView(newPosition, 15);
          markerRef.current.setLatLng(newPosition);
        }
        
        toast({
          title: "Ubicación obtenida",
          description: "Se ha obtenido tu ubicación actual",
        });
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

  const handleToggleMap = () => {
    setShowMap(!showMap);
  };

  // Inicializar el mapa cuando se muestra
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Crear el mapa
      const map = L.map(mapRef.current).setView(mapPosition, 15);
      
      // Agregar capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Agregar marcador
      const marker = L.marker(mapPosition, { icon: DefaultIcon, draggable: true }).addTo(map);
      
      // Evento de clic en el mapa
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setMapPosition([lat, lng]);
        reverseGeocode(lat, lng);
      });
      
      // Evento de arrastre del marcador
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setMapPosition([position.lat, position.lng]);
        reverseGeocode(position.lat, position.lng);
        map.setView([position.lat, position.lng]);
      });
      
      mapInstanceRef.current = map;
      markerRef.current = marker;
    }
    
    return () => {
      if (mapInstanceRef.current && !showMap) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMap]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder={placeholder || "Ingrese la dirección"}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="flex-shrink-0"
          title="Usar ubicación actual"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleMap}
          className="flex-shrink-0"
          title={showMap ? "Ocultar mapa" : "Mostrar mapa"}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {showMap && (
        <div 
          ref={mapRef} 
          className="w-full h-[400px] border border-border rounded-lg overflow-hidden"
        />
      )}
      
      <p className="text-xs text-muted-foreground">
        Ingresa la dirección manualmente, usa el botón <MapPin className="inline h-3 w-3" /> para tu ubicación actual, 
        o haz clic en <Search className="inline h-3 w-3" /> para marcar en el mapa
      </p>
    </div>
  );
};
