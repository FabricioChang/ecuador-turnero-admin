import { Input } from "@/components/ui/input";

interface AddressInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  provincias?: any[];
  cantones?: any[];
  regiones?: any[];
  onProvinciaChange?: (provinciaId: string) => void;
  onCantonChange?: (cantonId: string) => void;
  onRegionChange?: (regionNombre: string) => void;
}

export const AddressInput = ({
  id,
  value,
  onChange,
  placeholder = "Ingrese la dirección",
  provincias,
  cantones,
  regiones,
  onProvinciaChange,
  onCantonChange,
  onRegionChange
}: AddressInputProps) => {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default AddressInput;
