import { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig'; // Assuming firebaseConfig exports firestore
import { collection, getDocs } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/Map.css'; // Assuming styles for the map
import Header from './Header'; // Assuming a Header component

const MapContainerSection = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const locationsRef = collection(firestore, 'locations');
        const snapshot = await getDocs(locationsRef);

        const fetchedLocations = [];
        snapshot.forEach((doc) => {
          const location = doc.data();
          // Assuming your coordinates are stored in a property called "coordinates"

          // Convert coordinates string to number array
          const coordinatesString = location.coordinates;
          const coordArray = coordinatesString.split(',').map(Number);

          fetchedLocations.push({ ...location, coordinates: coordArray }); // Add coordinates as an array
        });

        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError(error); // Set error state
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or error
      }
    };

    fetchLocations();
  }, []);

  return (
    <>
      <Header />

      <div>
        {isLoading && <p className="loading">Loading locations...</p>}
        {error && <div className="error">Error: {error.message}</div>}
        {!isLoading && !error && ( // Display map only if no errors or loading
          <MapContainer
            className="Map"
            center={[-1.2900988923095413, 36.81743532365925]} // Adjust center if needed
            zoom={5}
            scrollWheelZoom={false}
            style={{ height: '600px', marginTop: '20px', border: '2px', borderColor: 'black', borderStyle: 'solid', borderRadius: '15px' }}
          >
            <TileLayer
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>Hass Locations Developed in Collaboration with openstreetmap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
              <Marker key={location.id} position={location.coordinates}> {/* Unique key for each marker */}
                {/* Assuming coordinates is an array like [longitude, latitude] */}
                <Popup>
                  <div className='pop-up-section'>
                  {location.name} ({location.country}) 
                  {/* add the onclick function to carry the data to the images page  */}
                  <button  className='pop-up-button'>Images</button>
                  </div>
                  
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </>
  );
};

export default MapContainerSection;
