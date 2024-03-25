import React from 'react';
import './styles/locationCards.css'; // Assuming styles for location cards
import { useNavigate } from 'react-router-dom';

const LocationCard = ({ location }) => {
  const { name, country, locationType, id } = location;
  const navigate = useNavigate();

  const handleImageNavigation = (id) => {
    navigate(`/locations/${id}/images`); // Navigate to images page with location ID
  };

  return (
    <div onClick={() => handleImageNavigation(id)}>
      <div className="location-card">
        <h2>{name}</h2>
        <p>
          <b>Country:</b> {country}
        </p>
        <p>
          <b>Location Type:</b> {locationType}
        </p>
      </div>
    </div>
  );
};

export default LocationCard;
