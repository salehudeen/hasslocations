import React, { useState, useEffect } from 'react';



import MapContainer from './components/MapContainer';
import LocationForm from './components/LocationForm';
import Login from './components/Login';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocationDetail from './components/LocationDetail';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapContainer/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/locationsform" element={<LocationForm/>} />
        <Route path="/locations/:id/images" element={<LocationDetail/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
