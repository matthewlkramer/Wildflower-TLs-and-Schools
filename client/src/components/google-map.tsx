import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  schoolName?: string;
  fallbackAddress?: string;
}

interface MapComponentProps {
  center?: google.maps.LatLngLiteral;
  zoom: number;
  schoolName?: string;
  address?: string;
}

const MapComponent = ({ center, zoom, schoolName, address }: MapComponentProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      // If we have coordinates, use them directly
      if (center) {
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
      // If we have an address but no coordinates, geocode the address
      else if (address) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0] && ref.current) {
            const location = results[0].geometry.location;
            const newMap = new window.google.maps.Map(ref.current, {
              center: location,
              zoom,
            });

            new window.google.maps.Marker({
              position: location,
              map: newMap,
              title: schoolName || "School Location",
            });
            
            setMap(newMap);
          } else {
            // If geocoding fails, show error in the map div
            if (ref.current) {
              ref.current.innerHTML = `
                <div class="w-full h-64 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                  <div class="text-center p-4 text-slate-600">
                    <p>Unable to load map for this address</p>
                    <p class="text-sm mt-1">${address}</p>
                  </div>
                </div>
              `;
            }
          }
        });
      }
    }
  }, [ref, map, center, zoom, schoolName, address]);

  React.useEffect(() => {
    if (map && center) {
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

const renderAddressMap = (status: Status, address: string, schoolName?: string) => {
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
      return <MapComponent zoom={15} schoolName={schoolName} address={address} />;
  }
};

export function GoogleMap({ latitude, longitude, schoolName, fallbackAddress }: GoogleMapProps) {
  // Handle both string and array formats for addresses
  const addressText = fallbackAddress 
    ? (Array.isArray(fallbackAddress) ? fallbackAddress.join(', ') : fallbackAddress)
    : undefined;
  
  // If we have coordinates, use them
  if (latitude && longitude) {
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
  
  // If we have an address but no coordinates, try to show map using address
  if (addressText) {
    return (
      <Wrapper 
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""} 
        render={(status) => renderAddressMap(status, addressText, schoolName)}
        libraries={["marker"]}
      >
        <MapComponent zoom={15} schoolName={schoolName} address={addressText} />
      </Wrapper>
    );
  }
  
  // No coordinates and no address - show fallback
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