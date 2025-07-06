import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  schoolName?: string;
  fallbackAddress?: string;
}

interface MapComponentProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  schoolName?: string;
}

const MapComponent = ({ center, zoom, schoolName }: MapComponentProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
      });
      
      // Add marker for the school
      new window.google.maps.Marker({
        position: center,
        map: newMap,
        title: schoolName || "School Location",
      });
      
      setMap(newMap);
    }
  }, [ref, map, center, zoom, schoolName]);

  React.useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  return <div ref={ref} className="w-full h-64 rounded-lg" />;
};

const render = (status: Status, latitude?: number, longitude?: number, schoolName?: string) => {
  switch (status) {
    case Status.LOADING:
      return <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>;
    case Status.FAILURE:
      return <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Error loading map</p>
      </div>;
    case Status.SUCCESS:
      return <MapComponent center={{ lat: latitude || 0, lng: longitude || 0 }} zoom={15} schoolName={schoolName} />;
  }
};

export function GoogleMap({ latitude, longitude, schoolName, fallbackAddress }: GoogleMapProps) {
  // If no coordinates are provided but we have an address, show a message about using address
  if (!latitude || !longitude) {
    if (fallbackAddress) {
      return (
        <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-slate-600 mb-2">Map coordinates not available</p>
            <p className="text-sm text-slate-500">Location: {fallbackAddress}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Location information not available</p>
      </div>
    );
  }

  const center = { lat: latitude, lng: longitude };

  return (
    <Wrapper 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""} 
      render={(status) => render(status, latitude, longitude, schoolName)}
      libraries={["marker"]}
    >
      <MapComponent center={center} zoom={15} schoolName={schoolName} />
    </Wrapper>
  );
}