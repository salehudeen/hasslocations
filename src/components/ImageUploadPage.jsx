import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore'; // Replace with your Firebase instance
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Replace with your Firebase Storage instance
import { firestore, storage } from '../firebaseConfig'; // Assuming Firebase config import

const ImageUploadPage = () => {
  const { locationId } = useParams(); // Get location ID from route param
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Stores uploaded image URL
  const [locationData, setLocationData] = useState(null); // Stores retrieved location data

  // Fetch location data on component mount
  useEffect(() => {
    const fetchLocationData = async () => {
      const locationRef = doc(collection(firestore, 'locations'), locationId);
      try {
        const locationSnap = await getDoc(locationRef);
        if (locationSnap.exists) {
          setLocationData(locationSnap.data());
        } else {
          console.error('Location not found!');
          // Handle location not found (e.g., display error message or redirect)
          navigate('/locations'); // Consider redirecting to locations list
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchLocationData();
  }, [locationId]); // Run only once on component mount or when locationId changes

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !locationData) return; // Handle missing image or data

    const storageRef = ref(storage, `locations/${locationId}/${selectedImage.name}`);
    try {
      await uploadBytes(storageRef, selectedImage);
      const imageURL = await getDownloadURL(storageRef); // Get uploaded image URL
      setImageUrl(imageURL);

      // Update location document with image URL
      const updatedLocation = {
        ...locationData,
        images: locationData.images ? [...locationData.images, imageURL] : [imageURL],
      };
      await updateDoc(doc(collection(firestore, 'locations'), locationId), updatedLocation);

      console.log('Image uploaded successfully:', imageURL);
      setSelectedImage(null); // Clear image selection after upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      {locationData ? (
        <>
          <h2>Upload Images for Location: {locationData.name}</h2>
          <input type="file" onChange={handleImageChange} />
          <button onClick={handleImageUpload}>Upload Image</button>
          {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
        </>
      ) : (
        <p>Loading location data...</p>
      )}
      <button onClick={() => navigate('/locations')}>Back to Locations</button>
    </div>
  );
};

export default ImageUploadPage;
