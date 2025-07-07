import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import logoImage from "@assets/WF Logo main_1751647532999.jpeg";

interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  schoolName?: string;
  shortName?: string;
  fallbackAddress?: string;
  schoolLogo?: string;
}

interface MapComponentProps {
  center?: google.maps.LatLngLiteral;
  zoom: number;
  schoolName?: string;
  shortName?: string;
  currentAddress?: string;
  address?: string;
  schoolLogo?: string;
}

const MapComponent = ({ center, zoom, schoolName, shortName, currentAddress, address, schoolLogo }: MapComponentProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  // Create custom flower icon
  const createFlowerIcon = React.useCallback((logoUrl: string) => {
    return {
      url: logoUrl,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
      origin: new window.google.maps.Point(0, 0),
    };
  }, []);

  // Create info window content
  const createInfoWindowContent = React.useCallback(() => {
    const displayName = shortName || schoolName || "School";
    const displayAddress = currentAddress || address || "";
    
    return `
      <div style="padding: 8px; min-width: 200px; font-family: ui-sans-serif, system-ui, sans-serif;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1f2937;">
          ${displayName}
        </div>
        ${displayAddress ? `<div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
          ${displayAddress}
        </div>` : ''}
      </div>
    `;
  }, [schoolName, shortName, currentAddress, address]);

  React.useEffect(() => {
    if (ref.current && !map) {
      // If we have coordinates, use them directly
      if (center) {
        const newMap = new window.google.maps.Map(ref.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        
        // Create custom marker with flower icon
        const icon = createFlowerIcon(schoolLogo || logoImage);
        const marker = new window.google.maps.Marker({
          position: center,
          map: newMap,
          title: schoolName || "School Location",
          icon: icon,
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(),
        });

        // Open info window by default
        infoWindow.open(newMap, marker);

        // Add click listener to marker
        marker.addListener('click', () => {
          infoWindow.open(newMap, marker);
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
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            });

            // Create custom marker with flower icon
            const icon = createFlowerIcon(schoolLogo || logoImage);
            const marker = new window.google.maps.Marker({
              position: location,
              map: newMap,
              title: schoolName || "School Location",
              icon: icon,
            });

            // Create info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: createInfoWindowContent(),
            });

            // Open info window by default
            infoWindow.open(newMap, marker);

            // Add click listener to marker
            marker.addListener('click', () => {
              infoWindow.open(newMap, marker);
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
  }, [ref, map, center, zoom, schoolName, shortName, currentAddress, address, schoolLogo, createFlowerIcon, createInfoWindowContent]);

  React.useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  return <div ref={ref} className="w-full h-64 rounded-lg" />;
};

const render = (status: Status, props: any) => {
  switch (status) {
    case Status.LOADING:
      return <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>;
    case Status.FAILURE:
      return <div className="w-full h-64 rounded-lg bg-red-50 border-2 border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Google Maps API Error</p>
          <p className="text-red-600 text-sm mt-1">Check API key and enabled services</p>
        </div>
      </div>;
    case Status.SUCCESS:
      return <MapComponent {...props} />;
  }
};

const renderAddressMap = (status: Status, props: any) => {
  switch (status) {
    case Status.LOADING:
      return <div className="w-full h-64 rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>;
    case Status.FAILURE:
      return <div className="w-full h-64 rounded-lg bg-red-50 border-2 border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Google Maps API Error</p>
          <p className="text-red-600 text-sm mt-1">Check API key and enabled services</p>
        </div>
      </div>;
    case Status.SUCCESS:
      return <MapComponent {...props} />;
  }
};

export function GoogleMap({ latitude, longitude, schoolName, shortName, fallbackAddress, schoolLogo }: GoogleMapProps) {
  // Handle both string and array formats for addresses
  const addressText = fallbackAddress 
    ? (Array.isArray(fallbackAddress) ? fallbackAddress.join(', ') : fallbackAddress)
    : undefined;
  
  // Check if API key is available
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="w-full h-64 rounded-lg bg-red-50 border-2 border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Google Maps API Key Missing</p>
          <p className="text-red-600 text-sm mt-1">Add VITE_GOOGLE_MAPS_API_KEY to your secrets</p>
        </div>
      </div>
    );
  }
  
  // If we have coordinates, use them
  if (latitude && longitude) {
    const center = { lat: latitude, lng: longitude };
    const mapProps = { 
      center, 
      zoom: 15, 
      schoolName, 
      shortName, 
      currentAddress: addressText, 
      schoolLogo 
    };
    
    return (
      <Wrapper 
        apiKey={apiKey} 
        render={(status) => render(status, mapProps)}
        libraries={["marker"]}
      >
        <MapComponent {...mapProps} />
      </Wrapper>
    );
  }
  
  // If we have an address but no coordinates, try to show map using address
  if (addressText) {
    const mapProps = { 
      zoom: 15, 
      schoolName, 
      shortName, 
      address: addressText, 
      currentAddress: addressText, 
      schoolLogo 
    };
    
    return (
      <Wrapper 
        apiKey={apiKey} 
        render={(status) => renderAddressMap(status, mapProps)}
        libraries={["marker"]}
      >
        <MapComponent {...mapProps} />
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