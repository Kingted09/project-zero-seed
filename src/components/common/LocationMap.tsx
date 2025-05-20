
import React, { useEffect, useState } from "react";
import GoogleMap from "./GoogleMap";
import { Loader2 } from "lucide-react";

interface LocationMapProps {
  location?: string;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  latitude?: number;
  longitude?: number;
  zoom?: number; // Added zoom prop
  showDirections?: boolean; // Added showDirections prop
  className?: string; // Added className prop
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  location, 
  onLocationSelect,
  latitude,
  longitude,
  zoom = 14,
  showDirections,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(
    latitude && longitude ? { lat: latitude, lng: longitude } : undefined
  );

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter({ lat: latitude, lng: longitude });
    }
    
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [latitude, longitude]);

  const handleMapClick = (location: { lat: number; lng: number }) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <div className={`relative w-full h-[200px] ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <GoogleMap
          height="200px"
          center={mapCenter}
          zoom={zoom}
          onMapClick={onLocationSelect ? handleMapClick : undefined}
          markers={mapCenter ? [{ position: mapCenter, title: location || "Selected Location" }] : []}
        />
      )}
    </div>
  );
};

export default LocationMap;
