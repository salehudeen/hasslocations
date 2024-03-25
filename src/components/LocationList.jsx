import React, { useState, useEffect } from 'react';
import {
  getDocs,
  collection,
  query,
  limit,
  startAfter,
  where,
} from 'firebase/firestore';
import { firestore } from '../firebaseConfig'; // Assuming firebaseConfig exports firestore
import LocationCard from './LocationCard';
import './styles/locationlist.css'; // Assuming styles for location list

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10); // Number of locations per page

  useEffect(() => {
    const fetchLocations = async (searchQuery = '') => {
      const locationsRef = collection(firestore, 'locations');
      let q = query(locationsRef); // Base query

      if (searchQuery) {
        q = q.where('name', 'startsWith', searchQuery.toLowerCase()); // Filter by search query
      }

      // Fetch locations based on searchQuery or pagination
      const startingLocation = locations[locations.length - 1]?.name || '';

      // Apply limit directly to the new query object (corrected)
      q = query(q, limit(limitPerPage)); 

      if (startingLocation) {
        q = startAfter(startingLocation); // Start after the last retrieved location
      }

      try {
        console.log('Constructed Query:', q); // Log for debugging
        const querySnapshot = await getDocs(q);
        const fetchedLocations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (searchQuery) {
          setLocations(fetchedLocations); // Overwrite for search
        } else {
          setLocations([...locations, ...fetchedLocations]); // Append for pagination
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (searchQuery) {
      fetchLocations(searchQuery); // Fetch on initial search or search change
    } else {
      fetchLocations(); // Fetch all locations on mount
    }
  }, [searchQuery, pageNumber]); // Refetch on searchQuery or page change (optional)

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPageNumber(1); // Reset page for new search
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  // Check if there are more pages to display
  const hasMorePages = locations.length % limitPerPage === 0; // Basic check

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        placeholder="Search location names"
        onChange={handleSearchChange}
      />
      <div className="location-list">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
        {!locations.length && !searchQuery && <p>No locations found.</p>} {/* Display message if no locations initially */}
        {searchQuery && !locations.length && <p>No results for "{searchQuery}".</p>} {/* Display message for empty search results */}
      </div>
      {hasMorePages && (
        <div className="pagination">
          <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>
            Previous
          </button>
          <span>Page {pageNumber} of {Math.ceil(locations.length / limitPerPage)}</span>
          <button onClick={() => handlePageChange(pageNumber + 1)} disabled={!hasMorePages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationList;
