import { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

const MapContainerSection = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null); // Add state for error handling

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsRef = collection(firestore, 'locations');
        console.log(locationsRef); // Verify locationsRef before get()
        const snapshot = await locationsRef.get();

        const fetchedLocations = [];
        snapshot.forEach((doc) => {
          const location = doc.data();
          fetchedLocations.push(location);
        });

        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError(error); // Set error state for display
      }
    };

    fetchLocations();
  }, []);

  return (
    <MapContainer center={[-1.2900988923095413, 36.81743532365925]} zoom={4} scrollWheelZoom={false} style={{height:"600px"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker key={location.id} position={[location.latitude, location.longitude]}>
          <Popup>
            {location.name} ({location.country})
          </Popup>
        </Marker>
      ))}
      {error && <div className="error">Error: {error.message}</div>} // Display error message, if any
    </MapContainer>
  );
};

export default MapContainerSection;
