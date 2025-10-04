"use client";

import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock initial farms data
const initialFarms = [
  {
    id: 1,
    name: "Sunny Meadows Farm",
    location: { lat: 40.7128, lng: -74.006 },
    locationName: "New York, NY",
  },
  {
    id: 2,
    name: "Green Valley Ranch",
    location: { lat: 34.0522, lng: -118.2437 },
    locationName: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Riverbend Farm",
    location: { lat: 41.8781, lng: -87.6298 },
    locationName: "Chicago, IL",
  },
];

// Map configuration
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

interface Farm {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  locationName: string;
}

interface NewFarm {
  name: string;
  location: { lat: number; lng: number } | null;
  locationName: string;
}

// Custom marker icon as SVG data URL
const customMarkerIcon = {
  url: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C10.477 2 6 6.477 6 12C6 19 16 30 16 30C16 30 26 19 26 12C26 6.477 21.523 2 16 2Z" fill="#DC2626"/>
      <path d="M16 8C13.79 8 12 9.79 12 12C12 14.21 13.79 16 16 16C18.21 16 20 14.21 20 12C20 9.79 18.21 8 16 8Z" fill="white"/>
    </svg>
  `)}`,
  scaledSize: { width: 32, height: 32 } as google.maps.Size,
  anchor: { x: 16, y: 32 } as google.maps.Point,
};

export default function FarmDashboard() {
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFarm, setNewFarm] = useState<NewFarm>({
    name: "",
    location: null,
    locationName: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Handle map click to set location
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lat, lng };

    setSelectedLocation(newLocation);
    setNewFarm((prev) => ({
      ...prev,
      location: newLocation,
      locationName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
    }));
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFarm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFarm.name || !newFarm.location) {
      alert("Please provide a farm name and select a location on the map.");
      return;
    }

    const farm: Farm = {
      id: farms.length + 1,
      name: newFarm.name,
      location: newFarm.location,
      locationName: newFarm.locationName,
    };

    setFarms((prev) => [...prev, farm]);
    setNewFarm({
      name: "",
      location: null,
      locationName: "",
    });
    setSelectedLocation(defaultCenter);
    setIsModalOpen(false);
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewFarm({
      name: "",
      location: null,
      locationName: "",
    });
    setSelectedLocation(defaultCenter);
  };

  // Handle map load
  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Your Farms</h2>
          <Link href={"/dashboard/create-farm"}>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            + Create New Farm
          </button>
          </Link>
        </div>

        {/* Farms Grid */}
        {farms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No farms yet. Create your first farm!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {farm.name}
                  </h3>
                  <p className="text-gray-600 mb-4">📍 {farm.locationName}</p>
                  <div className="flex justify-end items-center">
                    <Button className="w-full bg-red-400 hover:bg-red-500 cursor-pointer font-medium text-sm">
                      Play
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Farm Modal - Full Screen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleModalClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Farm</h1>
                    <p className="text-gray-500">Set up your new agricultural venture</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="farm-form"
                    className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-300 font-medium shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create Farm</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            <form id="farm-form" onSubmit={handleSubmit} className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Form Fields */}
                <div className="space-y-8">
                  {/* Farm Name Section */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Farm Information</h2>
                        <p className="text-gray-500">Basic details about your farm</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Farm Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newFarm.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Sunny Meadows Farm"
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-transparent transition duration-300"
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Choose a memorable name for your farm
                      </p>
                    </div>
                  </div>

                  {/* Additional Farm Details (Optional) */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>
                        <p className="text-gray-500">Optional farm information</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Farm Type
                        </label>
                        <select className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-transparent transition duration-300">
                          <option value="">Select farm type</option>
                          <option value="crops">Crop Farm</option>
                          <option value="livestock">Livestock Farm</option>
                          <option value="dairy">Dairy Farm</option>
                          <option value="organic">Organic Farm</option>
                          <option value="mixed">Mixed Farming</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Farm Size (acres)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 100"
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-transparent transition duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Map */}
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-2xl p-6 h-full">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Farm Location</h2>
                        <p className="text-gray-500">Select your farm's location on the map</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden border border-gray-300 shadow-lg h-96">
                        <LoadScript
                          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                          onLoad={handleMapLoad}
                        >
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={selectedLocation}
                            zoom={15}
                            onClick={handleMapClick}
                            options={{
                              streetViewControl: true,
                              mapTypeControl: true,
                              fullscreenControl: true,
                              zoomControl: true,
                              mapTypeId: "satellite",
                            }}
                          >
                            {selectedLocation && (
                              <Marker
                                position={selectedLocation}
                                icon={customMarkerIcon}
                              />
                            )}
                          </GoogleMap>
                        </LoadScript>
                      </div>

                      {newFarm.locationName && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="font-medium text-green-800">Location Selected</p>
                              <p className="text-green-600 text-sm">{newFarm.locationName}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="font-medium text-blue-800">How to select location</p>
                            <p className="text-blue-600 text-sm">
                              Click anywhere on the map to set your farm location. Use the controls to zoom, switch to satellite view, or explore street view.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-6">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-300 font-medium"
                    >
                      Cancel Creation
                    </button>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500 text-sm">
                        {newFarm.name && newFarm.location ? 'Ready to create farm' : 'Fill in all required fields'}
                      </span>
                      <button
                        type="submit"
                        disabled={!newFarm.name || !newFarm.location}
                        className="px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 font-medium shadow-lg flex items-center space-x-3"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-lg">Create Farm</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}