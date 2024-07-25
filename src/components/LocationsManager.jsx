import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { firestore, auth, storage } from '../firebaseConfig'; // Ensure correct imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from 'react-firebase-hooks/auth';

const LocationsManager = () => {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [country, setCountry] = useState('');
  const [locationType, setLocationType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const countries = ['Kenya', 'Uganda', 'Tanzania', 'South Sudan', 'DRC', 'Rwanda', 'Zambia'];
  const locationTypes = ['Headquarters', 'Service Station', 'Fuel-Depo', 'Lubes-Depo'];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const locationsRef = collection(firestore, 'locations');
    const snapshot = await getDocs(locationsRef);
    const locationList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setLocations(locationList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uniqueId = uuidv4();
    const locationsRef = collection(firestore, 'locations');
    const newLocation = { id: uniqueId, name, coordinates, country, locationType };

    try {
      await addDoc(locationsRef, newLocation);
      fetchLocations();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      alert('You must be logged in to delete locations.');
      return;
    }
    try {
      await deleteDoc(doc(firestore, 'locations', id));
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleImageClick = (locationId) => {
    navigate(`/locations/${locationId}/images`);
  };

  const resetForm = () => {
    setName('');
    setCoordinates('');
    setCountry('');
    setLocationType('');
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hass Petroleum Locations</h1>
        {user && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add New Location</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Location Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <Input id="coordinates" value={coordinates} onChange={(e) => setCoordinates(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="locationType">Location Type</Label>
                  <Select value={locationType} onValueChange={setLocationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location type" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Add Location</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Location Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.country}</TableCell>
                <TableCell>{location.locationType}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {user && (
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(location.id)}>
                        Delete
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleImageClick(location.id)}>
                      Images
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LocationsManager;
