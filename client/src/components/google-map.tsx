import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  schoolName?: string;
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

const render = (status: Status) => {
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
      return <MapComponent center={{ lat: 0, lng: 0 }} zoom={15} />;
  }
};

export function GoogleMap({ latitude, longitude, schoolName }: GoogleMapProps) {
  // If no coordinates are provided, don't render the map
  if (!latitude || !longitude) {
    return (
      <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Location coordinates not available</p>
      </div>
    );
  }

  const center = { lat: latitude, lng: longitude };

  return (
    <Wrapper 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""} 
      render={render}
      libraries={["marker"]}
    >
      <MapComponent center={center} zoom={15} schoolName={schoolName} />
    </Wrapper>
  );
}