import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { MapPin, Crosshair, Loader2 } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ecuador boundaries
const ECUADOR_BOUNDS: L.LatLngBoundsExpression = [
  [-5.0, -81.5], // Southwest
  [1.5, -75.0],  // Northeast
];

const ECUADOR_CENTER: L.LatLngExpression = [-1.8312, -78.1834];

interface LocationData {
  lat: number;
  lng: number;
  direccion: string;
  provincia: string;
  ciudad: string;
}

interface LocationMapProps {
  onLocationSelect: (location: LocationData) => void;
  initialPosition?: { lat: number; lng: number } | null;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      // Check if click is within Ecuador bounds
      if (lat >= -5.0 && lat <= 1.5 && lng >= -81.5 && lng <= -75.0) {
        onLocationSelect(lat, lng);
      }
    },
  });
  return null;
}

// Component to recenter map
function MapRecenter({ position }: { position: L.LatLngExpression | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  
  return null;
}

export const LocationMap = ({ onLocationSelect, initialPosition }: LocationMapProps) => {
  const [markerPosition, setMarkerPosition] = useState<L.LatLngExpression | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Reverse geocode using Nominatim (free OSM service)
  const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`
      );
      const data = await response.json();
      
      const address = data.address || {};
      
      // Extract address components
      const direccion = [
        address.road || address.street || "",
        address.house_number || "",
        address.neighbourhood || address.suburb || "",
      ].filter(Boolean).join(" ").trim() || data.display_name?.split(",")[0] || "";
      
      // Map state/province to Ecuador provinces
      let provincia = address.state || address.province || address.region || "";
      
      // Map city/town
      let ciudad = address.city || address.town || address.municipality || address.village || address.county || "";
      
      return {
        lat,
        lng,
        direccion,
        provincia,
        ciudad,
      };
    } catch (error) {
      console.error("Error geocoding:", error);
      return {
        lat,
        lng,
        direccion: "",
        provincia: "",
        ciudad: "",
      };
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    const locationData = await reverseGeocode(lat, lng);
    onLocationSelect(locationData);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está disponible en este navegador");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Check if within Ecuador
        if (latitude >= -5.0 && latitude <= 1.5 && longitude >= -81.5 && longitude <= -75.0) {
          setMarkerPosition([latitude, longitude]);
          const locationData = await reverseGeocode(latitude, longitude);
          onLocationSelect(locationData);
        } else {
          alert("Tu ubicación actual está fuera de Ecuador");
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("No se pudo obtener tu ubicación. Por favor, haz clic en el mapa para seleccionar una ubicación.");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Haz clic en el mapa para seleccionar la ubicación</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4 mr-2" />
          )}
          Usar mi ubicación
        </Button>
      </div>
      
      <div className="relative rounded-lg overflow-hidden border border-admin-border-light h-[300px]">
        {isGeocoding && (
          <div className="absolute top-2 left-2 z-[1000] bg-white px-3 py-1.5 rounded-md shadow-md flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Obteniendo dirección...
          </div>
        )}
        
        <MapContainer
          center={ECUADOR_CENTER}
          zoom={7}
          maxBounds={ECUADOR_BOUNDS}
          minZoom={6}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleMapClick} />
          <MapRecenter position={markerPosition} />
          
          {markerPosition && (
            <Marker position={markerPosition} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMap;
