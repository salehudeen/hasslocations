import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import for UUID generation
import { firestore, auth } from '../firebaseConfig'; // Assuming firebaseConfig exports firestore and auth
import './styles/lform.css'; // Assuming lform.css styles your form
import LocationList from './LocationList';



const LocationForm = () => {
  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState(0);
  const [locationType, setLocationType] = useState('');
  const [country, setCountry] = useState('');

  const countries = ['Kenya', 'Uganda', 'Tanzania', 'South Sudan', 'DRC', 'Rwanda', 'Zambia'];
  const Location_Types = ['Headquarters', 'Service Station', 'Fuel-Depo', 'Lubes-Depo'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for authentication (implementation omitted for brevity)
    // You'll need to implement logic to check if the user is authenticated
    // before adding locations.

    // Generate a unique ID using uuidv4
    const uniqueId = uuidv4();

    // Implement logic to add location to Firebase Firestore
    const locationsRef = collection(firestore, 'locations');
    const newLocation = {
      id: uniqueId, // Include the unique ID
      name,
      coordinates,
      country,
      locationType,
    };

    try {
      const docRef = await addDoc(locationsRef, newLocation);
      console.log('Document written with ID:', docRef.id);
      // Clear form after successful submission
      setName('');
      setCoordinates(0);
      setCountry('');
      setLocationType('');
    } catch (error) {
      console.error('Error adding document: ', error);
      // Handle errors appropriately, e.g., display an error message to the user
    }
  };

  return (
    <>
    

      <form className="location-form" onSubmit={handleSubmit}>
        <TextField
          label="Location Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="coordinates"
          type="float"
          variant="outlined"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          required
        />

        <FormControl fullWidth>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            id="country"
            value={country}
            label="Country"
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="Location_Types-label">Location Type</InputLabel>
          <Select
            labelId="Location_Types-label"
            id="Location_Types"
            value={locationType}
            label="Location Type"
            onChange={(e) => setLocationType(e.target.value)}
          >
            {Location_Types.map((locationType) => (
              <MenuItem key={locationType} value={locationType}>
                {locationType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Add Location
        </Button>
      </form>

     <LocationList/>
    </>
  );
};

export default LocationForm;
