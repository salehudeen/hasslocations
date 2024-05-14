import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
const LocationList = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsRef = collection(firestore, 'locations');
      const snapshot = await getDocs(locationsRef);
      const locationList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLocations(locationList);
    };

    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'locations', id));
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div>
      <h2>Locations List</h2>
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
              <TableCell>
                <Link to={`/locations/${location.id}`}>{location.name}</Link>
              </TableCell>
              <TableCell>{location.country}</TableCell>
              <TableCell>{location.locationType}</TableCell>
              <TableCell
               style={{gap:'10px'}}
              >
                
                <Button variant="destructive" onClick={() => handleDelete(location.id)}>
                  Delete
                </Button>
                <Button variant="default" as={Link} to={`/locations/${location.id}/images`}>
                  Images
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LocationList;