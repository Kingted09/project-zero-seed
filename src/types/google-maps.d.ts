
// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      setOptions(options: MapOptions): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      zoomControl?: boolean;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | null;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      getMap(): Map | null;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface Icon {
      url: string;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map | null, anchor?: Marker): void;
      close(): void;
      setContent(content: string | HTMLElement): void;
    }

    interface InfoWindowOptions {
      content?: string | HTMLElement;
      position?: LatLng | LatLngLiteral;
    }

    class NavigationControl {
      constructor(opts?: NavigationControlOptions);
    }

    interface NavigationControlOptions {
      visualizePitch?: boolean;
    }

    interface MapsEventListener {
      remove(): void;
    }
    
    interface MapMouseEvent {
      latLng?: LatLng;
    }
  }
}
