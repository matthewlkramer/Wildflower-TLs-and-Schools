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
  // If no coordinates are provided but we have an address, show address info
  if (!latitude || !longitude) {
    if (fallbackAddress) {
      // Handle both string and array formats for addresses
      const addressText = Array.isArray(fallbackAddress) ? fallbackAddress.join(', ') : fallbackAddress;
      return (
        <div className="w-full h-64 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center">
          <div className="text-center p-6 max-w-sm">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-700 font-medium mb-2">Address Available</p>
            <p className="text-sm text-slate-600">{addressText}</p>
            <p className="text-xs text-slate-500 mt-2">
              Add coordinates to Airtable to enable map display
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-64 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-slate-600">No location data available</p>
        </div>
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