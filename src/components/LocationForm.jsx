import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Header from './Header';
import { addDoc,collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import './lform.css'
const LocationForm = () => {
  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState(0);
  const [locationType,setLocationtype]=useState('')
  const [country, setCountry] = useState('');

  const countries = ['Kenya', 'Uganda', 'Tanzania', 'South Sudan', 'DRC', 'Rwanda', 'Zambia'];
  const Location_Types = ['Headquarters', 'Service Station', 'Fuel-Depo', 'Lubes-Depo'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Implement logic to add location to Firebase Firestore (assuming authentication)
    const locationsRef = collection(firestore, 'locations'); // Reference to locations collection
    const newLocation = {
      name,
      coordinates,     
      country,
    };

    try {
      const docRef = await addDoc(locationsRef, newLocation);
      console.log('Document written with ID:', docRef.id);
      // Clear form after successful submission
      setName('');
      setCoordinates(0);
      setCountry('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
   


  return (
    <>
    <Header/>

    <form className='location-form' onSubmit={handleSubmit}>
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

      {/* location type field  */}
      <FormControl fullWidth>
        <InputLabel id="country-label">Location Type</InputLabel>
        <Select
          labelId="country-label"
          id="country"
          value={locationType}
          label="Location Type"
          onChange={(e) => setCountry(e.target.value)}
        >
          {Location_Types.map((locationType) => (
            <MenuItem key={Location_Types} value={Location_Types}>
              {locationType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained">
        Add Location
      </Button>
    </form>
    </>
  );
};

export default LocationForm;
