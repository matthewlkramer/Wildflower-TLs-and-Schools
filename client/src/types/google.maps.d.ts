declare namespace google.maps {
  interface LatLngLiteral { lat: number; lng: number }
  class Map { constructor(el: Element, opts?: any); setCenter(latlng: LatLngLiteral): void }
  class Marker { constructor(opts: any); addListener(evt: string, handler: (...args: any[]) => void): void }
  class InfoWindow { constructor(opts?: any); open(map: Map, marker?: Marker): void }
  class Size { constructor(w: number, h: number) }
  class Point { constructor(x: number, y: number) }
  class Geocoder { geocode(req: any, cb: (results: any, status: any) => void): void }
}

declare interface Window {
  google: any;
}
