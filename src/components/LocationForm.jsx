import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { addDoc,collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const LocationForm = () => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [country, setCountry] = useState('');

  const countries = ['Kenya', 'Uganda', 'Tanzania', 'South Sudan', 'DRC', 'Rwanda', 'Zambia'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Implement logic to add location to Firebase Firestore (assuming authentication)
    const locationsRef = collection(firestore, 'locations'); // Reference to locations collection
    const newLocation = {
      name,
      latitude,
      longitude,
      country,
    };

    try {
      const docRef = await addDoc(locationsRef, newLocation);
      console.log('Document written with ID:', docRef.id);
      // Clear form after successful submission
      setName('');
      setLatitude(0);
      setLongitude(0);
      setCountry('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Location Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Latitude"
        type="number"
        variant="outlined"
        value={latitude}
        onChange={(e) => setLatitude(parseFloat(e.target.value))}
        required
      />
      <TextField
        label="Longitude"
        type="number"
        variant="outlined"
        value={longitude}
        onChange={(e) => setLongitude(parseFloat(e.target.value))}
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
      <Button type="submit" variant="contained">
        Add Location
      </Button>
    </form>
  );
};

export default LocationForm;
