import React, { useState, useEffect } from 'react';


import LeftPanel from './components/LeftPanel';
import MapContainer from './components/MapContainer';
import LocationForm from './components/LocationForm';
import { auth } from './firebaseConfig';
import Login from './components/Login';
import ImageUploadPage from './components/ImageUploadPage';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapContainer/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/locationsform" element={<LocationForm/>} />
        <Route path='/locations/:id/images' element={<ImageUploadPage/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
