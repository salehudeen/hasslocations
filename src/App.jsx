import React, { useState, useEffect } from 'react';


import LeftPanel from './components/LeftPanel';
import MapContainer from './components/MapContainer';
import LocationForm from './components/LocationForm';
import { auth } from './firebaseConfig';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapContainer/>} />
        <Route path="/locationsform" element={<LocationForm/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
