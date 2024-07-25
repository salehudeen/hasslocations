import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { MapPin, Triangle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import 'leaflet/dist/leaflet.css';
import './styles/Map.css';

// This component will handle map zooming
function MapUpdater({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapContainerSection = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate('/login');
  }

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const locationsRef = collection(firestore, 'locations');
        const snapshot = await getDocs(locationsRef);

        const fetchedLocations = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          coordinates: doc.data().coordinates.split(',').map(Number)
        }));

        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const locationsByCountry = locations.reduce((acc, location) => {
    const { country } = location;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(location);
    return acc;
  }, {});

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
      </aside>
      
      <div className="Mapheader">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Hass Petroleum Locations</h1>
          <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm"
            onClick={handleLogin}
          >
            Login
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex-col items-start gap-8 md:flex">
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(locationsByCountry).map(([country, locs]) => (
                <AccordionItem value={country} key={country}>
                  <AccordionTrigger>{country}</AccordionTrigger>
                  <AccordionContent>
                    {locs.map((location) => (
                      <Button
                        key={location.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location.name}
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            {isLoading && <p className="loading">Loading locations...</p>}
            {error && <div className="error">Error: {error.message}</div>}
            {!isLoading && !error && (
              <MapContainer
                className="Map"
                center={[-1.2900988923095413, 36.81743532365925]}
                zoom={5}
                scrollWheelZoom={false}
                style={{
                  height: '600px',
                  marginTop: '20px',
                  border: '2px',
                  borderColor: 'black',
                  borderStyle: 'solid',
                  borderRadius: '15px',
                }}
              >
                <TileLayer
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>Hass Locations Developed in Collaboration with openstreetmap</a> contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location) => (
                  <Marker key={location.id} position={location.coordinates}>
                    <Popup>
                      <div className="pop-up-section">
                        {location.name} ({location.country})
                        <button className="pop-up-button">Images</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {selectedLocation && (
                  <MapUpdater
                    center={selectedLocation.coordinates}
                    zoom={12}
                  />
                )}
              </MapContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapContainerSection;