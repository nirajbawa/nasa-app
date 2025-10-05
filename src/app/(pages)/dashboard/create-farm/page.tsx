"use client"
import { useState, useRef, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface SquareArea {
  id: string;
  name: string;
  northEast: Location;
  southWest: Location;
  center: Location;
  area: number;
  address: string;
}

export default function MapAreaSelector() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<Location | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Location | null>(null);
  const [squareArea, setSquareArea] = useState<SquareArea | null>(null);
  const [areaName, setAreaName] = useState("");
  const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 17.6599, lng: 73.3004 });
  const [isDrawing, setIsDrawing] = useState(false);
  const mapRef = useRef<any>(null);
  const currentRectangleRef = useRef<any>(null);
  const savedRectangleRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const isMouseDownRef = useRef(false);
  const drawingListenersRef = useRef<any[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    if (!window.google) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
      center: currentLocation,
      zoom: 15,
      mapTypeId: 'hybrid',
      streetViewControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      disableDefaultUI: false,
    });

    mapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();

    // Initialize autocomplete
    const input = document.getElementById('search-input') as HTMLInputElement;
    if (input) {
      autocompleteRef.current = new google.maps.places.Autocomplete(input);
      autocompleteRef.current.bindTo('bounds', map);
      
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("No details available for input: '" + place.name + "'");
          return;
        }

        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        
        setCurrentLocation(newLocation);
        map.setCenter(newLocation);
        map.setZoom(15);
        
        if (markerRef.current) {
          markerRef.current.setPosition(newLocation);
        }
      });
    }

    setIsLoaded(true);
  };

  const setupDrawingListeners = () => {
    if (!mapRef.current || !isSelecting) return;

    // Remove old listeners
    drawingListenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    drawingListenersRef.current = [];

    const map = mapRef.current;

    // Disable default map dragging when selecting
    map.setOptions({ 
      draggable: false,
      draggableCursor: 'crosshair',
      draggingCursor: 'crosshair'
    });

    const mouseDownListener = google.maps.event.addListener(map, 'mousedown', (e: any) => {
      if (!e.latLng) return;
      
      e.stop(); // Prevent default map behavior
      isMouseDownRef.current = true;
      setIsDrawing(true);
      
      const point = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      
      setStartPoint(point);
      setCurrentPoint(point);
      
      if (currentRectangleRef.current) {
        currentRectangleRef.current.setMap(null);
      }
    });

    const mouseMoveListener = google.maps.event.addListener(map, 'mousemove', (e: any) => {
      if (!isMouseDownRef.current || !e.latLng) return;
      
      const point = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      
      setCurrentPoint(point);
    });

    const mouseUpListener = google.maps.event.addListener(map, 'mouseup', (e: any) => {
      if (!isMouseDownRef.current) return;
      
      isMouseDownRef.current = false;
      setIsDrawing(false);
      
      if (e.latLng) {
        const point = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setCurrentPoint(point);
      }
    });

    drawingListenersRef.current = [mouseDownListener, mouseMoveListener, mouseUpListener];
  };

  const removeDrawingListeners = () => {
    drawingListenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    drawingListenersRef.current = [];
    
    if (mapRef.current) {
      mapRef.current.setOptions({ 
        draggable: true,
        draggableCursor: 'grab',
        draggingCursor: 'grab'
      });
    }
  };

  useEffect(() => {
    if (isSelecting) {
      setupDrawingListeners();
    } else {
      removeDrawingListeners();
    }

    return () => {
      removeDrawingListeners();
    };
  }, [isSelecting]);

  useEffect(() => {
    if (!startPoint || !currentPoint || !mapRef.current) return;

    if (currentRectangleRef.current) {
      currentRectangleRef.current.setMap(null);
    }

    const bounds = calculateBounds(startPoint, currentPoint);
    
    currentRectangleRef.current = new google.maps.Rectangle({
      bounds: new google.maps.LatLngBounds(bounds.southWest, bounds.northEast),
      map: mapRef.current,
      fillColor: '#DC2626',
      fillOpacity: 0.25,
      strokeColor: '#DC2626',
      strokeOpacity: 0.9,
      strokeWeight: 3,
      editable: false,
      draggable: false,
      clickable: false,
    });
  }, [startPoint, currentPoint]);

  const calculateBounds = (point1: Location, point2: Location) => {
    return {
      northEast: {
        lat: Math.max(point1.lat, point2.lat),
        lng: Math.max(point1.lng, point2.lng),
      },
      southWest: {
        lat: Math.min(point1.lat, point2.lat),
        lng: Math.min(point1.lng, point2.lng),
      }
    };
  };

  const calculateArea = (ne: Location, sw: Location): number => {
    const earthRadius = 6378137;
    const latDistance = ((ne.lat - sw.lat) * Math.PI) / 180;
    const lngDistance = ((ne.lng - sw.lng) * Math.PI) / 180;
    const latMeters = latDistance * earthRadius;
    const lngMeters = lngDistance * earthRadius * Math.cos(((ne.lat + sw.lat) * Math.PI) / 360);
    return Math.abs(latMeters * lngMeters);
  };

  const getAddress = async (location: Location): Promise<string> => {
    if (!geocoderRef.current) return "Address not available";
    
    return new Promise((resolve) => {
      geocoderRef.current.geocode({ location }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve("Address not available");
        }
      });
    });
  };

  const startSelection = () => {
    if (!areaName.trim()) {
      alert("Please enter an area name first");
      return;
    }
    
    // If there's already an area, confirm replacement
    if (squareArea) {
      if (!confirm(`You already have an area "${squareArea.name}". Do you want to replace it?`)) {
        return;
      }
      clearExistingArea();
    }
    
    setIsSelecting(true);
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    isMouseDownRef.current = false;
  };

  const clearExistingArea = () => {
    if (savedRectangleRef.current) {
      savedRectangleRef.current.setMap(null);
      savedRectangleRef.current = null;
    }
    
    setSquareArea(null);
  };

  const cancelSelection = () => {
    setIsSelecting(false);
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    isMouseDownRef.current = false;
    
    if (currentRectangleRef.current) {
      currentRectangleRef.current.setMap(null);
      currentRectangleRef.current = null;
    }
  };

  const completeSelection = async () => {
    if (!startPoint || !currentPoint) {
      alert("Please select an area by dragging on the map");
      return;
    }

    const bounds = calculateBounds(startPoint, currentPoint);
    const area = calculateArea(bounds.northEast, bounds.southWest);
    
    if (area < 10) {
      alert("Selected area is too small. Please select a larger area.");
      return;
    }

    const center = {
      lat: (bounds.northEast.lat + bounds.southWest.lat) / 2,
      lng: (bounds.northEast.lng + bounds.southWest.lng) / 2,
    };
    const address = await getAddress(center);

    const newArea: SquareArea = {
      id: Date.now().toString(),
      name: areaName,
      northEast: bounds.northEast,
      southWest: bounds.southWest,
      center,
      area,
      address,
    };

    if (currentRectangleRef.current) {
      currentRectangleRef.current.setMap(null);
      currentRectangleRef.current = null;
    }

    if (savedRectangleRef.current) {
      savedRectangleRef.current.setMap(null);
    }

    const savedRect = new google.maps.Rectangle({
      bounds: new google.maps.LatLngBounds(bounds.southWest, bounds.northEast),
      map: mapRef.current,
      fillColor: '#10B981',
      fillOpacity: 0.3,
      strokeColor: '#059669',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: false,
      draggable: false,
      clickable: true,
    });

    google.maps.event.addListener(savedRect, 'click', () => {

      if (mapRef.current) {
        mapRef.current.panTo(newArea.center);
        mapRef.current.setZoom(15);
      }
    });
    
    savedRectangleRef.current = savedRect;
    setSquareArea(newArea);
    setIsSelecting(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setAreaName("");
    isMouseDownRef.current = false;

    if (mapRef.current) {
      mapRef.current.panTo(center);
    }
  };

  const deleteArea = () => {
    if (!squareArea) return;
    
    if (confirm(`Delete "${squareArea.name}"?`)) {
      // Remove saved rectangle from map
      if (savedRectangleRef.current) {
        savedRectangleRef.current.setMap(null);
        savedRectangleRef.current = null;
      }
      
      setSquareArea(null);
      setAreaName("");
    }
  };

  const getCurrentBounds = () => {
    if (!startPoint || !currentPoint) return null;
    const bounds = calculateBounds(startPoint, currentPoint);
    return {
      ...bounds,
      area: calculateArea(bounds.northEast, bounds.southWest)
    };
  };

  const currentBounds = getCurrentBounds();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Single Area Selector</h1>
          <p className="text-gray-600">Select one location/area on the map</p>
        </div>
        
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600 font-medium">Loading Google Maps...</p>
              </div>
            </div>
          )}

          <div id="map" className="w-full h-full"></div>

          {/* Search Box */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-96">
            <input
              id="search-input"
              type="text"
              placeholder="Search for a location..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Area Selection Controls */}
          <div className="absolute top-20 left-4 z-20 bg-white p-4 rounded-lg shadow-xl space-y-3 w-80">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Area Name
              </label>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="e.g., My Farm Field"
                disabled={isSelecting}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="flex space-x-2">
              {!isSelecting ? (
                <button
                  onClick={startSelection}
                  disabled={!areaName.trim()}
                  className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium shadow-md"
                >
                  {squareArea ? "🔄 Replace Area" : "🖊️ Draw Area"}
                </button>
              ) : (
                <>
                  <button
                    onClick={completeSelection}
                    disabled={!startPoint || !currentPoint}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium shadow-md"
                  >
                    ✅ Save Area
                  </button>
                  <button
                    onClick={cancelSelection}
                    className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-md hover:bg-red-700 transition font-medium shadow-md"
                  >
                    ❌ Cancel
                  </button>
                </>
              )}
            </div>

            {isSelecting && (
              <div className="text-sm text-white bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg shadow-lg animate-pulse">
                <p className="font-bold mb-1">🎯 DRAWING MODE ACTIVE</p>
                <p className="font-semibold">Click and drag on the map!</p>
                {isDrawing && (
                  <p className="font-bold mt-2 text-yellow-200">✏️ Drawing in progress...</p>
                )}
                {startPoint && currentPoint && !isDrawing && (
                  <p className="font-bold mt-2 text-green-200">✅ Release detected! Click Save Area</p>
                )}
              </div>
            )}

            {currentBounds && (
              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-2 border-blue-300 shadow-md">
                <p className="font-semibold mb-1">📏 Current Selection:</p>
                <p className="text-2xl font-bold text-blue-700">{(currentBounds.area / 10000).toFixed(3)} ha</p>
                <p className="text-xs text-gray-600 mt-1">
                  {(currentBounds.area).toFixed(0)} m² | {(currentBounds.area * 0.000247105).toFixed(3)} acres
                </p>
              </div>
            )}
          </div>

          {/* Current Area Display */}
          <div className="absolute top-4 right-4 z-20 bg-white p-4 rounded-lg shadow-xl w-80">
            <h3 className="font-bold text-lg mb-3 text-gray-900">
              📍 Selected Area {squareArea ? "✅" : "❌"}
            </h3>
            
            {!squareArea ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-sm text-gray-500">No area selected yet</p>
                <p className="text-xs text-gray-400 mt-1">Draw an area to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 border-2 border-green-500 rounded-lg bg-green-50 shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{squareArea.name}</h4>
                    <button
                      onClick={deleteArea}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold bg-white rounded-full p-1 shadow-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  <div className="bg-white p-2 rounded border border-green-200">
                    <p className="font-bold text-green-800 text-lg mb-1">
                      📏 {(squareArea.area / 10000).toFixed(3)} hectares
                    </p>
                    <p className="text-xs text-green-700">
                      {(squareArea.area).toFixed(0)} m² | {(squareArea.area * 0.000247105).toFixed(3)} acres
                    </p>
                  </div>
                  
                  <div className="mt-2 bg-gray-50 p-2 rounded text-xs border border-gray-200">
                    <p className="font-semibold mb-1">📍 Location:</p>
                    <p className="text-gray-600">{squareArea.address}</p>
                  </div>
                  
                  <div className="mt-2 bg-blue-50 p-2 rounded text-xs border border-blue-200">
                    <p className="font-semibold mb-1">🗺️ Coordinates:</p>
                    <p>NE: {squareArea.northEast.lat.toFixed(6)}, {squareArea.northEast.lng.toFixed(6)}</p>
                    <p>SW: {squareArea.southWest.lat.toFixed(6)}, {squareArea.southWest.lng.toFixed(6)}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (mapRef.current && squareArea) {
                      const bounds = new google.maps.LatLngBounds(squareArea.southWest, squareArea.northEast);
                      mapRef.current.fitBounds(bounds);
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-md"
                >
                  🔍 Focus on Area
                </button>
              </div>
            )}
          </div>

          {/* Big Drawing Instruction Overlay */}
          {isSelecting && !isDrawing && !startPoint && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <div className="text-white bg-black bg-opacity-80 px-8 py-6 rounded-2xl text-xl font-bold shadow-2xl border-4 border-yellow-400 animate-pulse">
                <p className="text-3xl mb-2">🖱️ CLICK AND DRAG ON THE MAP</p>
                <p className="text-center text-yellow-300">Draw your area now!</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
          <h2 className="font-bold text-gray-900 mb-2">📖 Quick Guide</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800">
            <li><strong>Search:</strong> Use the search box to find any location worldwide</li>
            <li><strong>Name:</strong> Enter a name for your area</li>
            <li><strong>Draw:</strong> Click "Draw Area" and drag on the map</li>
            <li><strong>Save:</strong> Click "Save Area" to store your selection</li>
            <li><strong>Replace:</strong> Draw again to replace the current area</li>
            <li><strong>Delete:</strong> Use the delete button to remove the area</li>
          </ol>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-yellow-800">⚠️ Single Area Limitation</p>
            <p className="text-xs text-yellow-700 mt-1">You can only select one area at a time. Drawing a new area will replace the existing one.</p>
          </div>
        </div>
      </div>
    </div>
  );
}