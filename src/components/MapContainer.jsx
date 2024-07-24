import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";
import { firestore } from '../firebaseConfig'; // Assuming firebaseConfig exports firestore
import { collection, getDocs } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/Map.css'; // Assuming styles for the map
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MapContainerSection = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate('/login');
  }

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const locationsRef = collection(firestore, 'locations');
        const snapshot = await getDocs(locationsRef);

        const fetchedLocations = [];
        snapshot.forEach((doc) => {
          const location = doc.data();

          const coordinatesString = location.coordinates;
          const coordArray = coordinatesString.split(',').map(Number);

          fetchedLocations.push({ ...location, coordinates: coordArray }); // Add coordinates as an array
        });

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

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2"></nav>
        <nav className="mt-auto grid gap-1 p-2">
          
        </nav>
      </aside>
      
      <div className="Mapheader">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Hass Petroleum Locations</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="drawer-z-index max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Locations</DrawerTitle>
                <DrawerDescription>
                  Highlight the locations.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                {Object.keys(locationsByCountry).map((country) => (
                  <fieldset key={country} className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">{country}</legend>
                    <div className="grid gap-3">
                      {locationsByCountry[country].map((location) => (
                        <Label key={location.id}>{location.name}</Label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </form>
            </DrawerContent>
          </Drawer>
          <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm"
            onClick={handleLogin}
          >
            Login
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Locations</legend>
                {Object.keys(locationsByCountry).map((country) => (
                  <div key={country} className="grid gap-3">
                    <Label>{country}</Label>
                    {locationsByCountry[country].map((location) => (
                      <Label key={location.id}>{location.name}</Label>
                    ))}
                  </div>
                ))}
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            
            <div className="flex-1" />
            {isLoading && <p className="loading">Loading locations...</p>}
            {error && <div className="error">Error: {error.message}</div>}
            {!isLoading && !error && (
              <MapContainer
                className="Map"
                center={[-1.2900988923095413, 36.81743532365925]} // Adjust center if needed
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
                    {/* Unique key for each marker */}
                    {/* Assuming coordinates is an array like [longitude, latitude] */}
                    <Popup>
                      <div className="pop-up-section">
                        {location.name} ({location.country})
                        {/* add the onclick function to carry the data to the images page  */}
                        <button className="pop-up-button">Images</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapContainerSection;
