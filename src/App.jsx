import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import MapContainer from './components/MapContainer';
import LocationForm from './components/LocationForm';
import { auth } from './firebaseConfig';

function App() {
  

  return (
    <>
      <Header/>
      <LocationForm/>
      <MapContainer/>

    </>
  );
}

export default App;
