import React, { useState, useEffect } from 'react';


import LeftPanel from './components/LeftPanel';
import MapContainer from './components/MapContainer';
import LocationForm from './components/LocationForm';
import Login from './components/Login';
import ImageUploadPage from './components/ImageUploadPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapContainer/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/locationsform" element={<LocationForm/>} />
        <Route path="/locations/:locationId/images" element={<ImageUploadPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
