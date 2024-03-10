import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig'; // Assuming firebase.js imports firestore
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const LeftPanel = () => {
  const [countries, setCountries] = useState({}); // State to store countries and their locations

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsRef = firestore.collection('locations');
      const snapshot = await locationsRef.get();

      const countryLocations = {};
      snapshot.forEach((doc) => {
        const location = doc.data();
        const { country } = location;
        countryLocations[country] = countryLocations[country] || [];
        countryLocations[country].push(location);
      });

      setCountries(countryLocations);
    };

    fetchLocations();
  }, []);

  const [open, setOpen] = useState({}); // Track open/closed state for each country dropdown

  const handleClick = (country) => {
    setOpen({ ...open, [country]: !open[country] }); // Toggle open/closed state
  };

  return (
    <List>
      {Object.keys(countries).map((country) => (
        <React.Fragment key={country}>
          <ListItem button onClick={() => handleClick(country)}>
            <ListItemText primary={country} />
            {open[country] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open[country]} timeout="auto" unmountOnExit>
            {countries[country].map((location) => (
              <ListItem key={location.id} button dense>
                <ListItemText primary={location.name} />
              </ListItem>
            ))}
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default LeftPanel;
